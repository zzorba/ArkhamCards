import React from 'react';
import { StyleSheet } from 'react-native';
import { SettingsEditText } from 'react-native-settings-components';
import { t } from 'ttag';

import COLORS from 'styles/colors';
import typography from 'styles/typography';

interface Props {
  title: string;
  dialogDescription?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (text: string) => void;
  settingsStyle?: boolean;
}

export default function EditText({
  title,
  dialogDescription,
  placeholder,
  value,
  settingsStyle,
  onValueChange,
}: Props) {
  return (
    <SettingsEditText
      title={title}
      titleStyle={settingsStyle ? undefined : typography.mediumGameFont}
      dialogDescription={dialogDescription}
      valuePlaceholder={placeholder}
      valueProps={{
        numberOfLines: 2,
        ellipsizeMode: 'clip',
      }}
      valueStyle={styles.value}
      onValueChange={onValueChange}
      value={value}
      containerStyle={styles.container}
      positiveButtonTitle={t`Done`}
      negativeButtonTitle={t`Cancel`}
    />
  );
}

const styles = StyleSheet.create({
  value: {
    fontFamily: 'System',
    fontSize: 16,
    color: COLORS.darkTextColor,
    flex: 3,
  },
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
});
