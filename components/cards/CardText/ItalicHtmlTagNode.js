import React from 'react';
const {
  StyleSheet,
  Text,
} = require('react-native');

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
