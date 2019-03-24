import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from '../CardTextComponent/types';

export default function FlavorUnderlineNode(
  node: Node & WithText,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.text}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '400',
    fontStyle: 'normal',
  },
});
