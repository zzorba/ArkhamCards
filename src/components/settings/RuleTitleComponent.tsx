import React, { useContext, useMemo } from 'react';
import { Platform, Text } from 'react-native';

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
      marginTop: Platform.OS === 'android' ? 12 : 0,
      marginLeft: Platform.OS === 'android' ? 16 : 0,
    }}>
      <IconizedText text={title} iconSize={22} />
    </Text>
  );
}
