import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren, State } from './types';
import { StyleContextType } from '@styles/StyleContext';

export default function ItalicHtmlTagNode({}: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState & State
  ) => {
    return (
      <MarkdownText
        key={state.key}
        style={{
          fontFamily: 'Alegreya',
          fontStyle: 'italic',
          fontWeight: state.bold ? '700' : '400',
        }}
      >
        { output(node.children, { ...state, italic: true }) }
      </MarkdownText>
    );
  };
}
