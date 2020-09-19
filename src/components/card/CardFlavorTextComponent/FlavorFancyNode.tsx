import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { isBig } from '@styles/space';
import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function FlavorFancyNode({ typography }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[styles.text, typography.dark]}>
        { output(node.children, state) }
      </Text>
    );
  };
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'AnkeCalligraphicFG',
  },
});
