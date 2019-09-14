import React from 'react';
import Realm, { Results } from 'realm';
import { find, head } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import { Deck, DeckMeta, Slots } from '../actions/types';
import { VERSATILE_CODE } from '../constants';
import { queryForInvestigator, negativeQueryForInvestigator } from '../lib/InvestigatorRequirements';
import { filterToQuery, defaultFilterState } from '../lib/filters';
import { STORY_CARDS_QUERY } from '../data/query';
import Card, { CardsMap } from '../data/Card';
import { parseDeck } from '../lib/parseDeck';
import CardSearchComponent from './CardSearchComponent';
import DeckNavFooter from './DeckNavFooter';
import { NavigationProps } from './types';

export interface EditDeckProps {
  deck: Deck;
  previousDeck?: Deck;
  tabooSetId?: number;
  xpAdjustment?: number;
  storyOnly?: boolean;
  slots: Slots;
  meta: DeckMeta;
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
      meta,
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
        meta={meta}
        parsedDeck={pDeck}
        cards={cardsInDeck}
        xpAdjustment={xpAdjustment || 0}
        controls={controls}
      />
    );
  }

  baseQuery() {
    const {
      meta,
      investigator,
      storyOnly,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    if (storyOnly) {
      return `((${STORY_CARDS_QUERY}) and (subtype_code != 'basicweakness'))`;
    }
    const parts = investigator ? [
      `(${queryForInvestigator(investigator, meta)})`,
    ] : [];
    parts.push(`(${STORY_CARDS_QUERY})`);
    if (deckCardCounts[VERSATILE_CODE] > 0) {
      const versatileQuery = filterToQuery({
        ...defaultFilterState,
        factions: ['guardian', 'seeker', 'rogue', 'mystic', 'survivor'],
        level: [0, 0],
        levelEnabled: true,
      }).join(' and ');
      const invertedClause = investigator ?
        negativeQueryForInvestigator(investigator, meta) : '';
      parts.push(`(${invertedClause}${versatileQuery})`);
    }
    return `(${parts.join(' or ')})`;
  }

  render() {
    const {
      componentId,
      tabooSetId,
      cards,
      deck,
      storyOnly,
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
        originalDeckSlots={deck.slots}
        investigator={investigator}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        renderFooter={this._renderFooter}
        storyOnly={storyOnly}
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
