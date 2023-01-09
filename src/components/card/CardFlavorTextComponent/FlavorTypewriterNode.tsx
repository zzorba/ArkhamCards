import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function FlavorTypewriterNode({ typography, fontScale }: StyleContextType, underline?: boolean) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[
        styles.text, {
          fontSize: 16 * fontScale,
          lineHeight: 20 * fontScale,
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
    fontFamily: Platform.OS === 'ios' ? 'TT2020 Style E' : 'TT2020StyleE-Regular',
  },
});
