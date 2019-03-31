import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { filter, keys, map, sortBy } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Slots } from '../../actions/types';
import Card from '../../data/Card';
import CardToggleRow from './CardToggleRow';
import { showCard } from '../navHelper';
import withPlayerCards, { PlayerCardProps } from '../withPlayerCards';

interface OwnProps {
  componentId: string;
  slots: Slots;
  counts: Slots;
  updateCounts: (slots: Slots) => void;
  filterCard?: (card: Card) => boolean;
  header?: ReactNode;
}

type Props = OwnProps & PlayerCardProps;

class CardSelectorComponent extends React.Component<Props> {
  _onChange = (card: Card, count: number) => {
    const {
      counts,
      updateCounts,
    } = this.props;
    updateCounts(Object.assign({}, counts, { [card.code]: count }));
  };

  _onCardPress = (card: Card) => {
    showCard(this.props.componentId, card.code, card, true);
  };

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

export default withPlayerCards<OwnProps>(CardSelectorComponent);


const styles = StyleSheet.create({
  block: {
    paddingTop: 8,
  },
});
