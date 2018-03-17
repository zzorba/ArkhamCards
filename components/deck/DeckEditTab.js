import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';

import { DeckType } from './parseDeck';
import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';
import DeckValidation from '../../lib/DeckValidation';

export default class DeckEditTab extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    parsedDeck: DeckType,
    cards: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this._searchUpdated = this.searchUpdated.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
  }

  onDeckCountChange(code, count) {
    console.log(`Set ${code} to ${count}`);
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term,
    });
  }

  render() {
    const {
      cards,
      parsedDeck,
      navigator,
    } = this.props;

    const validator = new DeckValidation(parsedDeck.investigator);
    const eligibleCards = pickBy(cards, (card) => {
      return card.deck_limit > 0 && validator.canIncludeCard(card);
    });

    return (
      <CardSearchComponent
        cards={eligibleCards}
        navigator={navigator}
        deckCardCounts={parsedDeck.deck.slots}
        onDeckCountChange={this._onDeckCountChange}
      />
    );
  }
}
