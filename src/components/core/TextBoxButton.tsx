import React, { useCallback, useContext, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextStyle,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props extends TextInputProps {
  value: string;
  placeholder?: string;
  crossedOut?: boolean;
  style?: TextStyle;
  textStyle?: TextStyle;
  multiline?: boolean;
  ellipsizeMode?: string;
}

export default function TextBoxButton({ value, multiline, crossedOut, placeholder, textStyle = {}, ...otherProps }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const [height, setHeight] = useState(24);
  const updateSize = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  }, [setHeight]);

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          paddingTop: (xs / 2),
          width: '100%',
          padding: 0,
          paddingLeft: xs,
          minHeight: 22,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        editable={false}
        multiline={multiline}
        {...otherProps}
      >
        <Text style={[
          typography.text,
          styles.input,
          { color: colors.lightText },
          textStyle,
          multiline ? { height: height + 12 } : {},
          crossedOut ? {
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            textDecorationColor: colors.lightText,
          } : {},
          value ? { color: colors.darkText } : { color: colors.lightText },
        ]}
        onLayout={multiline ? updateSize : undefined}>
          { value || placeholder }
        </Text>
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: xs,
    overflow: 'hidden',
    marginBottom: xs,
  },
  input: {
    width: '100%',
  },
});
