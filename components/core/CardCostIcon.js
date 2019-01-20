import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { FACTION_COLORS } from '../../constants';
import { isBig } from '../../styles/space';

export const SIZE = isBig ? 48 : 36;
export const ICON_SIZE = isBig ? 46 : 32;

export default class CardCostIcon extends React.Component {
  static propTypes = {
    card: PropTypes.object.isRequired,
    inverted: PropTypes.bool,
    linked: PropTypes.bool,
  };

  cardCost() {
    const {
      card,
      linked,
    } = this.props;
    if (card.type_code === 'skill') {
      return '';
    }
    if (card.permanent || card.double_sided || linked || card.linked_card) {
      return '-';
    }
    if (card.cost === null && (
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness')
    ) {
      return '-';
    }
    return `${card.cost !== null ? card.cost : 'X'}`;
  }

  static factionIcon(card) {
    if (card.faction2_code) {
      return 'elder_sign';
    }
    if (card.faction_code === 'neutral') {
      if (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness') {
        return 'weakness';
      }
      return 'elder_sign';
    }
    return card.faction_code;
  }

  color() {
    const {
      card,
    } = this.props;
    if (card.faction2_code) {
      return FACTION_COLORS.dual;
    }
    return FACTION_COLORS[card.faction_code];
  }

  render() {
    const {
      card,
      inverted,
    } = this.props;
    const color = this.color();
    return (
      <View style={styles.level}>
        <View style={styles.levelIcon}>
          <AppIcon
            name={`${inverted ? 'inverted_' : ''}level_${card.xp || 0}`}
            size={ICON_SIZE}
            color={inverted ? '#FFF' : color}
          />
        </View>
        <View style={[styles.levelIcon, styles.cost]}>
          { card.type_code === 'skill' ? (
            <View style={styles.factionIcon}>
              <ArkhamIcon
                name={CardCostIcon.factionIcon(card)}
                color="#FFF"
                size={ICON_SIZE / 2}
              />
            </View>
          ) : (
            <Text style={styles.costNumber}>
              { this.cardCost() }
            </Text>
          ) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  level: {
    position: 'relative',
    width: SIZE,
    height: SIZE,
  },
  levelIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cost: {
    paddingBottom: 6,
  },
  costNumber: {
    paddingTop: 3,
    fontFamily: 'Teutonic',
    fontSize: isBig ? 32 : 23,
    color: '#FFF',
  },
  factionIcon: {
  },
});
