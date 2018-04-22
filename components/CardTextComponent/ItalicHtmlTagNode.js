import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function ItalicHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.italicText}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  italicText: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
});
