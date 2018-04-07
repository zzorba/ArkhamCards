import React from 'react';
import PropTypes from 'prop-types';
import { map, partition } from 'lodash';

import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';

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
      opt => opt.not);
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
      navigator,
      slots,
      slotChanged,
    } = this.props;

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
