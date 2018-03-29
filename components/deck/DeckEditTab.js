import React from 'react';
import PropTypes from 'prop-types';
import { map, partition } from 'lodash';

import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';
import DeckValidation from '../../lib/DeckValidation';

export default class DeckEditTab extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    investigator: PropTypes.object.isRequired,
    slots: PropTypes.object.isRequired,
    slotChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._queryForInvestigator = this.queryForInvestigator.bind(this);
  }

  queryForInvestigator() {
    const {
      investigator,
    } = this.props;
    const [inverted, normal] = partition(
      investigator.deck_options,
      option => option.not);
    // We assume that there is always at least one normalClause.
    const invertedClause = inverted.length ?
      `${map(inverted, option => option.toQuery()).join(' AND')} AND ` :
      '';
    const normalClause = map(normal, option => option.toQuery()).join(' OR');

    // Combine the two clauses with an AND to satisfy the logic here.
    return `${invertedClause}(${normalClause})`;
  }

  render() {
    const {
      investigator,
      navigator,
      slots,
      slotChanged,
    } = this.props;

    const validator = new DeckValidation(investigator);
    // const eligibleCards = pickBy(cards, (card) => {
    //  return card.deck_limit > 0 && validator.canIncludeCard(card);
    // });


    return (
      <CardSearchComponent
        navigator={navigator}
        baseQuery={this.queryForInvestigator()}
        deckCardCounts={slots}
        onDeckCountChange={slotChanged}
      />
    );
  }
}
