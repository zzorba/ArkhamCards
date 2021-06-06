import React, { useContext } from 'react';
import { Text, TextStyle } from 'react-native';

import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
  style?: TextStyle;
}

export default function GameHeader({ text, style }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <Text style={[typography.bigGameFont, style]}>
      { text }
    </Text>
  );
}
