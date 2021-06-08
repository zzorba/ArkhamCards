import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren, State } from './types';
export default function BoldHtmlTagNode({ fontScale }: StyleContextType, sizeScale: number) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState & State
  ) => {
    return (
      <MarkdownText
        key={state.key}
        allowFontScaling
        style={{
          fontFamily: 'Alegreya',
          fontWeight: '700',
          fontStyle: state.italic ? 'italic' : 'normal',
          fontSize: 16 * fontScale * sizeScale,
          lineHeight: 20 * fontScale * sizeScale,
        }}
      >
        { output(node.children, { ...state, bold: true }) }
      </MarkdownText>
    );
  };
}
