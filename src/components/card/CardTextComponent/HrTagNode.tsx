import React from 'react';
import { StyleSheet } from 'react-native';
import { Node, OutputFunction, RenderState, MarkdownText } from 'react-native-markdown-view';
import { m } from '@styles/space';

export default function HrTagNode(
  node: Node,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <MarkdownText key={state.key} style={styles.hrTag}>
      { '\n━━━━━━━━━━━━━━━━━━\n\n' }
    </MarkdownText>
  );
}

const styles = StyleSheet.create({
  hrTag: {
    marginTop: m,
    marginBottom: m,
  },
});
