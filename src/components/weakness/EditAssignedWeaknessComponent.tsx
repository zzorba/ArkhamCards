import React, { useCallback, useContext, useMemo } from 'react';
import { flatMap } from 'lodash';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { showCard } from '@components/nav/helper';
import { Slots, WeaknessSet } from '@actions/types';
import Card from '@data/types/Card';
import CardSearchResult from '../cardlist/CardSearchResult';
import { useSlotActions, useWeaknessCards } from '@components/core/hooks';
import { useNavigation } from '@react-navigation/native';
import StyleContext from '@styles/StyleContext';

interface Props {
  weaknessSet: WeaknessSet;
  updateAssignedCards: (assignedCards: Slots) => void;
}

function cardKey(card: Card) {
  return card.code;
}

function EditAssignedWeaknessComponent({ weaknessSet, updateAssignedCards }: Props) {
  const weaknessCards = useWeaknessCards();
  const [assignedCards, editAssignedCards] = useSlotActions(weaknessSet.assignedCards, updateAssignedCards);
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const cardPressed = useCallback((card: Card) => {
    showCard(navigation, card.code, card, colors, { showSpoilers: false });
  }, [navigation, colors]);

  const data: Card[] = useMemo(() => {
    const packCodes = new Set(weaknessSet.packCodes);
    return flatMap(weaknessCards, card => card && packCodes.has(card.pack_code) ? card : []);
  }, [weaknessCards, weaknessSet.packCodes]);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Card>) => {
    const count = assignedCards[item.code] || 0;
    const limit = (item.quantity || 0);
    return (
      <CardSearchResult
        key={item.code}
        card={item}
        onPress={cardPressed}
        control={{
          type: 'quantity',
          count,
          limit,
          min: 0,
          countChanged: editAssignedCards,
          showZeroCount: true,
          reversed: true,
        }}
      />
    );
  }, [editAssignedCards, cardPressed, assignedCards]);
  return (
    <FlatList
      data={data}
      keyExtractor={cardKey}
      renderItem={renderItem}
    />
  );
}

export default EditAssignedWeaknessComponent;
