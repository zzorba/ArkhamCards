import React from 'react';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import ArkhamIcon from '@icons/ArkhamIcon';
import { isBig } from '@styles/space';

import { WithIconName } from './types';
import { StyleContextType } from '@styles/StyleContext';

const BAD_ICON_NAMES: { [key: string]: string | undefined} = {
  Action: 'action',
  'per investigator': 'per_investigator',
  lightning: 'free',
  lighting: 'free',
  fast: 'free',
  willlpower: 'willpower',
  'auto-fail': 'auto_fail',
};

export default function ArkhamIconNode({ colors }: StyleContextType) {
  return (
    node: Node & WithIconName,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <ArkhamIcon
        key={state.key}
        name={BAD_ICON_NAMES[node.name] || node.name}
        size={isBig ? 24 : 16}
        color={colors.darkText}
      />
    );
  };
}