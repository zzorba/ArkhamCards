import React, { useCallback, useContext, useMemo } from 'react';
import { filter } from 'lodash';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { showCard } from '@components/nav/helper';
import { t } from 'ttag';
import { Slots, WeaknessSet } from '@actions/types';
import Card from '@data/types/Card';
import CardSearchResult from '../cardlist/CardSearchResult';
import StyleContext from '@styles/StyleContext';
import { useSlotActions, useWeaknessCards } from '@components/core/hooks';

interface Props {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateAssignedCards: (assignedCards: Slots) => void;
}

function cardKey(card: Card) {
  return card.code;
}

function EditAssignedWeaknessComponent({ componentId, weaknessSet, updateAssignedCards }: Props) {
  const { colors } = useContext(StyleContext);
  const weaknessCards = useWeaknessCards();
  const [assignedCards, editAssignedCards] = useSlotActions(weaknessSet.assignedCards, updateAssignedCards);
  const cardPressed = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const data: Card[] = useMemo(() => {
    const packCodes = new Set(weaknessSet.packCodes);
    return filter(weaknessCards || [], card => packCodes.has(card.pack_code));
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
EditAssignedWeaknessComponent.options = () => {
  return {
    topBar: {
      title: {
        text: t`Assigned weaknesses`,
      },
    },
  };
};

export default EditAssignedWeaknessComponent;
