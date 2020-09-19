import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map, range } from 'lodash';
import { t } from 'ttag';

import ArkhamIcon from '@icons/ArkhamIcon';
import Card from '@data/Card';
import { TINY_PHONE } from '@styles/sizes';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  enemy: Card;
}

export default function EnemyStatLine({ enemy }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const fight = enemy.enemyFight();
  const health = enemy.enemyHealth();
  const evade = enemy.enemyEvade();

  const skillIconBlockStyle = [
    styles.iconBlock,
    { backgroundColor: colors.L20 },
  ];
  return (
    <>
      <View style={styles.iconRow}>
        <View style={skillIconBlockStyle} accessibilityLabel={t`Fight: ${fight}`}>
          <Text style={[typography.mediumGameFont, { color: colors.fight }]}>
            { fight }
          </Text>
          <View style={styles.icon}>
            <ArkhamIcon name="combat" size={20 * fontScale} color={colors.fight} />
          </View>
        </View>
        <View style={skillIconBlockStyle} accessibilityLabel={enemy.health_per_investigator ?
          t`Health: ${health} per investigator` : t`Health: ${health}`}>
          <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
            { health }
          </Text>
          { !!enemy.health_per_investigator && (
            <View style={styles.icon}>
              <ArkhamIcon name="per_investigator" size={22} color={colors.darkText} />
            </View>
          ) }
        </View>
        <View style={skillIconBlockStyle} accessibilityLabel={t`Evade: ${evade}`}>
          <Text style={[typography.mediumGameFont, { color: colors.evade }]}>
            { evade }
          </Text>
          <View style={styles.icon}>
            <ArkhamIcon name="agility" size={20 * fontScale} color={colors.evade} />
          </View>
        </View>
      </View>
      <View style={styles.iconRow}>
        { map(range(0, enemy.enemy_damage || 0), idx => (
          <View style={{ width: 24 * fontScale }} key={idx}>
            <ArkhamIcon
              name="health"
              size={24 * fontScale}
              color={colors.health}
            />
          </View>
        )) }
        { map(range(0, enemy.enemy_horror || 0), idx => (
          <View style={{ width: 30 * fontScale }} key={idx}>
            <ArkhamIcon
              name="sanity"
              size={24 * fontScale}
              color={colors.sanity}
            />
          </View>
        )) }
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4 ,
    paddingTop: 2,
    paddingLeft: s,
    paddingRight: s,
    marginRight: TINY_PHONE ? xs : xs,
  },
  skillIcon: {
    marginLeft: 2,
    position: 'relative',
  },
  icon: {
    marginLeft: 4,
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: s,
  },
  healthIcon: {
    width: 24,
  },
  sanityIcon: {
    width: 28,
  },
});
