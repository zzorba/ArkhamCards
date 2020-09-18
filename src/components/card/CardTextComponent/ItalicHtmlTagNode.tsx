import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from './types';
import { StyleContextType } from '@styles/StyleContext';

export default function ItalicHtmlTagNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text
        key={state.key}
        style={[styles.italicText, typography.black]}
      >
        { output(node.children, state) }
      </Text>
    );
  }
}
const styles = StyleSheet.create({
  italicText: {
    fontFamily: 'Alegreya-Italic',
  },
});
