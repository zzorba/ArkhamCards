import React, { useContext, useCallback } from 'react';
import { View, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { TouchableShrink } from '@components/core/Touchables';
import Card from '@data/types/Card';
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
        { Card.factionCodeToName(tag, tag) }
      </Text>
      { !!showIcon && <AppIcon name={selected ? 'dismiss' : 'plus-thin'} size={18} color={selected ? colors.L30 : colors.D30} /> }
    </View>
  );
}

export default function TagChiclet({ tag }: ChicletProps) {
  return (
    <View style={space.marginXs}>
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