import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { SkillCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  skill: SkillCodeType;
  size: number;
  weakness?: boolean;
}

export default function SkillIcon({ skill, size, weakness }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const ICON_SIZE = fontScale * size;

  return (
    <View style={[styles.skillIcon, { width: ICON_SIZE, height: ICON_SIZE }]}>
      <View style={[styles.icon, { top: 1 }]}>
        <ArkhamIcon
          name={`skill_${skill}_inverted`}
          size={ICON_SIZE}
          color="#FFF"
        />
      </View>
      <View style={[styles.icon, { top: 1 }]}>
        <ArkhamIcon
          name={`skill_${skill}`}
          size={ICON_SIZE}
          color={weakness ? '#000000' : colors.skill[skill].icon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skillIcon: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: -1,
    left: 0,
  },
});
