import React, { useContext, useCallback } from 'react';
import { View, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { TouchableShrink } from '@components/core/Touchables';
import Card from '@data/types/Card';
import AppIcon from '@icons/AppIcon';

interface Props {
  tag: string;
  onSelectTag: (tag: string) => void;
  selected: boolean;
  showIcon?: boolean;
  disabled?: boolean;
}

export default function TagChiclet({ tag, onSelectTag, selected, showIcon, disabled }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelectTag(tag);
  }, [onSelectTag, tag]);
  return (
    <View style={[space.marginTopXs, space.marginSideXs]}>
      <TouchableShrink onPress={onPress} disabled={disabled}>
        <View style={[{ flexDirection: 'row', backgroundColor: selected ? colors.D10 : colors.L10, borderRadius: 16, minHeight: 32, alignItems: 'center' }, showIcon ? space.paddingRightS : space.paddingRightM, space.paddingLeftM]}>
          <Text style={[typography.text, selected ? { color: colors.L30 } : undefined]}>
            { Card.factionCodeToName(tag, tag) }
          </Text>
          { !!showIcon && <AppIcon name={selected ? 'dismiss' : 'plus-thin'} size={18} color={selected ? colors.L30 : colors.D30} /> }
        </View>
      </TouchableShrink>
    </View>
  );
}