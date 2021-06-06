import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import AccordionItem from '../AccordionItem';
import ToggleFilter from '@components/core/ToggleFilter';
import { SkillIconsFilters } from '@lib/filters';
import { xs } from '@styles/space';

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  skillIcons: SkillIconsFilters;
  enabled: boolean;
  onToggleChange: (setting: string, value: boolean) => void;
}

export default function SkillIconChooser({ onFilterChange, skillIcons, enabled, onToggleChange }: Props) {
  const handleToggleChange = useCallback((key: string) => {
    onFilterChange('skillIcons', {
      ...skillIcons,
      [key]: !skillIcons[key as keyof SkillIconsFilters],
    });
  }, [onFilterChange, skillIcons]);
  const {
    willpower,
    intellect,
    combat,
    agility,
    wild,
    doubleIcons,
  } = skillIcons;
  return (
    <AccordionItem
      label={enabled ? t`Skill Icons` : t`Skill Icons: All`}
      height={90}
      enabled={enabled}
      toggleName="skillEnabled"
      onToggleChange={onToggleChange}
    >
      <View style={styles.toggleRow}>
        <ToggleFilter
          icon="willpower"
          setting="willpower"
          value={willpower}
          onChange={handleToggleChange}
        />
        <ToggleFilter
          icon="intellect"
          setting="intellect"
          value={intellect}
          onChange={handleToggleChange}
        />
        <ToggleFilter
          label="2+"
          setting="doubleIcons"
          value={doubleIcons}
          onChange={handleToggleChange}
        />
      </View>
      <View style={styles.toggleRow}>
        <ToggleFilter
          icon="combat"
          setting="combat"
          value={combat}
          onChange={handleToggleChange}
        />
        <ToggleFilter
          icon="agility"
          setting="agility"
          value={agility}
          onChange={handleToggleChange}
        />
        <ToggleFilter
          icon="wild"
          setting="wild"
          value={wild}
          onChange={handleToggleChange}
        />
      </View>
    </AccordionItem>
  );
}


const styles = StyleSheet.create({
  toggleRow: {
    marginTop: xs,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
