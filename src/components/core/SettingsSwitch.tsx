import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { SettingsSwitch as SwitchRow } from '@lib/react-native-settings-components';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  settingsStyle?: boolean;
  noDisableText?: boolean;
  last?: boolean;
}

export default function SettingsSwitch({ title, description, noDisableText, onValueChange, value, disabled, settingsStyle, last }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const titleStyle = settingsStyle ? typography.text : typography.mediumGameFont;
  return (
    <SwitchRow
      title={title}
      titleStyle={titleStyle}
      containerStyle={{
        paddingTop: s,
        paddingBottom: s,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderColor: colors.divider,
      }}
      descriptionStyle={typography.small}
      description={description}
      onValueChange={onValueChange}
      disabledOverlayStyle={noDisableText ? { backgroundColor: 'transparent' } : undefined}
      value={value}
      disabled={disabled}
    />
  );
}

