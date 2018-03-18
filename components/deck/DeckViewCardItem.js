import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
const {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');

import { createFactionIcons, FACTION_COLORS } from '../../constants';
import { CardType } from '../cards/types';

const CLASS_ICONS = createFactionIcons(14);

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
        <View style={styles.row}>
          <View style={styles.quantity}>
            <Text style={styles.defaultText}>
              { `${item.quantity}x ` }
            </Text>
          </View>

            { card.faction_code !== 'neutral' && (
              <View style={styles.cardIcon}>
                { CLASS_ICONS[card.faction_code] }
              </View>
            ) }
          <Text style={[
            styles.cardName,
            { color: FACTION_COLORS[card.faction_code] },
          ]}>
            { card.name }
            { range(0, card.xp || 0).map(() => '•').join('') }
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  quantity: {
    width: 20,
  },
  defaultText: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  cardName: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardIcon: {
    width: 18,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
