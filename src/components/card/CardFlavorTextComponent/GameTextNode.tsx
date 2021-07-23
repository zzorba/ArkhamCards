import React from 'react';
import { Platform } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function GameTextNode({ typography, fontScale, gameFont }: StyleContextType, sizeScale: number) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[{
        fontFamily: gameFont,
        fontStyle: 'normal',
        fontSize: 24 * fontScale * sizeScale,
        lineHeight: (Platform.OS === 'ios' ? 28 : 32) * fontScale * sizeScale,
      }, typography.dark]}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
