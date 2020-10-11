import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  result: boolean;
}

export default function ResultIndicatorIcon({ result }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[
      styles.icon,
      space.paddingXs,
      space.paddingSideM,
    ]}>
      <MaterialCommunityIcons
        name={result ? 'thumb-up-outline' : 'thumb-down-outline'}
        size={24}
        color={colors.scenarioGreen}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
