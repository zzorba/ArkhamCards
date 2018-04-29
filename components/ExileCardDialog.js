import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys, map } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { getDeck } from '../reducers';
import * as Actions from '../actions';
import CardSearchComponent from './CardSearchComponent';

class ExileCardDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    updateExiles: PropTypes.func.isRequired,
    deck: PropTypes.object,
    exiles: PropTypes.object,
    // From redux/realm.
    eligibleExileSlots: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      deckCardCounts: props.exiles || {},
    };

    props.navigator.setTitle({
      title: 'Choose Exile Cards',
    });

    this._backPressed = this.backPressed.bind(this);
    this._onDeckCountChange = this.onDeckCountChange.bind(this);
  }

  backPressed() {
    this.props.updateExiles(this.state.deckCardCounts);
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

  query() {
    const {
      eligibleExileSlots,
    } = this.props;
    return map(
      keys(eligibleExileSlots),
      code => `code == "${code}"`).join(' or ');
  }

  render() {
    const {
      navigator,
      deck: {
        slots,
      },
    } = this.props;

    const {
      deckCardCounts,
    } = this.state;

    return (
      <CardSearchComponent
        navigator={navigator}
        baseQuery={this.query()}
        deckCardCounts={deckCardCounts}
        onDeckCountChange={this._onDeckCountChange}
        backPressed={this._backPressed}
        backButtonText="Done"
        limits={slots}
      />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(ExileCardDialog, {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      const {
        deck: {
          slots,
        },
      } = props;
      if (!slots) {
        return {
          eligibleExileSlots: {},
        };
      }
      const exileCards = new Set(
        map(results.cards.filtered('exile == true'), card => card.code));

      const eligibleExileSlots = {};
      forEach(keys(props.deck.slots), code => {
        if (exileCards.has(code)) {
          eligibleExileSlots[code] = slots[code];
        }
      });
      return {
        eligibleExileSlots,
      };
    },
  }),
);
