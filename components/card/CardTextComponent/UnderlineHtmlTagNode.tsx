import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from './types';

export default function UnderlineHtmlTagNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
