import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithText } from './types';
import { StyleContextType } from '@styles/StyleContext';

export default function StrikethroughTextNode({ colors }: StyleContextType) {
  return (
    node: Node & WithText,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text
        key={state.key}
        style={[styles.strikeText, { textDecorationColor: colors.darkText }]}
      >
        { node.text }
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  strikeText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
