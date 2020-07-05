import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import AppIcon from 'icons/AppIcon';
import ArkhamIcon from 'icons/ArkhamIcon';
import Card from 'data/Card';
import { isBig } from 'styles/space';
import COLORS from 'styles/colors';

export function costIconSize(fontScale: number) {
  const scaleFactor = ((fontScale - 1) / 2 + 1);
  return (isBig ? 48 : 36) * scaleFactor;
}

interface Props {
  card: Card;
  fontScale: number;
  inverted?: boolean;
  linked?: boolean;
}
export default class CardCostIcon extends React.PureComponent<Props> {
  cardCost() {
    const {
      card,
      linked,
    } = this.props;
    if (card.type_code === 'skill') {
      return '';
    }
    if (card.code === '03016') {
      return '0';
    }
    if (card.code === '02010' ||
      card.code === '03238' ||
      card.cost === -2
    ) {
      return 'X';
    }
    if (card.permanent || card.double_sided || linked || card.linked_card) {
      return '-';
    }
    if (card.cost === null) {
      return '-';
    }
    return `${card.cost}`;
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
      return COLORS.faction.dual.background;
    }
    return COLORS.faction[card.factionCode()].background;
  }

  render() {
    const {
      card,
      fontScale,
      inverted,
    } = this.props;
    const color = this.color();
    const level = (card.xp === null || card.xp === undefined) ?
      'none' : `${card.xp}`;

    const scaleFactor = ((fontScale - 1) / 2 + 1);
    const ICON_SIZE = (isBig ? 46 : 32) * scaleFactor;
    const style = { width: costIconSize(fontScale), height: costIconSize(fontScale) };
    return (
      <View style={[styles.level, style]}>
        <View style={[styles.levelIcon, style]}>
          <AppIcon
            name={`${inverted ? '' : 'inverted_'}level_${level}`}
            size={ICON_SIZE}
            color={inverted ? color : COLORS.lightBackground}
          />
        </View>
        <View style={[styles.levelIcon, style]}>
          <AppIcon
            name={`${inverted ? 'inverted_' : ''}level_${level}`}
            size={ICON_SIZE}
            color={inverted ? COLORS.background : color}
          />
        </View>
        <View style={[styles.levelIcon, style, styles.cost]}>
          { card.type_code === 'skill' ? (
            <View>
              <ArkhamIcon
                name={CardCostIcon.factionIcon(card)}
                color={COLORS.background}
                size={ICON_SIZE / 2}
              />
            </View>
          ) : (
            <Text style={[
              styles.costNumber,
              { fontSize: (isBig ? 32 : 23) * scaleFactor },
            ]} allowFontScaling={false}>
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
  },
  levelIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
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
    color: COLORS.white,
  },
});
