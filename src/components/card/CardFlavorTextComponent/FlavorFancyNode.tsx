import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function FlavorFancyNode({ typography, fontScale }: StyleContextType, underline?: boolean) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[
        styles.text, {
          fontSize: 18 * fontScale,
          lineHeight: 24 * fontScale
        },
        underline ? { textDecorationLine: 'underline' } : undefined,
        typography.dark,
      ]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Caveat',
  },
});
