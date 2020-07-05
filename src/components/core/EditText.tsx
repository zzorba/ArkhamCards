import React from 'react';
import { StyleSheet } from 'react-native';
import { t } from 'ttag';

import SettingsEditText from './SettingsEditText'
import COLORS from 'styles/colors';
import { m, s } from 'styles/space';
import typography from 'styles/typography';

interface Props {
  title: string;
  dialogDescription?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (text: string) => void;
}

export default function EditText({
  title,
  dialogDescription,
  placeholder,
  value,
  onValueChange,
}: Props) {
  return (
    <SettingsEditText
      title={title}
      titleStyle={typography.mediumGameFont}
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
    color: COLORS.darkText,
    textAlign: 'left',
  },
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: m,
    paddingTop: s,
    paddingBottom: s,
  },
});
