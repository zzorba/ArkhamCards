import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import space from '@styles/space';

export default function FlavorBlockquoteHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key} style={space.paddingLeftS}>
      { '\n\n' }
      { output(node.children, { ...state, blockquote: true }) }
      { '\n\n' }
    </MarkdownText>
  );
}
