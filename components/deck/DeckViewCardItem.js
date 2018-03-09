import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
const {
  StyleSheet,
  Text,
  TouchableOpacity,
} = require('react-native');

import { createFactionIcons, FACTION_COLORS } from '../../constants';
import { CardType } from '../cards/types';

const CLASS_ICONS = createFactionIcons(18);

export default class DeckViewCardItem extends React.PureComponent {
  static propTypes = {
    card: CardType,
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card.code);
  }

  render() {
    const {
      card,
      item,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Text style={styles.defaultText}>
          { `${item.quantity}x ` }
          { card.faction_code !== 'neutral' && CLASS_ICONS[card.faction_code] }
          <Text style={[
            styles.cardName,
            { color: FACTION_COLORS[card.faction_code] },
          ]}>
            { card.name }
          </Text>
          { range(0, card.xp || 0).map(() => '•').join('') }
        </Text>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  defaultText: {
    color: '#000000',
    fontSize: 14,
  },
  cardName: {
    fontSize: 14,
    lineHeight: 20,
  },
});
