import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { isBig } from '../../styles/space';

export default function BoldItalicHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.boldText}>
      { node.text }
    </Text>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontStyle: 'italic',
    fontWeight: isBig ? '500' : '700',
  },
});
