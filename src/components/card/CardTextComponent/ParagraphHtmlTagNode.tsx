import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';

import { WithChildren } from './types';

export default function ParagraphHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key}>
      { output(node.children, state) }
      { '\n' }
    </MarkdownText>
  );
}
