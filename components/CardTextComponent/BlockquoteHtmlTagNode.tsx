import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function BlockquoteHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.blockquote}>
      { '\n\n' }
      { output(node.children, Object.assign({}, state, { blockquote: true })) }
      { '\n\n' }
    </Text>
  );
}

const styles = StyleSheet.create({
  blockquote: {
  },
});
