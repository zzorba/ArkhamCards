import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorBoldNode(usePingFang: boolean) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{
        fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        { node.text }
      </MarkdownText>
    );
  };
}
