import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import ArkhamIcon from '@icons/ArkhamIcon';
import Card from '@data/Card';
import { TINY_PHONE } from '@styles/sizes';
import { isBig, s, xs } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
}

export default function InvestigatorStatLine({ investigator }: Props) {
  return (
    <StyleContext.Consumer>
      { ({ fontScale, colors }) => {
        const ICON_SIZE = fontScale * (isBig ? 1.2 : 1.0) * 26;
        const willpower = investigator.skill_willpower || 0;
        const intellect = investigator.skill_intellect || 0;
        const combat = investigator.skill_combat || 0;
        const agility = investigator.skill_agility || 0;

        return (
          <View style={styles.skillRow}>
            <View style={[styles.skillIconBlock, { backgroundColor: colors.L20 }]} accessibilityLabel={t`Willpower: ${willpower}`}>
              <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
                { willpower}
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
                    color={colors.skill.willpower.icon}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.skillIconBlock, { backgroundColor: colors.L20 }]} accessibilityLabel={t`Intellect: ${intellect}`}>
              <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
                { intellect }
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
                    color={colors.skill.intellect.icon}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.skillIconBlock, { backgroundColor: colors.L20 }]} accessibilityLabel={t`Combat: ${combat}`}>
              <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
                { combat }
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
                    color={colors.skill.combat.icon}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.skillIconBlock, { backgroundColor: colors.L20 }]} accessibilityLabel={t`Agility: ${agility}`}>
              <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
                { agility }
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
                    color={colors.skill.agility.icon}
                  />
                </View>
              </View>
            </View>
          </View>
        );
      } }
    </StyleContext.Consumer>
  );
}
const styles = StyleSheet.create({
  skillIconBlock: {
    flexDirection: 'row',
    borderRadius: 4 ,
    paddingTop: 2,
    paddingLeft: s,
    paddingRight: s,
    marginRight: TINY_PHONE ? xs : xs,
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
    justifyContent: 'flex-start',
    marginBottom: s,
  },
});
