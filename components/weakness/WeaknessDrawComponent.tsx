import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { filter, find, flatMap, forEach, head, keys, map, range, shuffle } from 'lodash';
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CachedImage, ImageCacheManager } from 'react-native-cached-image';
import FlipCard from 'react-native-flip-card';

import L from '../../app/i18n';
import { Slots, WeaknessSet } from '../../actions/types';
import Card from '../../data/Card';
import withWeaknessCards, { WeaknessCardProps } from './withWeaknessCards';
import Button from '../core/Button';
import ChooserButton from '../core/ChooserButton';
import { CARD_RATIO, HEADER_HEIGHT, TABBAR_HEIGHT } from '../../styles/sizes';
import typography from '../../styles/typography';
const PLAYER_BACK = require('../../assets/player-back.png');
const defaultImageCacheManager = ImageCacheManager();

const PADDING = 32;

interface OwnProps {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateDrawnCard: (code: string, assignedCards: Slots) => void;
  customHeader?: ReactNode;
  customFlippedHeader?: ReactNode;
  saving?: boolean;
}
type Props = OwnProps & WeaknessCardProps;

interface State {
  headerHeight: number;
  flippedHeaderHeight: number;
  selectedTraits: string[];
  nextCard?: Card;
  flipped: boolean;
  drawNewCard: boolean;
}
class WeaknessDrawComponent extends React.Component<Props, State> {
  _onHeaderLayout!: (event: LayoutChangeEvent) => void;
  _onFlippedHeaderLayout!: (event: LayoutChangeEvent) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      headerHeight: 32,
      flippedHeaderHeight: 32,
      selectedTraits: [],
      nextCard: this.nextCard([]),
      flipped: false,
      drawNewCard: false,
    };

    this._onHeaderLayout = this.onHeaderLayout.bind(this, false);
    this._onFlippedHeaderLayout = this.onHeaderLayout.bind(this, true);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.weaknessSet !== prevProps.weaknessSet && !this.state.flipped) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        nextCard: this.nextCard(this.state.selectedTraits),
      });
    }
  }

  calculateCardDimensions() {
    const {
      headerHeight,
    } = this.state;
    const {
      width,
      height,
    } = Dimensions.get('window');

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
    this.setState({
      drawNewCard: false,
      nextCard: this.nextCard(this.state.selectedTraits),
    });
  };

  nextCard(selectedTraits: string[]) {
    const {
      weaknessSet: {
        assignedCards,
      },
    } = this.props;
    const cards = shuffle(flatMap(this.selectedCards(selectedTraits), card => {
      return map(
        range(0, (card.quantity || 0) - (assignedCards[card.code] || 0)),
        () => card);
    }));

    const card = head(cards);
    if (card && card.imagesrc) {
      defaultImageCacheManager.downloadAndCacheUrl(`https://arkhamdb.com/${card.imagesrc}`);
    }
    return card;
  }

  selectedCards(selectedTraits: string[]) {
    if (!selectedTraits.length) {
      return this.cards();
    }
    return filter(this.cards(), card => {
      return !!find(selectedTraits, trait => (
        card.traits_normalized &&
        card.traits_normalized.indexOf(`#${trait.toLowerCase()}#`) !== -1)
      );
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

  renderHeaderContent() {
    const {
      componentId,
      customHeader,
      customFlippedHeader,
      saving,
    } = this.props;
    const {
      selectedTraits,
      flipped,
      headerHeight,
      flippedHeaderHeight,
    } = this.state;
    if (saving) {
      return (
        <View style={[styles.buttonWrapper, { height: headerHeight }]}>
          <Text style={typography.text}>{ L('Saving') }</Text>
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
        L('Draw a Different Weakness') :
        L('Draw Another');
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
          title={L('Traits')}
          values={this.allTraits()}
          selection={selectedTraits}
          onChange={this._onTraitsChange}
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
              <CachedImage
                style={styles.verticalCardImage}
                source={PLAYER_BACK}
                resizeMode="contain"
              />
              { nextCard && (
                <CachedImage
                  style={styles.verticalCardImage}
                  source={{
                    uri: `https://arkhamdb.com/${nextCard.imagesrc}`,
                  }}
                  resizeMode="contain"
                />
              ) }
            </FlipCard>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    if (selectedTraits.length) {
      return (
        <Text style={[typography.text, styles.errorText]}>
          { L('There are no weaknesses that match these trait filters left in the set.\n\nPlease adjust the trait filter.') }
        </Text>
      );
    }
    return (
      <Text style={[typography.text, styles.errorText]}>
        { L('All weaknesses have been drawn.') }
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

export default withWeaknessCards(WeaknessDrawComponent);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
