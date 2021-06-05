import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorItalicNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText
        key={state.key}
        style={{ fontFamily: 'Alegreya', fontStyle: 'normal' }}
      >
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
