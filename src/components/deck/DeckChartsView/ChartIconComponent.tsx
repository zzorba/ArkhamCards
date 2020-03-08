import React from 'react';
import { Text as SVGText } from 'react-native-svg';

import ArkhamIcon from 'icons/ArkhamIcon';
import { FACTION_COLORS, SKILL_COLORS } from 'constants';

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

  render() {
    const { x, y, text } = this.props;
    return (
      <SVGText
        x={x - SIZE / 2} y={y + SIZE / 2 + 3}
        fontSize={SIZE}
        fontFamily="arkhamicons"
        fill={FACTION_COLORS[text] || SKILL_COLORS[text] || '#444'}
      >
        { String.fromCharCode(this.iconGlyphs[text === 'neutral' ? 'elder_sign' : text]) }
      </SVGText>
    );
  }
}
