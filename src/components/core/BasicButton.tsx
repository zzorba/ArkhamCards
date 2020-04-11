import React from 'react';
import { Button, ButtonProps, View } from 'react-native';
import space from 'styles/space';

export default function BasicButton(props: ButtonProps) {
  return (
    <View style={space.button}>
      <Button {...props} />
    </View>
  );
}
