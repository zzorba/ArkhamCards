import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function BlockquoteHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.blockquote}>
      { '\n\n' }
      { output(node.children, Object.assign({}, state, { blockquote: true })) }
      { '\n\n' }
    </Text>
  );
}

const styles = StyleSheet.create({
  blockquote: {
  },
});
