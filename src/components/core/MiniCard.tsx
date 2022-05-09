import React, { useContext } from 'react';
import { View } from 'react-native';

import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import AssetCard from '../../../assets/mini-asset.svg';
import EventCard from '../../../assets/mini-event.svg';
import SkillCard from '../../../assets/mini-skill.svg';
import { CARD_RATIO } from '@styles/sizes';

interface Props {
  type: 'asset' | 'event' | 'skill';
  faction: FactionCodeType;
  size: number;
}
export default function MiniCard({ type, faction, size }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  const width = size * CARD_RATIO;
  const height = size;
  const color = colors.faction[faction].background;
  switch (type) {
    case 'skill':
      return <View style={shadow.small}><SkillCard width={width} height={height} faction={color} /></View>;
    case 'event':
      return <View style={shadow.small}><EventCard width={width} height={height} faction={color} /></View>;
    case 'asset':
      return <View style={shadow.small}><AssetCard width={width} height={height} faction={color} /></View>;
  }
}