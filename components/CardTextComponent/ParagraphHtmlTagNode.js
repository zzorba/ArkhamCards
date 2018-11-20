import React from 'react';
import {
  Text,
} from 'react-native';

export default function ParagraphHtmlTagNode(node, output, state) {
  return (
    <Text key={state.key}>
      { output(node.children, state) }
      { '\n' }
    </Text>
  );
}
