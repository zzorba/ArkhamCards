import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from 'styles/space';
import { WithChildren } from './types';

export default function BoldHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: isBig ? '500' : '700',
  },
});
