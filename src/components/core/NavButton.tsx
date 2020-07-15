import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import typography from '@styles/typography';
import { xs, s, isBig } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  fontScale: number;
  text?: string;
  onPress: () => void;
  indent?: boolean;
  children?: ReactNode;
  noBorder?: boolean;
  disabled?: boolean;
  color?: string;
}
export default function NavButton({ disabled, text, fontScale, onPress, color, indent, children, noBorder }: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!!disabled}>
      <View style={[
        styles.container,
        indent ? styles.indentedContainer : {},
        noBorder ? {} : styles.bottomBorder,
      ]}>
        { text ? (
          <View style={[
            styles.text,
            { minHeight: 22 + 18 * fontScale * (isBig ? 1.2 : 1.0) },
          ]}>
            <Text style={typography.text} numberOfLines={1}>
              { text }
            </Text>
          </View>
        ) : <View style={styles.flex}>{ children }</View> }
        <View style={styles.icon}>
          { !disabled && (
            <MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color={color || 'rgb(0, 122,255)'}
            />
          ) }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: s,
    paddingTop: xs,
    paddingBottom: xs,
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
  indentedContainer: {
    paddingLeft: 18,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxWidth: 40,
    marginRight: xs,
  },
  flex: {
    flex: 1,
  },
});
