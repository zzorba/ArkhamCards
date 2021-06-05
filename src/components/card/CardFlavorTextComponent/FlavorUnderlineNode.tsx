import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorUnderlineNode({ typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{ fonFamily: 'Alegreya', fontStyle: 'normal' }}>
        { node.text }
      </MarkdownText>
    );
  };
}

