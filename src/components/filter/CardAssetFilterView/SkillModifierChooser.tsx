import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import AccordionItem from '../AccordionItem';
import ToggleFilter from '@components/core/ToggleFilter';
import { FilterState, SkillModifierFilters } from '@lib/filters';
import { xs } from '@styles/space';

interface Props {
  onFilterChange: (setting: keyof FilterState, value: any) => void;
  skillModifiers: SkillModifierFilters;
  enabled: boolean;
  onToggleChange: (setting: keyof FilterState, value: boolean) => void;
}

export default function SkillModifierChooser({ onFilterChange, skillModifiers, enabled, onToggleChange }: Props) {
  const handleToggleChange = useCallback((key: keyof FilterState) => {
    onFilterChange('skillModifiers', {
      ...skillModifiers,
      [key]: !skillModifiers[key as keyof SkillModifierFilters],
    });
  }, [onFilterChange, skillModifiers]);
  const {
    willpower,
    intellect,
    combat,
    agility,
  } = skillModifiers;
  return (
    <AccordionItem
      label={enabled ? t`Skill Boosts` : t`Skill Boosts: All`}
      height={90}
      enabled={enabled}
      toggleName="skillModifiersEnabled"
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
    flexWrap: 'wrap',
  },
});
