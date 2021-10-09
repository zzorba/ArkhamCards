import React from 'react';
import { MarkdownText, Node, OutputFunction, RenderState } from 'react-native-markdown-view';

import ArkhamIcon from '@icons/ArkhamIcon';

import { WithIconName, State } from './types';
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

const ALL_ICONS = new Set([
  'guardian',
  'seeker',
  'mystic',
  'rogue',
  'survivor',
  'willpower',
  'intellect',
  'combat',
  'agility',
  'wild',
  'elder_sign',
  'neutral',
  'skull',
  'cultist',
  'tablet',
  'elder_thing',
  'auto_fail',
  'per_investigator',
  'weakness',
  'action',
  'reaction',
  'free',
  'bullet',
  'guide_bullet',
  'curse',
  'bless',
]);
export default function ArkhamIconNode(usePingFang: boolean, { colors, fontScale }: StyleContextType, sizeScale: number) {
  return (
    node: Node & WithIconName,
    output: OutputFunction,
    state: RenderState & State,
  ) => {
    const icon_name = BAD_ICON_NAMES[node.name] || node.name;
    if (!ALL_ICONS.has(icon_name)) {
      return (
        <MarkdownText
          key={state.key}
          allowFontScaling
          style={{
            fontFamily: usePingFang ? 'PingFangTC' : 'Alegreya',
            fontWeight: '700',
            fontStyle: state.italic && !usePingFang ? 'italic' : 'normal',
            fontSize: 16 * fontScale * sizeScale,
            lineHeight: 20 * fontScale * sizeScale,
          }}
        >
          { icon_name }
        </MarkdownText>
      );
    }
    return (
      <ArkhamIcon
        key={state.key}
        name={icon_name}
        size={16 * fontScale * sizeScale}
        color={colors.darkText}
      />
    );
  };
}