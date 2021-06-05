import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import { Text } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function CiteTagNode({ typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={[typography.tiny, typography.regular, { fontFamily: 'Alegreya' }]}>
        { node.text }
      </MarkdownText>
    );
  };
}
