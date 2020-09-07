import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { t } from 'ttag';

import withStyles, { StylesProps } from '@components/core/withStyles';
import SettingsEditText from './SettingsEditText';
import COLORS from '@styles/colors';
import { m, s, xs } from '@styles/space';
import typography from '@styles/typography';

interface Props {
  title: string;
  dialogDescription?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (text: string) => void;
  settingsStyle?: boolean;
}

function EditText({
  title,
  dialogDescription,
  placeholder,
  value,
  onValueChange,
  gameFont,
  settingsStyle,
}: Props & StylesProps) {
  return (
    <SettingsEditText
      title={title}
      titleStyle={
        settingsStyle ?
        { ...typography.label, paddingLeft: 0 } :
        { ...typography.mediumGameFont, fontFamily: gameFont }}
      dialogDescription={dialogDescription}
      valuePlaceholder={placeholder}
      valueProps={{
        numberOfLines: 2,
        ellipsizeMode: 'clip',
      }}
      valueStyle={styles.value}
      onValueChange={onValueChange}
      value={value}
      containerStyle={{
        ...styles.container,
        paddingLeft: Platform.OS === 'ios' && settingsStyle ? s + xs : m,
      }}
      positiveButtonTitle={t`Done`}
      negativeButtonTitle={t`Cancel`}
    />
  );
}

export default withStyles(EditText);

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: m,
    paddingTop: s,
    paddingBottom: s,
  },
});
