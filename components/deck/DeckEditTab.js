import React from 'react';
import PropTypes from 'prop-types';
import { pickBy } from 'lodash';

import { DeckType } from './parseDeck';
import { CardType } from '../cards/types';
import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';
import DeckValidation from '../../lib/DeckValidation';

export default class DeckEditTab extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    investigator: CardType,
    slots: PropTypes.object.isRequired,
    cards: PropTypes.object.isRequired,
    slotChanged: PropTypes.func.isRequired,
  };
  
  render() {
    const {
      cards,
      investigator,
      navigator,
      slots,
      slotChanged,
    } = this.props;

    const validator = new DeckValidation(investigator);
    const eligibleCards = pickBy(cards, (card) => {
      return card.deck_limit > 0 && validator.canIncludeCard(card);
    });

    return (
      <CardSearchComponent
        cards={eligibleCards}
        navigator={navigator}
        deckCardCounts={slots}
        onDeckCountChange={slotChanged}
      />
    );
  }
}
