import React, { ReactNode } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import typography from 'styles/typography';

interface Props {
  text?: string;
  icon?: ReactNode;
  onPress?: () => void;
  align?: 'left' | 'center' |'right';
  size?: 'small' | 'normal';
  style?: ViewStyle | ViewStyle[];
  width?: number;
  color?: 'default' | 'green' | 'purple' | 'red' | 'yellow' | 'white';
  grow?: boolean;
}

export default function Button({
  text,
  icon,
  align = 'center',
  size = 'normal',
  width,
  onPress,
  style,
  color = 'default',
  grow,
}: Props) {
  let containerStyle: ViewStyle = styles.centerContainer;
  switch (align) {
    case 'left': containerStyle = styles.leftContainer; break;
    case 'right': containerStyle = styles.rightContainer; break;
    default: containerStyle = styles.centerContainer; break;
  }
  const padding = size === 'small' ? 8 : 16;
  let borderWidth = 0;
  let borderColor = null;
  let textColor = '#FFFFFF';
  let colors = ['#3093c7', '#1c5a85'];
  switch(color) {
    case 'green':
      colors = ['#107116', '#0b4f0f'];
      break;
    case 'red':
      colors = ['#cc3038', '#a3262d'];
      break;
    case 'purple':
      colors = ['#4331b9', '#2f2282'];
      break;
    case 'yellow':
      colors = ['#ec8426', '#bd6a1e'];
      break;
    case 'white':
      borderWidth = 1;
      borderColor = '#888888';
      textColor = '#222222';
      colors = ['#ffffff', '#d3d3d3'];
      break;
  }
  const normalizedStyle = Array.isArray(style) ? style : [style];
  return (
    <View style={[containerStyle, ...normalizedStyle, grow ? { flex: 1 } : {}]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          borderColor ? { borderRadius: 4, borderWidth, borderColor } : {},
          grow ? { width: '100%' } : {},
        ]}
      >
        <LinearGradient colors={colors} style={[
          styles.button,
          styles.row,
          width ? { width } : {},
          { paddingLeft: padding, paddingRight: padding },
          grow ? { width: '100%' } : {},
        ]}>
          { !!icon && (
            <View style={[styles.icon, text ? { marginRight: padding / 2 } : {}]}>
              { icon }
            </View>
          ) }
          { !!text && (
            <Text style={[
              typography.text,
              {
                fontWeight: size === 'small' ? '400' : '700',
                color: textColor,
              },
            ]}>
              { text }
            </Text>
          ) }
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

interface Styles {
  icon: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  centerContainer: ViewStyle;
  button: ViewStyle;
  row: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  icon: {
    marginRight: 4,
    marginLeft: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
