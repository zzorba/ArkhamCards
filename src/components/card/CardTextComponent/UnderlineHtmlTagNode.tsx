import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function UnderlineHtmlTagNode(usePingFang: boolean, { typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[{
        fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
        fontStyle: 'normal',
        fontWeight: '700',
      }, typography.underline]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
