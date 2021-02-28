import React, { useEffect } from 'react';
import {
  View,
} from 'react-native';

import CardSearchResult from '../../cardlist/CardSearchResult';
import Card from '@data/types/Card';
import { useFlag } from '@components/core/hooks';

interface Props {
  card: Card;
  count: number;
  onChange: (card: Card, count: number) => void;
  onPress?: (card: Card) => void;
  limit: number;
}

export default function CardToggleRow({ card, count, onChange, onPress, limit }: Props) {
  const [one, toggleOne] = useFlag(count > 0);
  const [two, toggleTwo] = useFlag(count > 1);
  const [three, toggleThree] = useFlag(count > 2);

  useEffect(() => {
    onChange(card, (one ? 1 : 0) + (two ? 1 : 0) + (three ? 1 : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three]);

  if (limit === 0) {
    return null;
  }
  return (
    <View>
      <CardSearchResult
        card={card}
        onPress={onPress}
        backgroundColor="transparent"
        control={{
          type: 'toggle',
          value: one,
          toggleValue: toggleOne,
        }}
      />
      { (limit > 1) && (
        <CardSearchResult
          card={card}
          onPress={onPress}
          backgroundColor="transparent"
          control={{
            type: 'toggle',
            value: two,
            toggleValue: toggleTwo,
          }}
        />
      ) }
      { (limit > 2) && (
        <CardSearchResult
          card={card}
          onPress={onPress}
          backgroundColor="transparent"
          control={{
            type: 'toggle',
            value: three,
            toggleValue: toggleThree,
          }}
        />
      ) }
    </View>
  );
}
