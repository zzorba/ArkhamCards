import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { isBig } from '../../styles/space';

export default function BoldHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: isBig ? '500' : '700',
  },
});
