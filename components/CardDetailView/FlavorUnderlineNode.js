import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function FlavorUnderlineNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.text}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '400',
    fontStyle: 'normal',
  },
});
