import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import COLORS from '@styles/colors';
import space from '@styles/space';

interface Props {
  result: boolean;
}

export default function ResultIndicatorIcon({ result }: Props) {
  return (
    <View style={[
      styles.icon,
      space.paddingXs,
      space.paddingSideM,
    ]}>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
