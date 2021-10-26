import React, { useContext, useMemo, useRef } from 'react';
import { Text as SVGText } from 'react-native-svg';

import ArkhamIcon from '@icons/ArkhamIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  x: number;
  y: number;
  text: string;
}

const SIZE = 32;

export default function ChartIconComponent({ x, y, text }: Props) {
  const { colors } = useContext(StyleContext);
  const iconGlyphs = useRef(ArkhamIcon.getRawGlyphMap());

  const color = useMemo(() => {
    switch (text) {
      case 'mystic':
      case 'rogue':
      case 'guardian':
      case 'seeker':
      case 'survivor':
      case 'neutral':
      case 'dual':
      case 'mythos':
        return colors.faction[text].text;
      case 'willpower':
      case 'agility':
      case 'combat':
      case 'intellect':
      case 'wild':
        return colors.skill[text].icon;
      default:
        return colors.M;
    }
  }, [text, colors]);

  return (
    <SVGText
      x={x - SIZE / 2} y={y + SIZE / 2 + 3}
      fontSize={SIZE}
      fontFamily="arkhamicons"
      fill={color}
    >
      { String.fromCharCode(iconGlyphs.current[text]) }
    </SVGText>
  );
}
