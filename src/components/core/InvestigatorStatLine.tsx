import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArkhamIcon from '@icons/ArkhamIcon';
import Card from '@data/Card';
import { TINY_PHONE } from '@styles/sizes';
import { isBig, m, s, xs } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';

interface Props {
  investigator: Card;
  fontScale: number;
}

export default function InvestigatorStatLine({ investigator, fontScale }: Props) {
  const ICON_SIZE = fontScale * (isBig ? 1.2 : 1.0) * 26;
  return (
    <View style={styles.skillRow}>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_willpower || 0 }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE }]}>
          <View style={[styles.icon, { top: 1 }]}>
            <ArkhamIcon
              name="skill_willpower_inverted"
              size={ICON_SIZE}
              color="#FFF"
            />
          </View>
          <View style={[styles.icon, { top: 1 }]}>
            <ArkhamIcon
              name="skill_willpower"
              size={ICON_SIZE}
              color={COLORS.skill.willpower.default}
            />
          </View>
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_intellect || 0 }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE }]}>
          <View style={styles.icon}>
            <ArkhamIcon
              name="skill_intellect_inverted"
              size={ICON_SIZE}
              color="#FFF"
            />
          </View>
          <View style={styles.icon}>
            <ArkhamIcon
              name="skill_intellect"
              size={ICON_SIZE}
              color={COLORS.skill.intellect.default}
            />
          </View>
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_combat || 0 }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE }]}>
          <View style={styles.icon}>
            <ArkhamIcon
              name="skill_combat_inverted"
              size={ICON_SIZE}
              color="#FFF"
            />
          </View>
          <View style={styles.icon}>
            <ArkhamIcon
              name="skill_combat"
              size={ICON_SIZE}
              color={COLORS.skill.combat.default}
            />
          </View>
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_agility || 0 }
        </Text>
        <View style={[styles.skillIcon, { width: ICON_SIZE }]}>
          <View style={[styles.icon, { top: 1 }]}>
            <ArkhamIcon
              name="skill_agility_inverted"
              size={ICON_SIZE - 1}
              color="#FFF"
            />
          </View>
          <View style={[styles.icon, { top: 1 }]}>
            <ArkhamIcon
              name="skill_agility"
              size={ICON_SIZE - 1}
              color={COLORS.skill.agility.default}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  skillIconBlock: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingTop: 2,
    paddingLeft: s,
    paddingRight: s,
    marginLeft: TINY_PHONE ? 0 : s,
    marginRight: TINY_PHONE ? xs : m,
    borderWidth: TINY_PHONE ? 0 : 1,
    borderColor: COLORS.divider,
    backgroundColor: TINY_PHONE ? 'transparent' : COLORS.veryLightBackground,
  },
  skillIcon: {
    marginLeft: 2,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 2,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginBottom: s,
  },
});
