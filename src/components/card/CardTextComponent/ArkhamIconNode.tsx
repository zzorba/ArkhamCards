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
  'tarot_inverted',
  'tarot',
  'accessory_inverted',
  'accessory',
  'ally_inverted',
  'ally',
  'arcane_inverted',
  'arcane_x2_inverted','arcane_x2','arcane','body_inverted','body','hand_inverted','hand_x2_inverted','hand_x2','hand','health','sanity','sanity_inverted','health_inverted','star-fill','star-outline','star','x-fill','x-outline','x','num0-fill','num0-outline','num0','num1-fill','num1-outline','num1','num2-fill','num2-outline','num2','num3-fill','num3-outline','num3','num4-fill','num4-outline','num4','num5-fill','num5-outline','num5','num6-fill','num6-outline','num6','num7-fill','num7-outline','num7','num8-fill','num8-outline','num8','num9-fill','num9-outline','num9','numNull-fill','numNull-outline','numNull','guardian','seeker','mystic','rogue','survivor','willpower','intellect','combat','agility','wild','elder_sign','neutral','skull','cultist','tablet','elder_thing','auto_fail','per_investigator','weakness','action','reaction','free','bullet','guide_bullet','curse','bless','parallel','skill_willpower','skill_willpower_inverted','skill_intellect','skill_intellect_inverted','skill_combat','skill_combat_inverted','skill_agility','skill_agility_inverted','skill_wild','skill_wild_inverted'
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