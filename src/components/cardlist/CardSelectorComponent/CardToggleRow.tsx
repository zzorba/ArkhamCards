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
  locked?: boolean;
  last?: boolean;
  disabled?: boolean;
}

export default function CardToggleRow({ card, count, onChange, onPress, limit, locked, last, disabled }: Props) {
  const [one, toggleOne] = useFlag(count > 0);
  const [two, toggleTwo] = useFlag(count > 1);
  const [three, toggleThree] = useFlag(count > 2);
  const [four, toggleFour] = useFlag(count > 3);

  useEffect(() => {
    onChange(card, (one ? 1 : 0) + (two ? 1 : 0) + (three ? 1 : 0) + (four ? 1 : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four]);

  if (limit === 0) {
    return null;
  }
  if (locked) {
    if (count <= 0) {
      return null;
    }
    return (
      <CardSearchResult
        card={card}
        onPress={onPress}
        backgroundColor="transparent"
        control={{
          type: 'count',
          count,
        }}
        noBorder={last}
      />
    );
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
          disabled,
        }}
        noBorder={last && limit === 1}
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
            disabled,
          }}
          noBorder={last && limit === 2}
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
            disabled,
          }}
          noBorder={last && limit === 3}
        />
      ) }
      { (limit > 3) && (
        <CardSearchResult
          card={card}
          onPress={onPress}
          backgroundColor="transparent"
          control={{
            type: 'toggle',
            value: four,
            toggleValue: toggleFour,
            disabled,
          }}
          noBorder={last && limit === 4}
        />
      ) }
    </View>
  );
}
