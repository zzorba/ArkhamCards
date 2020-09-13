import React from 'react';
import { StyleSheet } from 'react-native';

import { SettingsSwitch as SwitchRow } from '@lib/react-native-settings-components';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
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
  return (
    <StyleContext.Consumer>
      { ({ gameFont }) => (
        <SwitchRow
          title={title}
          titleStyle={settingsStyle ? undefined : {
            ...typography.mediumGameFont,
            fontFamily: gameFont,
          }}
          containerStyle={styles.switch}
          descriptionStyle={typography.label}
          description={description}
          onValueChange={onValueChange}
          value={value}
          disabled={disabled}
        />
      )}
    </StyleContext.Consumer>
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
});
