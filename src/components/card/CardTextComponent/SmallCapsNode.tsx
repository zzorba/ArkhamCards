import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function SmallCapsNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.text}>
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
