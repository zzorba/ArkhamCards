import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { isBig } from '../../styles/space';

export default function ItalicHtmlTagNode(node, output, state) {
  return (
    <Text
      key={state.key}
      style={styles.italicText}
    >
      { output(node.children, state) }
    </Text>
  );
}

const styles = StyleSheet.create({
  italicText: {
    fontStyle: 'italic',
    fontWeight: isBig ? '300' : '200',
  },
});
