import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorUnderlineNode() {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{ fontFamily: 'Alegreya', fontStyle: 'normal' }}>
        { node.text }
      </MarkdownText>
    );
  };
}

