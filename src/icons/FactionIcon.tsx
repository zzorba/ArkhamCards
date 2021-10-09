import { FactionCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';

import ArkhamIcon from './ArkhamIcon';

interface Props {
  faction: FactionCodeType | 'dual';
  size: number;
  defaultColor?: string;
  colorChoice?: 'text' | 'background'
}
export default function FactionIcon({ faction, size, defaultColor, colorChoice = 'background' }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <ArkhamIcon
      name={faction === 'dual' ? 'elder_sign' : faction}
      size={size}
      color={defaultColor || colors.faction[faction][colorChoice]}
    />
  );
}