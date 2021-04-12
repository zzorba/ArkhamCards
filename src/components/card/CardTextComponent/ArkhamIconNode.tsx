import React from 'react';
import { Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import ArkhamIcon from '@icons/ArkhamIcon';

import { WithIconName } from './types';
import { StyleContextType } from '@styles/StyleContext';

const BAD_ICON_NAMES: { [key: string]: string | undefined} = {
  Action: 'action',
  'per investigator': 'per_investigator',
  lightning: 'free',
  lighting: 'free',
  fast: 'free',
  will: 'willpower',
  willlpower: 'willpower',
  'auto-fail': 'auto_fail',
  autofail: 'auto_fail',
};

export default function ArkhamIconNode({ colors, fontScale }: StyleContextType, sizeScale: number) {
  return (
    node: Node & WithIconName,
    output: OutputFunction,
    state: RenderState
  ) => {
    return (
      <ArkhamIcon
        key={state.key}
        name={BAD_ICON_NAMES[node.name] || node.name}
        size={16 * fontScale * sizeScale}
        color={colors.darkText}
      />
    );
  };
}