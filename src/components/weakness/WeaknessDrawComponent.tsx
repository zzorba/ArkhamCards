import React, { ReactNode } from 'react';
import { filter, find, flatMap, forEach, head, keys, map, range, shuffle } from 'lodash';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FlipCard from 'react-native-flip-card';

import { t } from 'ttag';
import { Slots, WeaknessSet } from 'actions/types';
import Card from 'data/Card';
import withWeaknessCards, { WeaknessCardProps } from './withWeaknessCards';
import Button from 'components/core/Button';
import ChooserButton from 'components/core/ChooserButton';
import ToggleFilter from 'components/core/ToggleFilter';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import CardDetailComponent from 'components/card/CardDetailView/CardDetailComponent';
import { CARD_RATIO, HEADER_HEIGHT, TABBAR_HEIGHT } from 'styles/sizes';
import typography from 'styles/typography';
const PLAYER_BACK = require('../../../assets/player-back.png');

const PADDING = 32;

interface OwnProps {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateDrawnCard: (code: string, assignedCards: Slots) => void;
  playerCount?: number;
  campaignMode?: boolean;
  customHeader?: ReactNode;
  customFlippedHeader?: ReactNode;
  saving?: boolean;
}
type Props = OwnProps & WeaknessCardProps & DimensionsProps;

interface State {
  headerHeight: number;
  flippedHeaderHeight: number;
  selectedTraits: string[];
  standalone: boolean;
  multiplayer: boolean;
  nextCard?: Card;
  flipped: boolean;
  drawNewCard: boolean;
}

class WeaknessDrawComponent extends React.Component<Props, State> {
  _onHeaderLayout!: (event: LayoutChangeEvent) => void;
  _onFlippedHeaderLayout!: (event: LayoutChangeEvent) => void;

  constructor(props: Props) {
    super(props);

    const multiplayer = props.playerCount !== 1;
    const standalone = false;
    this.state = {
      headerHeight: 32,
      flippedHeaderHeight: 32,
      selectedTraits: [],
      standalone,
      multiplayer,
      nextCard: this.nextCard([], multiplayer, standalone),
      flipped: false,
      drawNewCard: false,
    };

    this._onHeaderLayout = this.onHeaderLayout.bind(this, false);
    this._onFlippedHeaderLayout = this.onHeaderLayout.bind(this, true);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.weaknessSet !== prevProps.weaknessSet && !this.state.flipped) {
      const {
        selectedTraits,
        multiplayer,
        standalone,
      } = this.state;
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        nextCard: this.nextCard(selectedTraits, multiplayer, standalone),
      });
    }
  }

  calculateCardDimensions() {
    const {
      width,
      height,
    } = this.props;
    const {
      headerHeight,
    } = this.state;

    const wBasedWidth = width - PADDING * 2;
    const wBasedHeight = Math.round(wBasedWidth * CARD_RATIO);

    const hBasedHeight = height - HEADER_HEIGHT - TABBAR_HEIGHT - PADDING * 2 - headerHeight;
    const hBasedWidth = Math.round(hBasedHeight / CARD_RATIO);

    if (hBasedHeight < wBasedHeight) {
      return {
        cardWidth: hBasedWidth,
        cardHeight: hBasedHeight,
      };
    }
    return {
      cardWidth: wBasedWidth,
      cardHeight: wBasedHeight,
    };
  }

  onHeaderLayout(
    flipped: boolean,
    event: LayoutChangeEvent
  ) {
    if (flipped) {
      this.setState({
        flippedHeaderHeight: event.nativeEvent.layout.height,
      });
    } else {
      this.setState({
        headerHeight: event.nativeEvent.layout.height,
      });
    }
  }

  _drawAnother = () => {
    this.setState({
      flipped: false,
      drawNewCard: true,
    });
  };

  _flipCard = () => {
    if (!this.state.flipped && !this.state.drawNewCard) {
      const {
        updateDrawnCard,
        weaknessSet: {
          assignedCards,
        },
      } = this.props;
      const {
        nextCard,
      } = this.state;
      if (nextCard) {
        const newAssignedCards = Object.assign({}, assignedCards);
        if (!newAssignedCards[nextCard.code]) {
          newAssignedCards[nextCard.code] = 0;
        }
        newAssignedCards[nextCard.code]++;

        this.setState({
          flipped: true,
        }, () => {
          updateDrawnCard(nextCard.code, newAssignedCards);
        });
      }
    }
  };

  _onTraitsChange = (values: string[]) => {
    this.setState({
      selectedTraits: values,
    }, this._selectNextCard);
  };

  _onFlipEnd = () => {
    if (this.state.drawNewCard) {
      setTimeout(this._selectNextCard, 200);
    }
  };

  _selectNextCard = () => {
    const {
      selectedTraits,
      multiplayer,
      standalone,
    } = this.state;
    this.setState({
      drawNewCard: false,
      nextCard: this.nextCard(selectedTraits, multiplayer, standalone),
    });
  };

  nextCard(
    selectedTraits: string[],
    multiplayer: boolean,
    standalone: boolean
  ) {
    const {
      weaknessSet: {
        assignedCards,
      },
    } = this.props;
    const cards = shuffle(
      flatMap(this.selectedCards(selectedTraits, multiplayer, standalone),
        card => {
          return map(
            range(0, (card.quantity || 0) - (assignedCards[card.code] || 0)),
            () => card);
        }));

    const card = head(cards);
    if (card && card.imagesrc) {
      FastImage.preload([
        {
          uri: `https://arkhamdb.com/${card.imagesrc}`,
        },
      ]);
    }
    return card;
  }

  selectedCards(
    selectedTraits: string[],
    multiplayer: boolean,
    standalone: boolean
  ): Card[] {
    return filter(this.cards(), card => {
      const matchesTrait = !selectedTraits.length ||
        !!find(selectedTraits, trait => (
          card.traits_normalized &&
          card.traits_normalized.indexOf(`#${trait.toLowerCase()}#`) !== -1)
        );
      const matchesMultiplayerOnly = multiplayer || !!(
        card.real_text && card.real_text.indexOf('Multiplayer only.') === -1
      );
      const matchesCampaignModeOnly = !standalone || !!(
        card.real_text && card.real_text.indexOf('Campaign Mode only.') === -1
      );

      return matchesTrait && matchesMultiplayerOnly && matchesCampaignModeOnly;
    });
  }

  cards() {
    const {
      weaknessSet: {
        packCodes,
        assignedCards,
      },
      cards,
    } = this.props;
    const packSet = new Set(packCodes);
    return filter(cards, card => (
      packSet.has(card.pack_code) &&
      (assignedCards[card.code] || 0) < (card.quantity || 0)
    ));
  }

  allTraits() {
    const {
      selectedTraits,
    } = this.state;
    const traitsMap: { [trait: string]: number } = {};
    forEach(this.cards(), card => {
      if (card.traits) {
        forEach(
          filter<string>(map(card.traits.split('.'), t => t.trim()), t => !!t),
          t => {
            traitsMap[t] = 1;
          });
      }
    });
    forEach(selectedTraits, trait => {
      traitsMap[trait] = 1;
    });
    return keys(traitsMap).sort();
  }

  _onToggleChange = (key: string, value: boolean) => {
    if (key === 'multiplayer') {
      this.setState({
        multiplayer: value,
      }, this._selectNextCard);
    } else if (key === 'standalone') {
      this.setState({
        standalone: value,
      }, this._selectNextCard);
    }
  };

  renderHeaderContent() {
    const {
      componentId,
      customHeader,
      customFlippedHeader,
      saving,
      campaignMode,
      fontScale,
    } = this.props;
    const {
      selectedTraits,
      flipped,
      headerHeight,
      flippedHeaderHeight,
      standalone,
      multiplayer,
    } = this.state;
    if (saving) {
      return (
        <View style={[styles.buttonWrapper, { height: headerHeight }]}>
          <Text style={typography.text}>{ t`Saving` }</Text>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    if (flipped) {
      const buttonText = customFlippedHeader ?
        t`Draw a Different Weakness` :
        t`Draw Another`;
      return (
        <View
          onLayout={this._onFlippedHeaderLayout}
          style={[styles.buttonWrapper, { minHeight: flippedHeaderHeight }]}
        >
          <Button
            text={buttonText}
            onPress={this._drawAnother} />
          { customFlippedHeader }
        </View>
      );
    }
    return (
      <View onLayout={this._onHeaderLayout}>
        { customHeader }
        <ChooserButton
          componentId={componentId}
          title={t`Traits`}
          values={this.allTraits()}
          selection={selectedTraits}
          onChange={this._onTraitsChange}
          fontScale={fontScale}
        />
        <View style={styles.toggleRow}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={t`Multiplayer`}
              setting="multiplayer"
              value={multiplayer}
              onChange={this._onToggleChange}
            />
          </View>
          <View style={styles.toggleColumn}>
            { !campaignMode && (
              <ToggleFilter
                label={t`Standalone`}
                setting="standalone"
                value={standalone}
                onChange={this._onToggleChange}
              />
            ) }
          </View>
        </View>
      </View>
    );
  }

  renderCardImage(card: Card, width: number) {
    const { fontScale } = this.props;
    if (card.imagesrc) {
      return (
        <FastImage
          style={styles.verticalCardImage}
          source={{
            uri: `https://arkhamdb.com/${card.imagesrc}`,
          }}
          resizeMode="contain"
        />
      );
    }
    return (
      <View style={styles.cardWrapper}>
        <CardDetailComponent
          card={card}
          width={width}
          fontScale={fontScale}
          showSpoilers
        />
      </View>
    );
  }

  renderCard() {
    const {
      selectedTraits,
      nextCard,
      flipped,
    } = this.state;
    const {
      cardWidth,
      cardHeight,
    } = this.calculateCardDimensions();
    if (nextCard) {
      return (
        <View style={styles.cardWrapper}>
          <TouchableWithoutFeedback onPress={this._flipCard}>
            <FlipCard
              style={[styles.flipCard, {
                width: cardWidth,
                height: cardHeight,
              }]}
              friction={6}
              perspective={1000}
              flipHorizontal
              flipVertical={false}
              flip={flipped}
              clickable={false}
              onFlipEnd={this._onFlipEnd}
            >
              <FastImage
                style={styles.verticalCardImage}
                source={PLAYER_BACK}
                resizeMode="contain"
              />
              { nextCard && this.renderCardImage(nextCard, cardWidth) }
            </FlipCard>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    if (selectedTraits.length) {
      return (
        <Text style={[typography.text, styles.errorText]}>
          { t`There are no weaknesses that match these trait filters left in the set.\n\nPlease adjust the trait filter.` }
        </Text>
      );
    }
    return (
      <Text style={[typography.text, styles.errorText]}>
        { t`All weaknesses have been drawn.` }
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          { this.renderHeaderContent() }
        </View>
        { this.renderCard() }
      </View>
    );
  }
}

export default withWeaknessCards(
  withDimensions(WeaknessDrawComponent)
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  buttonWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
  },
  verticalCardImage: {
    width: '100%',
    height: '100%',
  },
  cardWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    borderWidth: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorText: {
    marginTop: 8,
  },
});
