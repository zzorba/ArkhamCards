import React from 'react';
import {
  Text,
} from 'react-native';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import { WithChildren } from '../CardTextComponent/types';
import { StyleContextType } from '@styles/StyleContext';

export default function GameTextNode({ typography, fontScale, gameFont }: StyleContextType) {
  return (
    node: Node & WithChildren,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <Text key={state.key} style={[{ fontFamily: gameFont, fontSize: 24 * fontScale, lineHeight: 24 * fontScale }, typography.dark]}>
        { output(node.children, state) }
      </Text>
    );
  };
}
