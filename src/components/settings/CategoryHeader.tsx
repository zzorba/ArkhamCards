import React from 'react';
import { StyleSheet } from 'react-native';
import { SettingsCategoryHeader } from 'react-native-settings-components';

import COLORS from 'styles/colors';
import typography from 'styles/typography';

interface Props {
  title: string;
}

export default function CategoryHeader({ title }: Props) {
  return (
    <SettingsCategoryHeader
      title={title}
      titleStyle={[typography.smallLabel, { color: COLORS.darkText}]}
      containerStyle={styles.categoryContainer}
    />
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: COLORS.veryLightBackground,
  },
});
