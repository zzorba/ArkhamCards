import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from 'styles/space';
import { WithText } from '../CardTextComponent/types';

export default function FlavorCenterNode(
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
    fontSize: isBig ? 28 : 18,
    fontFamily: 'AnkeCalligraphicFG',
    textAlign: 'center',
    color: '#222',
  },
});
