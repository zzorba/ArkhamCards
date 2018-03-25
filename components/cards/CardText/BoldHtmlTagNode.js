import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function BoldHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: '700',
  },
});
