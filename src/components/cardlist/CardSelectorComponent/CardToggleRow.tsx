import React, { useEffect } from 'react';
import {
  View,
} from 'react-native';

import CardSearchResult from '../../cardlist/CardSearchResult';
import Card from '@data/Card';
import { useFlag } from '@components/core/hooks';

interface Props {
  card: Card;
  count: number;
  onChange: (card: Card, count: number) => void;
  onPress?: (card: Card) => void;
  limit: number;
  value?: number;
}

interface State {
  one: boolean;
  two: boolean;
  three: boolean;
}

export default function CardToggleRow({ card, count, onChange, onPress, limit, value }: Props) {
  const [one, toggleOne] = useFlag(count > 0);
  const [two, toggleTwo] = useFlag(count > 1);
  const [three, toggleThree] = useFlag(count > 2);

  useEffect(() => {
    onChange(card, (one ? 1 : 0) + (two ? 1 : 0) + (three ? 1 : 0));
  }, [one, two, three]);
  if (limit === 0) {
    return null;
  }
  return (
    <View>
      <CardSearchResult
        card={card}
        count={value}
        onToggleChange={toggleOne}
        onPress={onPress}
        toggleValue={one}
        backgroundColor="transparent"
      />
      { (limit > 1) && (
        <CardSearchResult
          card={card}
          count={value}
          onToggleChange={toggleTwo}
          onPress={onPress}
          toggleValue={two}
          backgroundColor="transparent"
        />
      ) }
      { (limit > 2) && (
        <CardSearchResult
          card={card}
          count={value}
          onToggleChange={toggleThree}
          onPress={onPress}
          toggleValue={three}
          backgroundColor="transparent"
        />
      ) }
    </View>
  );
}
