import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { TINY_PHONE } from '@styles/sizes';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import SkillIcon from '@components/core/SkillIcon';

interface Props {
  investigator: Card;
}


function specialCost(index: number) {
  if (index === -2) {
    return 'X';
  }
  if (index === -1) {
    return '-';
  }
  return `${index}`;
}

export default function InvestigatorStatLine({ investigator }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const willpower = investigator.skill_willpower ?? 0;
  const intellect = investigator.skill_intellect ?? 0;
  const combat = investigator.skill_combat ?? 0;
  const agility = investigator.skill_agility ?? 0;

  const skillIconBlockStyle = [
    styles.skillIconBlock,
    { backgroundColor: colors.L20 },
  ];
  return (
    <View style={styles.skillRow}>
      <View style={skillIconBlockStyle} accessibilityLabel={t`Willpower: ${willpower}`}>
        <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
          { specialCost(willpower) }
        </Text>
        <SkillIcon skill="willpower" size={26} />
      </View>
      <View style={skillIconBlockStyle} accessibilityLabel={t`Intellect: ${intellect}`}>
        <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
          { specialCost(intellect) }
        </Text>
        <SkillIcon skill="intellect" size={26} />
      </View>
      <View style={skillIconBlockStyle} accessibilityLabel={t`Combat: ${combat}`}>
        <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
          { specialCost(combat) }
        </Text>
        <SkillIcon skill="combat" size={26} />
      </View>
      <View style={skillIconBlockStyle} accessibilityLabel={t`Agility: ${agility}`}>
        <Text style={[typography.mediumGameFont, { color: colors.darkText }]}>
          { specialCost(agility) }
        </Text>
        <SkillIcon skill="agility" size={26} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  skillIconBlock: {
    flexDirection: 'row',
    borderRadius: 4,
    paddingTop: 2,
    paddingLeft: TINY_PHONE ? xs : s,
    paddingRight: TINY_PHONE ? xs : s,
    marginRight: xs,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: s,
  },
});
