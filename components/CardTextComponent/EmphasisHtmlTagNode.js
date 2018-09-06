import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function EmphasisHtmlTagNode(node, output, state) {
  return (
    <Text
      key={state.key}
      style={state.blockquote ? styles.italicText : styles.boldItalicText}
    >
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldItalicText: {
    fontStyle: 'italic',
    fontWeight: '700',
  },
  italicText: {
    fontStyle: 'italic',
    fontWeight: '200',
  },
});
