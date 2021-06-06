import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';

interface Props {
  result: boolean;
}

export default function ResultIndicatorIcon({ result }: Props) {
  const { colors } = useContext(StyleContext);
  const backgroundColor = result ? colors.campaign.setup : colors.campaign.resolution;
  return (
    <View style={[styles.iconWrapper, space.paddingRightM]}>
      <View style={[styles.icon, { backgroundColor }]}>
        <AppIcon
          name={result ? 'check' : 'close'}
          size={result ? 18 : 24}
          color={colors.L30}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
