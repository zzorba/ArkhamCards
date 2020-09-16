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
import StyleContext from '@styles/StyleContext';

interface Props {
  text?: string;
  onPress: () => void;
  indent?: boolean;
  children?: ReactNode;
  noBorder?: boolean;
  disabled?: boolean;
  color?: string;
}
export default function NavButton({ disabled, text, onPress, color, indent, children, noBorder }: Props) {
  return (
    <StyleContext.Consumer>
      { ({ fontScale }) => (
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
      ) }
    </StyleContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
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
