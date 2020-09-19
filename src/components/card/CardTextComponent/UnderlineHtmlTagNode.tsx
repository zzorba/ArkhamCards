import { StyleContextType } from '@styles/StyleContext';
import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from './types';

export default function UnderlineHtmlTagNode({ typography }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[typography.bold, typography.underline]}>
        { node.text }
      </Text>
    );
  }
}
