import React from 'react';
import Realm, { Results } from 'realm';
import { find, head } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import { Deck, Slots } from '../actions/types';
import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import { STORY_CARDS_QUERY } from '../data/query';
import Card, { CardsMap } from '../data/Card';
import CardSearchComponent from './CardSearchComponent';
import { parseDeck } from './parseDeck';
import DeckNavFooter from './DeckNavFooter';
import { NavigationProps } from './types';

export interface EditDeckProps {
  deck: Deck;
  previousDeck?: Deck;
  tabooSetId?: number;
  xpAdjustment?: number;
  storyOnly?: boolean;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  updateSlots: (slots: Slots) => void;
}

interface RealmProps {
  realm: Realm;
  investigator?: Card;
  cards: Results<Card>;
}

type Props = NavigationProps & EditDeckProps & RealmProps;

interface State {
  deckCardCounts: Slots;
  slots: Slots;
}

class DeckEditView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      deckCardCounts: props.slots || {},
      slots: props.slots,
    };
  }

  _syncDeckCardCounts = () => {
    this.props.updateSlots(this.state.deckCardCounts);
  };

  componentDidUpdate(prevProps: Props) {
    const {
      slots,
    } = this.props;
    if (slots !== prevProps.slots) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        deckCardCounts: slots,
      });
    }
  }

  _onDeckCountChange = (code: string, count: number) => {
    const newSlots = Object.assign(
      {},
      this.state.deckCardCounts,
      { [code]: count },
    );
    if (count === 0) {
      delete newSlots[code];
    }
    this.setState({
      deckCardCounts: newSlots,
    }, this._syncDeckCardCounts);
  };

  _renderFooter = (updatedDeckCardCounts?: Slots, controls?: React.ReactNode) => {
    const {
      componentId,
      deck,
      ignoreDeckLimitSlots,
      previousDeck,
      cards,
      xpAdjustment,
    } = this.props;
    const deckCardCounts = updatedDeckCardCounts || this.state.deckCardCounts;
    const cardsInDeck: CardsMap = {};
    cards.forEach(card => {
      if (deckCardCounts[card.code] || deck.investigator_code === card.code ||
        (previousDeck && previousDeck.slots[card.code])) {
        cardsInDeck[card.code] = card;
      }
    });
    const pDeck = parseDeck(
      deck,
      deckCardCounts,
      ignoreDeckLimitSlots,
      cardsInDeck,
      previousDeck
    );
    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={pDeck}
        cards={cardsInDeck}
        xpAdjustment={xpAdjustment || 0}
        controls={controls}
      />
    );
  }

  baseQuery() {
    const {
      investigator,
      storyOnly,
    } = this.props;
    if (storyOnly) {
      return `((${STORY_CARDS_QUERY}) and (subtype_code != 'basicweakness'))`;
    }
    return investigator ?
      `((${queryForInvestigator(investigator)}) or (${STORY_CARDS_QUERY}))` :
      undefined;
  }

  render() {
    const {
      componentId,
      slots,
      tabooSetId,
      cards,
      deck,
    } = this.props;

    const {
      deckCardCounts,
    } = this.state;
    const investigator = find(cards, card => card.code === deck.investigator_code);
    return (
      <CardSearchComponent
        componentId={componentId}
        tabooSetOverride={tabooSetId}
        baseQuery={this.baseQuery()}
        originalDeckSlots={slots}
        investigator={investigator}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        renderFooter={this._renderFooter}
        modal
      />
    );
  }
}

export default connectRealm<NavigationProps & EditDeckProps, RealmProps, Card>(
  DeckEditView,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: NavigationProps & EditDeckProps
    ) {
      return {
        realm,
        investigator: head(results.cards.filtered(`(code == '${props.deck.investigator_code}') and ${Card.tabooSetQuery(props.tabooSetId)}`)),
        cards: results.cards.filtered(Card.tabooSetQuery(props.tabooSetId)),
      };
    },
  },
);
