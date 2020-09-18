import React, { useContext } from 'react';
import { Platform, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import StyleContext from '@styles/StyleContext';

interface Props extends TextProps {
  style?: TextStyle;
  children: React.ReactNode;
}
export default function DialogTitle({ style, children, ...otherProps }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <Text style={[styles.text, typography.black, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: Platform.select({
    ios: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
    },
    default: {
      fontWeight: '500',
      fontSize: 18,
    },
  }),
});
