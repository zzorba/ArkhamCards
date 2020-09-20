import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function SmallCapsNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[typography.bold, styles.text]}>
        { output(node.children, state) }
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
});
