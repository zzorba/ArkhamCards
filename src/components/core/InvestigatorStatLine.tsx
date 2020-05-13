import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArkhamIcon from 'icons/ArkhamIcon';
import { SKILL_COLORS } from 'constants';
import Card from 'data/Card';
import { TINY_PHONE } from 'styles/sizes';
import { isBig, s } from 'styles/space';
import typography from 'styles/typography';

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
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="skill_willpower"
            size={ICON_SIZE}
            color={SKILL_COLORS.willpower}
          />
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_intellect || 0 }
        </Text>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="skill_intellect"
            size={ICON_SIZE}
            color={SKILL_COLORS.intellect}
          />
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_combat || 0 }
        </Text>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="skill_combat"
            size={ICON_SIZE}
            color={SKILL_COLORS.combat}
          />
        </View>
      </View>
      <View style={styles.skillIconBlock}>
        <Text style={typography.mediumGameFont}>
          { investigator.skill_agility || 0 }
        </Text>
        <View style={styles.skillIcon}>
          <ArkhamIcon
            name="skill_agility"
            size={ICON_SIZE}
            color={SKILL_COLORS.agility}
          />
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
    borderWidth: TINY_PHONE ? 0 : 1,
    borderColor: '#888',
    backgroundColor: '#FFF',
  },
  skillIcon: {
    marginLeft: 2,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: s,
    width: '100%',
  },
});
