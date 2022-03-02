import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorStrikeNode() {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{ fontFamily: 'Alegreya', fontStyle: 'normal', textDecorationLine: 'line-through' }}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

