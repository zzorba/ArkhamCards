import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
}

export default function GameHeader({ text }: Props) {
  const { gameFont, typography } = useContext(StyleContext);
  return (
    <View style={space.marginTopXs}>
      <Text style={[typography.bigGameFont, { fontFamily: gameFont }]}>
        { text }
      </Text>
    </View>
  );
}
