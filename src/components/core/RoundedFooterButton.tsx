import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';

interface Props {
  onPress?: () => void;
  icon: ArkhamButtonIconType | 'spinner';
  title: string;
  color?: 'light' | 'dark';
}

function computeHeight(fontScale: number) {
  return (18 * fontScale) + 22;
}

function RoundedFooterButton({ onPress, icon, title, color = 'dark' }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = computeHeight(fontScale);
  const backgroundColor = color === 'dark' ? colors.L10 : colors.L20;
  const rippleColor = color === 'dark' ? colors.L20 : colors.L30;
  const textColor = color === 'dark' ? colors.D20 : colors.M;
  return (
    <Ripple
      style={[
        styles.buttonStyle,
        {
          backgroundColor,
          height,
          borderColor: backgroundColor,
        },
      ]}
      rippleColor={rippleColor}
      onPress={onPress}
      disabled={!onPress}
    >
      <View pointerEvents="box-none" style={styles.row}>
        { icon === 'spinner' ? <ActivityIndicator size="small" color={textColor} animating /> : <ArkhamButtonIcon icon={icon} color={color === 'dark' ? 'dark' : 'faded'} /> }
        <Text style={[typography.button, { marginLeft: height / 4, color: textColor }]}>
          { title }
        </Text>
      </View>
    </Ripple>
  );
}

RoundedFooterButton.computeHeight = computeHeight;

export default RoundedFooterButton;

const styles = StyleSheet.create({
  buttonStyle: {
    paddingLeft: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
});
