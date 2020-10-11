import React, { useContext } from 'react';
import { Button, ButtonProps, StyleSheet, View, Platform } from 'react-native';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props extends ButtonProps {
  grow?: boolean;
}
export default function BasicButton({ grow, ...otherProps }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[space.button, grow ? styles.grow : {}]}>
      <Button
        color={Platform.OS === 'ios' ? colors.navButton : undefined}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grow: {
    width: '100%',
  },
});
