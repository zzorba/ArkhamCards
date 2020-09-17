import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { SettingsSwitch as SwitchRow } from '@lib/react-native-settings-components';
import typography from '@styles/typography';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  settingsStyle?: boolean;
}

export default function SettingsSwitch({ title, description, onValueChange, value, disabled, settingsStyle }: Props) {
  const { gameFont, colors } = useContext(StyleContext);
  return (
    <SwitchRow
      title={title}
      titleStyle={settingsStyle ? undefined : {
        ...typography.mediumGameFont,
        fontFamily: gameFont,
      }}
      containerStyle={{
        ...styles.switch,
        backgroundColor: colors.background,
        borderColor: colors.divider,
      }}
      descriptionStyle={typography.label}
      description={description}
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  switch: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: s,
    paddingBottom: s,
  },
});
