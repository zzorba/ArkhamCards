import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from '@styles/space';
import { WithChildren } from '../CardTextComponent/types';
import COLORS from '@styles/colors';

export default function FlavorFancyNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.text}>
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: isBig ? 28 : 18,
    fontFamily: 'AnkeCalligraphicFG',
    color: COLORS.darkText,
  },
});
