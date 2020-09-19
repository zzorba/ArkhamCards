import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorUnderlineNode({ typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[typography.regular]}>
        { node.text }
      </Text>
    );
  };
}

