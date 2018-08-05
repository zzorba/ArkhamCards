import React from 'react';
import PropTypes from 'prop-types';
import { filter, forEach, map } from 'lodash';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { getDeck } from '../../reducers';
import typography from '../../styles/typography';
import ExileRow from './ExileRow';

class ExileCardSelectorComponent extends React.Component {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    exileCounts: PropTypes.object.isRequired,
    updateExileCounts: PropTypes.func.isRequired,
    showLabel: PropTypes.bool,
    // From redux.
    deck: PropTypes.object,
    // From realm.
    exileCards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onExileChange = this.onExileChange.bind(this);
  }

  onExileChange(card, count) {
    const {
      exileCounts,
      updateExileCounts,
    } = this.props;
    updateExileCounts(Object.assign({}, exileCounts, { [card.code]: count }));
  }

  render() {
    const {
      deck,
      exileCards,
      exileCounts,
      showLabel,
    } = this.props;
    if (!deck) {
      return null;
    }
    const matchingExileCards = filter(exileCards, card => deck.slots[card.code]);
    if (!matchingExileCards.length) {
      return null;
    }

    return (
      <View style={styles.exileBlock}>
        { !!showLabel && (
          <Text style={[typography.small, styles.exileText]}>
            EXILE CARDS
          </Text>
        ) }
        { map(matchingExileCards, card => (
          <ExileRow
            key={card.code}
            card={card}
            onPress={this._onCardPress}
            onChange={this._onExileChange}
            count={exileCounts[card.code] || 0}
            limit={deck.slots[card.code]}
          />
        )) }
      </View>
    );
  }
}


function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectRealm(ExileCardSelectorComponent, {
    schemas: ['Card'],
    mapToProps(results) {
      const exileCards = {};
      forEach(results.cards.filtered('exile == true').sorted('name'), card => {
        exileCards[card.code] = card;
      });
      return {
        exileCards,
      };
    },
  }),
);

const styles = StyleSheet.create({
  exileBlock: {
    paddingTop: 8,
  },
  exileText: {
    paddingLeft: 8,
  },
});
