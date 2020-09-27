import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function InnsmouthNode({ typography, fontScale }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[styles.text, { fontSize: 28 * fontScale, lineHeight: 28 * fontScale }, typography.dark]}>
        { output(node.children, state) }
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'AboutDead',
  },
});
