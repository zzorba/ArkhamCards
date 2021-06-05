import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function SmallCapsNode({}: StyleContextType) {
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
    fontFamily: 'Alegreya',
    fontWeight: '700',
    fontStyle: 'normal',
    textTransform: 'uppercase',
  },
});
