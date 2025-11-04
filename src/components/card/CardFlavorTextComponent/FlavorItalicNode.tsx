import React from 'react';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorItalicNode() {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    // MarkdownText uses the font config system, so use fontWeight instead of variant files
    return (
      <MarkdownText
        key={state.key}
        style={{ fontFamily: 'Alegreya', fontWeight: '400', fontStyle: 'normal' }}
      >
        { output(node.children, state) }
      </MarkdownText>
    );
  };
}
