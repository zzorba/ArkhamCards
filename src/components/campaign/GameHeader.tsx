import React, { useContext } from 'react';
import { Text } from 'react-native';

import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
}

export default function GameHeader({ text }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <Text style={typography.bigGameFont}>
      { text }
    </Text>
  );
}
