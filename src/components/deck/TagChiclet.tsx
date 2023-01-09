import React, { useContext, useCallback } from 'react';
import { View, Text } from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { TouchableShrink } from '@components/core/Touchables';
import AppIcon from '@icons/AppIcon';

interface ChicletProps {
  tag: string;
}
interface ButtonProps {
  tag: string;
  onSelectTag: (tag: string) => void;
  selected: boolean;
  showIcon?: boolean;
  disabled?: boolean;
}

export const FIXED_TAGS = [
  'guardian',
  'rogue',
  'seeker',
  'survivor',
  'neutral',
  'solo',
  'multiplayer',
  'beginner',
  'theme',
];

function translateTag(tag: string) {
  switch(tag) {
    case 'guardian':
      return t`Guardian`;
    case 'rogue':
      return t`Rogue`;
    case 'mystic':
      return t`Mystic`;
    case 'seeker':
      return t`Seeker`;
    case 'survivor':
      return t`Survivor`;
    case 'neutral':
      return t`Neutral`;
    case 'solo':
      return t`Solo`;
    case 'multiplayer':
      return t`Multiplayer`;
    case 'beginner':
      return t`Beginner`;
    case 'theme':
      return t`Theme`;
    default:
      return undefined;
  }
}

export function localizeTag(tag: string) {
  return translateTag(tag) || tag;
}

export function unlocalizeTag(tag: string, lang: string): string {
  return find(FIXED_TAGS, t => t === tag || translateTag(t)?.toLocaleLowerCase(lang) === tag.toLocaleLowerCase(lang)) || tag;
}

function TagChicletItem({ tag, selected, showIcon, includeShadow }: { tag: string; includeShadow?: boolean; selected?: boolean; showIcon?: boolean }) {
  const { colors, typography, shadow } = useContext(StyleContext);
  return (
    <View style={[
      {
        flexDirection: 'row',
        backgroundColor: selected ? colors.D10 : colors.L20,
        borderRadius: 16,
        minHeight: 32,
        alignItems: 'center',
      },
      includeShadow ? shadow.small : undefined,
      showIcon ? space.paddingRightS : space.paddingRightM, space.paddingLeftM,
    ]}>
      <Text style={[typography.text, selected ? { color: colors.L30 } : undefined]}>
        { localizeTag(tag) }
      </Text>
      { !!showIcon && <AppIcon name={selected ? 'dismiss' : 'plus-thin'} size={18} color={selected ? colors.L30 : colors.D30} /> }
    </View>
  );
}

export default function TagChiclet({ tag }: ChicletProps) {
  return (
    <View style={[space.marginLeftXs, space.marginTopXs]}>
      <TagChicletItem tag={tag} />
    </View>
  );
}

export function TagChicletButton({ tag, onSelectTag, selected, showIcon, disabled }: ButtonProps) {
  const onPress = useCallback(() => {
    onSelectTag(tag);
  }, [onSelectTag, tag]);
  return (
    <View style={space.marginXs}>
      <TouchableShrink onPress={onPress} disabled={disabled}>
        <TagChicletItem tag={tag} includeShadow showIcon={showIcon} selected={selected} />
      </TouchableShrink>
    </View>
  );
}