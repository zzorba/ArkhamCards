import React from 'react';
import PropTypes from 'prop-types';
import { head, map, partition } from 'lodash';
import { connectRealm } from 'react-native-realm';

import CardSearchComponent from './CardSearchComponent';

class DeckEditView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    investigator: PropTypes.object,
    /* eslint-disable react/no-unused-prop-types */
    deck: PropTypes.object.isRequired,
    slots: PropTypes.object.isRequired,
    updateSlots: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      deckCardCounts: props.slots || {},
    };

    this._backPressed = this.backPressed.bind(this);
    this._queryForInvestigator = this.queryForInvestigator.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.slots !== this.props.slots) {
      this.setState({
        deckCardCounts: nextProps.slots,
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
    } = this.props;

    const {
      deckCardCounts,
    } = this.state;

    return (
      <CardSearchComponent
        navigator={navigator}
        baseQuery={this.queryForInvestigator()}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        backPressed={this._backPressed}
        backButtonText="Save"
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
