import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function CiteTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.text}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    fontWeight: '400',
    fontStyle: 'normal',
  },
});
