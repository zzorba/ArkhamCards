import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default function BlockquoteHtmlTagNode(node, output, state) {
  return (
    <View key={state.key} style={styles.blockquote}>
      { output(node.children, Object.assign({}, state, { blockquote: true })) }
    </View>
  );
}

const styles = StyleSheet.create({
  blockquote: {
    paddingTop: 8,
    paddingLeft: 8,
    paddingBottom: 8,
  },
});
