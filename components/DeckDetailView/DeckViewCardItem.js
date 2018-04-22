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

const CLASS_ICONS = createFactionIcons(14);

export default class DeckViewCardItem extends React.PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    deltaMode: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card);
  }

  renderIcon() {
    const {
      card,
      deltaMode,
    } = this.props;
    if (deltaMode) {
      return <View style={styles.deltaSpace} />;
    }

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

    return <View style={styles.smallSpace} />;
  }

  render() {
    const {
      card,
      item,
      deltaMode,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.row}>
          <View style={styles.quantity}>
            <Text style={styles.numberText}>
              { deltaMode ?
                `${item.quantity > 0 ? '+' : ''}${item.quantity} ` :
                `${item.quantity}x ` }
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
    height: 28,
  },
  quantity: {
    width: 20,
    paddingRight: 2,
  },
  smallSpace: {
    width: 2,
  },
  deltaSpace: {
    width: 5,
  },
  numberText: {
    textAlign: 'right',
    color: '#000000',
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 28,
  },
  defaultText: {
    color: '#000000',
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 28,
  },
  cardIcon: {
    width: 22,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
