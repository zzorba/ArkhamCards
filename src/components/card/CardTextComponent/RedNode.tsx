import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function RedNode({ colors }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <MarkdownText key={state.key} style={{ fontFamily: 'Alegreya', color: colors.campaign.text.resolution }}>
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}

