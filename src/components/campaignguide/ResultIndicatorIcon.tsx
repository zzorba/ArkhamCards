import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { COLORS } from 'styles/colors';

interface Props {
  result: boolean;
  noBorder?: boolean;
}

export default function ResultIndicatorIcon({ result, noBorder }: Props) {
  return (
    <View style={[styles.icon, noBorder ? {} : styles.iconBorder]}>
      <MaterialCommunityIcons
        name={result ? 'thumb-up-outline' : 'thumb-down-outline'}
        size={24}
        color={COLORS.scenarioGreen}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    padding: 4,
    paddingLeft: 16,
    paddingRight: 16,
    width: 56,
    maxHeight: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBorder: {
    borderBottomWidth: 1,
    borderColor: '#FFF',
  },
});
