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
    fontFamily: 'Alegreya-ExtraBoldItalic',
    fontWeight: '700',
  },
  italicText: {
    fontFamily: 'Alegreya-Italic',
  },
});
