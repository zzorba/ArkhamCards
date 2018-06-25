import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

export default function HrTagNode(node, output, state) {
  return (
    <Text key={state.key} style={styles.hrTag}>
      { '\n━━━━━━━━━━━━━━━━━━\n\n' }
    </Text>
  );
}

const styles = StyleSheet.create({
  hrTag: {
    marginTop: 16,
    marginBottom: 16,
  },
});
