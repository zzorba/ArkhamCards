import React from 'react';
import { StyleSheet } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorMiniCapsNode() {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={styles.text}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontStyle: 'normal',
    fontVariant: ['small-caps'],
  },
});
