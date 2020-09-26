import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren, State } from './types';

export default function EmphasisHtmlTagNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState & State,
  ) => {
    return (
      <Text
        key={state.key}
        style={state.blockquote ? typography.italic : typography.boldItalic}
      >
        { output(node.children, state) }
      </Text>
    );
  };
}
