import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { t } from 'ttag';
import AccordionItem from '../AccordionItem';
import ToggleFilter from 'components/core/ToggleFilter';
import { SkillIconsFilters } from 'lib/filters';

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  skillIcons: SkillIconsFilters;
  enabled: boolean;
  onToggleChange: (setting: string, value: boolean) => void;
  fontScale: number;
}

export default class SkillIconChooser extends React.Component<Props> {
  _onToggleChange = (key: string) => {
    const {
      onFilterChange,
      skillIcons,
    } = this.props;

    onFilterChange('skillIcons', {
      ...skillIcons,
      [key]: !skillIcons[key as keyof SkillIconsFilters],
    });
  };

  render() {
    const {
      skillIcons: {
        willpower,
        intellect,
        combat,
        agility,
        wild,
        doubleIcons,
      },
      enabled,
      onToggleChange,
      fontScale,
    } = this.props;
    return (
      <AccordionItem
        label={enabled ? t`Skill Icons` : t`Skill Icons: All`}
        height={90}
        fontScale={fontScale}
        enabled={enabled}
        toggleName="skillEnabled"
        onToggleChange={onToggleChange}
      >
        <View style={styles.toggleRow}>
          <ToggleFilter
            icon="willpower"
            setting="willpower"
            value={willpower}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="intellect"
            setting="intellect"
            value={intellect}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            label="2+"
            setting="doubleIcons"
            value={doubleIcons}
            onChange={this._onToggleChange}
          />
        </View>
        <View style={styles.toggleRow}>
          <ToggleFilter
            icon="combat"
            setting="combat"
            value={combat}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="agility"
            setting="agility"
            value={agility}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="wild"
            setting="wild"
            value={wild}
            onChange={this._onToggleChange}
          />
        </View>
      </AccordionItem>
    );
  }
}


const styles = StyleSheet.create({
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
