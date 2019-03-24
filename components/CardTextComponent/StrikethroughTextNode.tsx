import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from './types';

export default function StrikethroughTextNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text
      key={state.key}
      style={styles.strikeText}
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
