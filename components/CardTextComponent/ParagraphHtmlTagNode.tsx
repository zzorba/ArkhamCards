import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function ParagraphHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key}>
      { output(node.children, state) }
      { '\n' }
    </Text>
  );
}
