import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren, State } from './types';

export default function EmphasisHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState & State,
) {
  return (
    <Text
      key={state.key}
      style={state.blockquote ? styles.italicText : styles.boldItalicText}
    >
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldItalicText: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  italicText: {
    fontStyle: 'italic',
    fontWeight: '200',
  },
});
