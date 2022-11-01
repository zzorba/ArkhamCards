import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorMiniCapsNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key} style={{
      fontFamily: 'Alegreya SC',
      fontWeight: '700',
      fontStyle: 'normal',
      fontVariants: ['small_caps'],
    }}>
      { node.text }
    </MarkdownText>
  );
}
