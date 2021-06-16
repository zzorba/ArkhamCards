import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function GameTextNode({ typography, fontScale, gameFont }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[{
        fontFamily: gameFont,
        fontStyle: 'normal',
        fontSize: 24 * fontScale,
        lineHeight: 28 * fontScale,
      }, typography.dark]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
