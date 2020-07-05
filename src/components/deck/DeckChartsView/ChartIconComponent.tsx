import React from 'react';
import { Text as SVGText } from 'react-native-svg';

import ArkhamIcon from 'icons/ArkhamIcon';
import COLORS from 'styles/colors';

interface Props {
  x: number;
  y: number;
  text: string;
}

const SIZE = 32;

export default class ChartIconComponent extends React.Component<Props> {
  iconGlyphs: { [name: string]: number };

  constructor(props: Props) {
    super(props);
    this.iconGlyphs = ArkhamIcon.getRawGlyphMap();
  }

  color() {
    const { text } = this.props;
    switch (text) {
      case 'mystic':
      case 'rogue':
      case 'guardian':
      case 'seeker':
      case 'survivor':
      case 'neutral':
      case 'dual':
      case 'mythos':
        return COLORS.faction[text].background;
      case 'willpower':
      case 'agility':
      case 'combat':
      case 'intellect':
      case 'wild':
        return COLORS.skill[text].default;
      default:
        return '#444';
    }
  }

  render() {
    const { x, y, text } = this.props;
    return (
      <SVGText
        x={x - SIZE / 2} y={y + SIZE / 2 + 3}
        fontSize={SIZE}
        fontFamily="arkhamicons"
        fill={this.color()}
      >
        { String.fromCharCode(this.iconGlyphs[text === 'neutral' ? 'elder_sign' : text]) }
      </SVGText>
    );
  }
}
