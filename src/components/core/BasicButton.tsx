import React from 'react';
import { Button, ButtonProps, StyleSheet, View } from 'react-native';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props extends ButtonProps {
  grow?: boolean;
}
export default function BasicButton({ grow, ...otherProps }: Props) {
  return (
    <View style={[space.button, grow ? styles.grow : {}]}>
      <Button {...otherProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  grow: {
    width: '100%',
  },
});
