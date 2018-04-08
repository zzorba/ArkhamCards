import React from 'react';
import PropTypes from 'prop-types';
import { head, map, partition } from 'lodash';
import { connectRealm } from 'react-native-realm';

import CardSearchComponent from '../cards/CardSearchView/CardSearchComponent';

class DeckEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    deck: PropTypes.object.isRequired,
    investigator: PropTypes.object,
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

export default connectRealm(
  DeckEditView,
  {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      return {
        realm,
        investigator: head(results.cards.filtered(`code == "${props.deck.investigator_code}"`)),
      };
    },
  },
);
