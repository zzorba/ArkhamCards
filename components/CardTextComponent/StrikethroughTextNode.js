import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function StrikethroughTextNode(node, output, state) {
  return (
    <Text
      key={state.key}
      style={styles.strikeText}
      textDecorationLine="line-through"
    >
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  strikeText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#222',
  },
});
