import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from 'styles/space';
import { WithText } from './types';

export default function BoldItalicHtmlTagNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontStyle: 'italic',
    fontWeight: isBig ? '500' : '700',
  },
});
