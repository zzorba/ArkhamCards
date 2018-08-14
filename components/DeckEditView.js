import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import { connectRealm } from 'react-native-realm';

import { queryForInvestigator } from '../lib/InvestigatorRequirements';
import { STORY_CARDS_QUERY } from '../data/query';
import CardSearchComponent from './CardSearchComponent';
import { parseDeck } from './parseDeck';
import DeckNavFooter from './DeckNavFooter';

class DeckEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    investigator: PropTypes.object,
    /* eslint-disable react/no-unused-prop-types */
    deck: PropTypes.object.isRequired,
    previousDeck: PropTypes.object,
    cards: PropTypes.object.isRequired,
    slots: PropTypes.object.isRequired,
    updateSlots: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      deckCardCounts: props.slots || {},
      slots: props.slots,
    };

    this._backPressed = this.backPressed.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
  }

  componentDidUpdate(prevProps) {
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

  backPressed() {
    this.props.updateSlots(this.state.deckCardCounts);
  }

  onDeckCountChange(code, count) {
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
    });
  }

  renderFooter() {
    const {
      navigator,
      deck,
      previousDeck,
      cards,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const cardsInDeck = {};
    cards.forEach(card => {
      if (deckCardCounts[card.code] || deck.investigator_code === card.code ||
        (previousDeck && previousDeck.slots[card.code])) {
        cardsInDeck[card.code] = card;
      }
    });
    const pDeck = parseDeck(deck, deckCardCounts, cardsInDeck, previousDeck);
    return (
      <DeckNavFooter
        navigator={navigator}
        parsedDeck={pDeck}
        cards={cardsInDeck}
      />
    );
  }

  render() {
    const {
      navigator,
      investigator,
    } = this.props;

    const {
      deckCardCounts,
    } = this.state;

    const baseQuery = investigator ?
      `((${queryForInvestigator(investigator)}) or (${STORY_CARDS_QUERY}))` :
      null;

    return (
      <CardSearchComponent
        navigator={navigator}
        baseQuery={baseQuery}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        backPressed={this._backPressed}
        footer={this.renderFooter()}
      />
    );
  }
}

export default connectRealm(
  DeckEditView,
  {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      return {
        realm,
        investigator: head(results.cards.filtered(`code == "${props.deck.investigator_code}"`)),
        cards: results.cards,
      };
    },
  },
);
