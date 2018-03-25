import React from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ArkhamIcon from '../../assets/ArkhamIcon';
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

  renderIcon() {
    const {
      card,
    } = this.props;

    if (card.faction_code !== 'neutral') {
      return (
        <View style={styles.cardIcon}>
          { CLASS_ICONS[card.faction_code] }
        </View>
      );
    }

    if (card.subtype_code && (
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness')) {
      return (
        <View style={styles.cardIcon}>
          <ArkhamIcon name="weakness" size={14} color={FACTION_COLORS.neutral} />
        </View>
      );
    }

    return null;
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
          { this.renderIcon() }
          <Text style={[
            styles.defaultText,
            { color: FACTION_COLORS[card.faction_code] },
          ]}>
            { card.name }
          </Text>
          <Text style={styles.defaultText}>
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
    height: 24,
  },
  quantity: {
    width: 20,
  },
  defaultText: {
    color: '#000000',
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 24,
  },
  cardIcon: {
    width: 18,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
