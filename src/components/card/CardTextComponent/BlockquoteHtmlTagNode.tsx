import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function BlockquoteHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key}>
      { '\n\n' }
      { output(node.children, { ...state, blockquote: true }) }
      { '\n\n' }
    </MarkdownText>
  );
}
