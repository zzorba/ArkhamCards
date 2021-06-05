import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren, State } from './types';

export default function EmphasisHtmlTagNode({}: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState & State,
  ) => {
    return (
      <MarkdownText
        key={state.key}
        style={{
          fontFamily: 'Alegreya',
          fontStyle: 'italic',
          fontWeight: state.blockquote ? '400' : '700',
        }}
      >
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
