import React, { useContext, useCallback } from 'react';
import { View, Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { TouchableShrink } from '@components/core/Touchables';
import Card from '@data/types/Card';

interface Props {
  tag: string;
  onSelectTag: (tag: string) => void;
  selected: boolean;
}

export default function TagChiclet({ tag, onSelectTag, selected }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onSelectTag(tag);
  }, [onSelectTag, tag]);
  return (
    <View style={[space.marginTopXs, space.marginSideXs]}>
      <TouchableShrink onPress={onPress}>
        <View style={[{ backgroundColor: selected ? colors.D10 : colors.L10, borderRadius: 16, minHeight: 32, flexDirection: 'column', justifyContent: 'center' }, space.paddingSideM]}>
          <Text style={[typography.text, selected ? { color: colors.L30 } : undefined]}>
            { Card.factionCodeToName(tag, tag) }
          </Text>
        </View>
      </TouchableShrink>
    </View>
  );
}