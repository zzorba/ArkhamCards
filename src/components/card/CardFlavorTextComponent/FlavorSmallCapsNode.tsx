import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorSmallCapsNode({ gameFont }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[styles.text, { fontFamily: gameFont }]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontStyle: 'normal',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
