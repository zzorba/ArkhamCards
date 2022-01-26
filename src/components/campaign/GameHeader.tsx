import React, { useContext } from 'react';
import { Text, TextStyle } from 'react-native';

import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
  style?: TextStyle;
  truncate?: boolean;
}

export default function GameHeader({ text, style, truncate }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <Text style={[typography.bigGameFont, style]} numberOfLines={truncate ? 1 : 2} ellipsizeMode="tail">
      { text }
    </Text>
  );
}
