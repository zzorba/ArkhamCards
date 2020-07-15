import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';
import { m } from '@styles/space';

export default function HrTagNode(
  node: Node,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <Text key={state.key} style={styles.hrTag}>
      { '\n━━━━━━━━━━━━━━━━━━\n\n' }
    </Text>
  );
}

const styles = StyleSheet.create({
  hrTag: {
    marginTop: m,
    marginBottom: m,
  },
});
