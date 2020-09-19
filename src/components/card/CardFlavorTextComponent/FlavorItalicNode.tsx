import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';

export default function FlavorItalicNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text
        key={state.key}
        style={typography.regular}
      >
        { output(node.children, state) }
      </Text>
    );
  };
}
