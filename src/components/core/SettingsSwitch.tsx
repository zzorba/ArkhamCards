import React from 'react';
import { StyleSheet } from 'react-native';
import { SettingsSwitch as SwitchRow } from 'react-native-settings-components';

import typography from '@styles/typography';
import COLORS from '@styles/colors';
import { m, s } from '@styles/space';

interface Props {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function SettingsSwitch({ title, description, onValueChange, value, disabled }: Props) {
  return (
    <SwitchRow
      title={title}
      titleStyle={typography.mediumGameFont}
      containerStyle={styles.switch}
      descriptionStyle={typography.label}
      description={description}
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
      disabledOverlayStyle={{ backgroundColor: COLORS.disabledOverlay }}
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.background,
    paddingTop: s,
    paddingBottom: s,
  },
  block: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
  },
  container: {
    backgroundColor: COLORS.background,
  },
});
