import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function ItalicHtmlTagNode(node, output, state) {
  console.log(JSON.stringify(state));
  return (
    <Text
      key={state.key}
      style={state.blockquote ? styles.italicText : styles.boldItalicText}
    >
      { node.text }
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
