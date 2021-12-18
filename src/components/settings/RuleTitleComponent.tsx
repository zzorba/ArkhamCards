import React from 'react';
import { Text } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';

interface Props {
  title: string;
}

export default function RuleTitleComponent({ title }: Props) {
  return (
    <Text numberOfLines={1} style={{ flex: 1, textAlignVertical: 'bottom/', textAlign: 'center' }}>
      <CardTextComponent text={title} sizeScale={1.3} />
    </Text>
  );
}
