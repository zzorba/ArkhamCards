import React, { useContext } from 'react';
import { Text } from 'react-native';

import StyleContext from '@styles/StyleContext';
import IconizedText from '@components/core/IconizedText';

interface Props {
  title: string;
}

export default function RuleTitleComponent({ title }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <Text numberOfLines={1} adjustsFontSizeToFit ellipsizeMode="tail" style={{
      color: colors.darkText,
      fontFamily: 'Alegreya-Medium',
      fontSize: 20,
    }}>
      <IconizedText text={title} iconSize={22} />
    </Text>
  );
}
