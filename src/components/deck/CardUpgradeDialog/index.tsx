import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { filter, find, reverse, partition, sortBy, sumBy } from 'lodash';
import { connect } from 'react-redux';
import { ngettext, msgid } from 'ttag';

import CardUpgradeOption from './CardUpgradeOption';
import DeckProblemRow from 'components/core/DeckProblemRow';
import CardDetailComponent from 'components/card/CardDetailView/CardDetailComponent';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { Deck, DeckMeta, ParsedDeck, Slots } from 'actions/types';
import DeckValidation from 'lib/DeckValidation';
import Card, { CardsMap } from 'data/Card';
import { COLORS } from 'styles/colors';
import { NavigationProps } from 'components/nav/types';
import { m, s } from 'styles/space';
import DeckNavFooter from '../../DeckNavFooter';
import { parseDeck } from 'lib/parseDeck';
import {
  getPacksInCollection,
  AppState,
} from 'reducers';

export interface CardUpgradeDialogProps {
  componentId: string;
  card?: Card;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  ignoreDeckLimitSlots: Slots;
  investigator: Card;
  meta: DeckMeta;
  parsedDeck: ParsedDeck;
  previousDeck?: Deck;
  slots?: Slots;
  tabooSetId?: number;
  updateSlots: (slots: Slots) => void;
  xpAdjustment: number;
}

interface ReduxProps {
  inCollection: {
    [pack_code: string]: boolean;
  };
}

interface State {
  parsedDeck: ParsedDeck;
  slots: Slots;
  showNonCollection: boolean;
}

type Props = CardUpgradeDialogProps & ReduxProps & NavigationProps & DimensionsProps;

class CardUpgradeDialog extends React.Component<Props, State> {

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      parsedDeck: props.parsedDeck,
      slots: props.slots || {},
      showNonCollection: false,
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _onIncrement = (code: string) => {
    const {
      cards,
      updateSlots,
    } = this.props;
    const {
      slots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) + 1,
    };

    const possibleDecrement = find(reverse(this.namedCards()), card => (
      card.code !== code && newSlots[card.code] > 0 &&
        (card.xp || 0) < (cards[code].xp || 0)
    ));

    if (possibleDecrement) {
      newSlots[possibleDecrement.code]--;
      if (newSlots[possibleDecrement.code] <= 0) {
        delete newSlots[possibleDecrement.code];
      }
    }

    const parsedDeck = this.updateXp(newSlots);

    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck,
    });

    updateSlots(newSlots);
  };

  _onDecrement = (code: string) => {
    const {
      updateSlots,
    } = this.props;
    const {
      slots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) - 1,
    };

    if (newSlots[code] <= 0) {
      delete newSlots[code];
    }

    const parsedDeck = this.updateXp(newSlots);

    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck,
    });

    updateSlots(newSlots);
  };

  namedCards() {
    const {
      card,
      cardsByName,
      investigator,
      meta,
    } = this.props;
    const {
      slots,
    } = this.state;
    const validation = new DeckValidation(investigator, slots, meta);
    return sortBy(
      filter((card && cardsByName[card.real_name]) || [],
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }

  overLimit(slots: Slots) {
    const namedCards = this.namedCards();
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => slots[card.code] || 0) > limit;
  }

  updateXp(slots: Slots) {
    const {
      cards,
      ignoreDeckLimitSlots,
      parsedDeck,
      previousDeck,
    } = this.props;

    const deck = parsedDeck.deck;

    return parseDeck(deck, slots, ignoreDeckLimitSlots || {}, cards, previousDeck);
  }

  _showNonCollection = () => {
    this.setState({
      showNonCollection: true,
    });
  };

  inCollection(card: Card): boolean {
    const { inCollection } = this.props;
    const { showNonCollection } = this.state;
    return (
      card.code === 'core' ||
      inCollection[card.pack_code] ||
      showNonCollection
    );
  }

  renderCard(card: Card) {
    const {
      componentId,
      tabooSetId,
      width,
      fontScale,
    } = this.props;
    const {
      slots,
    } = this.state;

    return (
      <View style={styles.column} key={card.code}>
        <CardUpgradeOption
          key={card.code}
          card={card}
          code={card.code}
          count={slots[card.code] || 0}
          onIncrement={this._onIncrement}
          onDecrement={this._onDecrement}
        />
        <CardDetailComponent
          componentId={componentId}
          fontScale={fontScale}
          card={card}
          showSpoilers
          tabooSetId={tabooSetId}
          width={width}
          simple
        />
      </View>
    );
  }

  renderCards() {
    const namedCards = this.namedCards();
    const [inCollection, nonCollection] = partition(
      namedCards,
      card => this.inCollection(card));
    return (
      <>
        { inCollection.map(card => this.renderCard(card)) }
        { nonCollection.length > 0 ? (
          <View style={styles.button}>
            <Button
              key="non-collection"
              title={ngettext(
                msgid`Show ${nonCollection.length} Non-Collection Card`,
                `Show ${nonCollection.length} Non-Collection Cards`,
                nonCollection.length
              )}
              onPress={this._showNonCollection}
            />
          </View>
        ) : null }
      </>
    );
  }

  renderFooter(slots?: Slots, controls?: React.ReactNode) {
    const {
      componentId,
      cards,
      meta,
      xpAdjustment,
      fontScale,
    } = this.props;
    const {
      parsedDeck,
    } = this.state;

    if (!parsedDeck) {
      return null;
    }

    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={parsedDeck}
        meta={meta}
        cards={cards}
        xpAdjustment={xpAdjustment}
        fontScale={fontScale}
        controls={controls}
      />
    );
  }

  render() {
    const {
      investigator,
      fontScale,
    } = this.props;
    const {
      slots,
    } = this.state;
    const overLimit = this.overLimit(slots);

    const isSurvivor = investigator.faction_code === 'survivor';
    return (
      <View
        style={styles.wrapper}
      >
        <ScrollView
          overScrollMode="never"
          bounces={false}
        >
          { overLimit && (
            <View style={[styles.problemBox,
              { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
            ]}>
              <DeckProblemRow
                problem={{ reason: 'too_many_copies' }}
                color={isSurvivor ? COLORS.black : COLORS.white}
                fontSize={14}
                fontScale={fontScale}
              />
            </View>
          ) }
          { this.renderCards() }
          <View style={styles.footerPadding} />
        </ScrollView>
        { this.renderFooter() }
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    inCollection: getPacksInCollection(state),
  };
}

export default connect(mapStateToProps)(
  withDimensions(CardUpgradeDialog)
);

const styles = StyleSheet.create({
  column: {
    paddingTop: m,
    paddingBottom: m,
    flexDirection: 'column',
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  problemBox: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: s,
    paddingLeft: s,
  },
  footerPadding: {
    height: m,
  },
  button: {
    padding: s,
  },
});
