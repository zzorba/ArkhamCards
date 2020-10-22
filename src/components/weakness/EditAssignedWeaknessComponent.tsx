import React, { useCallback, useContext } from 'react';
import { flatMap } from 'lodash';
import {
  ScrollView,
} from 'react-native';

import { showCard } from '@components/nav/helper';
import { t } from 'ttag';
import { Slots, WeaknessSet } from '@actions/types';
import Card from '@data/Card';
import CardSearchResult from '../cardlist/CardSearchResult';
import StyleContext from '@styles/StyleContext';
import { usePlayerCards, useWeaknessCards } from '@components/core/hooks';

interface Props {
  componentId: string;
  weaknessSet: WeaknessSet;
  updateAssignedCards: (assignedCards: Slots) => void;
}

function EditAssignedWeaknessComponent({ componentId, weaknessSet, updateAssignedCards }: Props) {
  const { colors } = useContext(StyleContext);
  const cards = usePlayerCards();
  const weaknessCards = useWeaknessCards();
  const onCountChange = useCallback((code: string, count: number) => {
    const card = cards && cards[code];
    const newAssignedCards = {
      ...weaknessSet.assignedCards,
      [code]: (card && card.quantity || 1) - count,
    };
    updateAssignedCards(newAssignedCards);
  }, [weaknessSet.assignedCards, updateAssignedCards, cards]);

  const cardPressed = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const packCodes = new Set(weaknessSet.packCodes);
  return (
    <ScrollView>
      { flatMap(weaknessCards, card => {
        if (!packCodes.has(card.pack_code)) {
          return null;
        }
        return (
          <CardSearchResult
            key={card.code}
            card={card}
            count={(card.quantity || 0) - (weaknessSet.assignedCards[card.code] || 0)}
            onPress={cardPressed}
            limit={(card.quantity || 0)}
            onDeckCountChange={onCountChange}
            showZeroCount
          />
        );
      }) }
    </ScrollView>
  );
}
EditAssignedWeaknessComponent.options = () => {
  return {
    topBar: {
      title: {
        text: t`Available weaknesses`,
      },
    },
  };
};

export default EditAssignedWeaknessComponent;
