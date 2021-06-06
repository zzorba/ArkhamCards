import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { map, range, flatten } from 'lodash';
import { t } from 'ttag';

import ArkhamIcon from '@icons/ArkhamIcon';
import Card from '@data/types/Card';
import { TINY_PHONE } from '@styles/sizes';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import SkillIcon from '@components/core/SkillIcon';
import HealthSanityIcon from '../../../core/HealthSanityIcon';

interface Props {
  enemy: Card;
}

export default function EnemyStatLine({ enemy }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const fight = enemy.enemyFight();
  const health = enemy.enemyHealth();
  const evade = enemy.enemyEvade();

  const skillIconBlockStyle = [
    styles.iconBlock,
    { backgroundColor: colors.L20 },
  ];

  const damageLine = flatten([
    (enemy.enemy_damage || 0) > 0 ? [`Damage: ${enemy.enemy_damage || 0}.`] : [],
    (enemy.enemy_horror || 0) > 0 ? [`Horror: ${enemy.enemy_horror || 0}.`] : [],
  ]).join(' ');
  return (
    <>
      <View style={styles.iconRow}>
        <View style={skillIconBlockStyle} accessibilityLabel={t`Fight: ${fight}`}>
          <View style={space.marginRightS}>
            <SkillIcon skill="combat" size={24} />
          </View>
          <Text style={typography.mediumGameFont}>
            { fight }
          </Text>
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
          <View style={space.marginRightS}>
            <Text style={typography.mediumGameFont}>
              { evade }
            </Text>
          </View>
          <SkillIcon skill="agility" size={24} />
        </View>
      </View>
      <View style={styles.iconRow} accessibilityLabel={damageLine}>
        { map(range(0, enemy.enemy_damage || 0), idx => (
          <HealthSanityIcon key={idx} type="health" />
        )) }
        { map(range(0, enemy.enemy_horror || 0), idx => (
          <HealthSanityIcon key={idx} type="sanity" />
        )) }
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  iconBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4 ,
    paddingTop: xs,
    paddingBottom: xs,
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
