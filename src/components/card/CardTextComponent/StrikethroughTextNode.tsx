import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { MarkdownText, Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from './types';
import { StyleContextType } from '@styles/StyleContext';

export default function StrikethroughTextNode({ colors }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText
        key={state.key}
        style={[styles.strikeText, { textDecorationColor: colors.darkText }]}
      >
        { node.text }
      </MarkdownText>
    );
  };
}

const styles = StyleSheet.create({
  strikeText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
