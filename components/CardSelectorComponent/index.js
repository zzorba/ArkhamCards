import React from 'react';
import PropTypes from 'prop-types';
import { filter, keys, map, sortBy } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import CardToggleRow from './CardToggleRow';
import withPlayerCards from '../withPlayerCards';

class CardSelectorComponent extends React.Component {
  static propTypes = {
    slots: PropTypes.object.isRequired,
    counts: PropTypes.object.isRequired,
    updateCounts: PropTypes.func.isRequired,
    filterCard: PropTypes.func,
    header: PropTypes.node,
    // From realm.
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onChange = this.onChange.bind(this);
  }

  onChange(card, count) {
    const {
      counts,
      updateCounts,
    } = this.props;
    updateCounts(Object.assign({}, counts, { [card.code]: count }));
  }

  render() {
    const {
      slots,
      cards,
      counts,
      filterCard,
      header,
    } = this.props;
    const matchingCards = sortBy(
      filter(
        keys(slots),
        code => (
          slots[code] > 0 &&
          cards[code] &&
          (!filterCard || filterCard(cards[code])))),
      code => cards[code].name
    );

    if (!matchingCards.length) {
      return null;
    }

    return (
      <View style={styles.block}>
        { header }
        { map(matchingCards, code => (
          <CardToggleRow
            key={code}
            card={cards[code]}
            onPress={this._onCardPress}
            onChange={this._onChange}
            count={counts[code] || 0}
            limit={slots[code]}
          />
        )) }
      </View>
    );
  }
}

export default withPlayerCards(CardSelectorComponent);


const styles = StyleSheet.create({
  block: {
    paddingTop: 8,
  },
});
