import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function InnsmouthNode(sizeScale: number, { typography, fontScale }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[{
        fontFamily: 'AboutDead',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 24 * fontScale * sizeScale,
        lineHeight: 28 * fontScale * sizeScale,
      }, typography.dark]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

