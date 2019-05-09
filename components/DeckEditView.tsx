import React from 'react';
import Realm, { Results } from 'realm';
import { head } from 'lodash';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';

import { Deck, Slots } from '../actions/types';
import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import { STORY_CARDS_QUERY } from '../data/query';
import Card, { CardsMap } from '../data/Card';
import { getTabooSet, AppState } from '../reducers';
import CardSearchComponent from './CardSearchComponent';
import { parseDeck } from './parseDeck';
import DeckNavFooter from './DeckNavFooter';
import { NavigationProps } from './types';

export interface EditDeckProps {
  deck: Deck;
  previousDeck?: Deck;
  xpAdjustment?: number;
  storyOnly?: boolean;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  updateSlots: (slots: Slots) => void;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface RealmProps {
  realm: Realm;
  investigator?: Card;
  cards: Results<Card>;
}

type Props = NavigationProps & EditDeckProps & ReduxProps & RealmProps;

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

  renderFooter() {
    const {
      componentId,
      deck,
      ignoreDeckLimitSlots,
      previousDeck,
      cards,
      xpAdjustment,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
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
    } = this.props;

    const {
      deckCardCounts,
    } = this.state;

    return (
      <CardSearchComponent
        componentId={componentId}
        baseQuery={this.baseQuery()}
        originalDeckSlots={slots}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        footer={this.renderFooter()}
        modal
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & EditDeckProps, AppState>(
  mapStateToProps
)(connectRealm<NavigationProps & EditDeckProps & ReduxProps, RealmProps, Card>(
  DeckEditView,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: NavigationProps & EditDeckProps & ReduxProps
    ) {
      return {
        realm,
        investigator: head(results.cards.filtered(`(code == '${props.deck.investigator_code}') and ${Card.tabooSetQuery(props.tabooSetId)}`)),
        cards: results.cards,
      };
    },
  },
));
