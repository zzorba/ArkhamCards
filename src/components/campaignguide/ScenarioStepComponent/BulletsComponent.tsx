import React from 'react';
import {
  View,
} from 'react-native';
import { map } from 'lodash';

import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  bullets: { text: string }[] | undefined;
}

export default function BulletsComponent({ bullets }: Props) {
  if (!bullets) {
    return null;
  }
  return (
    <View>
      { map(bullets, (bullet, idx) => (
        <CardTextComponent key={idx} text={`- ${bullet.text}`} />
      )) }
    </View>
  );
}
