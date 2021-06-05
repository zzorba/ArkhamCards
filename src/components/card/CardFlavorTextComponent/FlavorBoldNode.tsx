import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
  TextStyle,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorBoldNode({ typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{
        fontFamily: 'Alegreya',
        fontWeight: '700',
        fontStyle: 'italic',
      }}>
        { node.text }
      </MarkdownText>
    );
  };
}
