import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { FACTION_COLORS } from '../../constants';
import Card from '../../data/Card';
import { isBig } from '../../styles/space';

const scaleFactor = ((DeviceInfo.getFontScale() - 1) / 2 + 1);
export const COST_ICON_SIZE = (isBig ? 48 : 36) * scaleFactor;
export const ICON_SIZE = (isBig ? 46 : 32) * scaleFactor;

interface Props {
  card: Card;
  inverted?: boolean;
  linked?: boolean;
}
export default class CardCostIcon extends React.Component<Props> {
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
      card.code === '03012' ||
      card.code === '03306' ||
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness')
    ) {
      return '-';
    }
    return `${card.cost !== null ? card.cost : 'X'}`;
  }

  static factionIcon(card: Card): string {
    if (card.faction2_code) {
      return 'elder_sign';
    }
    if (card.faction_code === 'neutral') {
      if (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness') {
        return 'weakness';
      }
      return 'elder_sign';
    }
    if (card.faction_code) {
      return card.faction_code;
    }
    return 'elder_sign';
  }

  color() {
    const {
      card,
    } = this.props;
    if (card.faction2_code) {
      return FACTION_COLORS.dual;
    }
    if (card.faction_code) {
      return FACTION_COLORS[card.faction_code];
    }
    return FACTION_COLORS.neutral;
  }

  render() {
    const {
      card,
      inverted,
    } = this.props;
    const color = this.color();
    const level = (card.xp === null || card.xp === undefined) ?
      'none' : `${card.xp}`;
    return (
      <View style={styles.level}>
        <View style={styles.levelIcon}>
          <AppIcon
            name={`${inverted ? 'inverted_' : ''}level_${level}`}
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
            <Text style={styles.costNumber} allowFontScaling={false}>
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
    width: COST_ICON_SIZE,
    height: COST_ICON_SIZE,
  },
  levelIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: COST_ICON_SIZE,
    height: COST_ICON_SIZE,
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
    fontSize: (isBig ? 32 : 23) * scaleFactor,
    color: '#FFF',
  },
  factionIcon: {
  },
});
