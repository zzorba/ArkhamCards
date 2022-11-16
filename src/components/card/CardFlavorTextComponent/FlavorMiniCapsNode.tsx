import React from 'react';
import { Platform } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorMiniCapsNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key}
      style={{
        fontFamily: Platform.OS === 'ios' ? 'Alegreya SC' : 'AlegreyaSC-Medium',
        fontWeight: Platform.OS === 'ios' ? '700' : '500',
        fontStyle: 'normal',
        fontVariant: ['small-caps'],
      }}>
      { node.text }
    </MarkdownText>
  );
}
