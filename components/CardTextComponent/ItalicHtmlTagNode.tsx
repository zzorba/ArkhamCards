import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from '../../styles/space';
import { WithChildren } from './types';

export default function ItalicHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text
      key={state.key}
      style={styles.italicText}
    >
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  italicText: {
    fontStyle: 'italic',
    fontWeight: isBig ? '300' : '200',
  },
});
