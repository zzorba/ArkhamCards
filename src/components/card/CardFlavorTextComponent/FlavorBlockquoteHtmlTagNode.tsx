import React from 'react';
import { View } from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import space from '@styles/space';

export default function FlavorBlockquoteHtmlTagNode(
  node: Node & WithChildren,
  output: OutputFunction,
  state: RenderState
) {
  return (
    <View style={space.paddingLeftM}>
      { output(node.children, state) }
    </View>
  );
}
