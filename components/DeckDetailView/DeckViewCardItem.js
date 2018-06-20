import React from 'react';
import PropTypes from 'prop-types';
import { map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ArkhamIcon from '../../assets/ArkhamIcon';
import { createFactionIcons, FACTION_COLORS } from '../../constants';

const ROW_HEIGHT = 40;
const ICON_SIZE = 28;
const CLASS_ICONS = createFactionIcons(ICON_SIZE);

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

    if (card.subtype_code && (
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness')) {
      return (
        <View style={styles.cardIcon}>
          <ArkhamIcon name="weakness" size={ICON_SIZE} color={FACTION_COLORS.neutral} />
        </View>
      );
    }

    return (
      <View style={styles.cardIcon}>
        { CLASS_ICONS[card.faction_code] }
      </View>
    );
  }

  renderCardName(card) {
    const xpStr = map(range(0, card.xp || 0), () => '•').join('');
    if (card.subname) {
      return (
        <View style={styles.stack}>
          <View style={styles.row}>
            <Text style={[
              styles.cardName,
              { color: FACTION_COLORS[card.faction_code] },
            ]}>
              { card.name }
            </Text>
            <Text style={[styles.cardName, styles.xp]}>
              { xpStr }
            </Text>
          </View>
          <Text style={[
            styles.cardSubName,
            { color: FACTION_COLORS[card.faction_code] },
          ]}>
            { card.subname }
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.row, styles.fullHeight]}>
        <Text style={[
          styles.defaultText,
          { color: FACTION_COLORS[card.faction_code] },
        ]}>
          { card.name }
        </Text>
        <Text style={[styles.defaultText, styles.fullHeight, styles.xp]}>
          { xpStr }
        </Text>
      </View>
    );
  }

  render() {
    const {
      card,
      item,
      deltaMode,
    } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={[styles.row, styles.fullHeight]}>
          <View style={styles.quantity}>
            <Text style={styles.numberText}>
              { deltaMode && (item.quantity > 0 ? '+' : '') }
              { item.quantity.toString() }
              { !deltaMode && 'x' }
            </Text>
          </View>
          { this.renderIcon() }
          { this.renderCardName(card) }
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  fullHeight: {
    height: ROW_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  stack: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  quantity: {
    width: 24,
    paddingRight: 4,
  },
  deltaSpace: {
    width: 5,
  },
  numberText: {
    textAlign: 'right',
    color: '#000000',
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: ROW_HEIGHT,
  },
  defaultText: {
    color: '#000000',
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: ROW_HEIGHT,
  },
  cardName: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 22,
  },
  cardSubName: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 18,
  },
  cardIcon: {
    width: ROW_HEIGHT,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xp: {
    marginLeft: 4,
  },
});
