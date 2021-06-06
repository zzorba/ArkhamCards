import React, { useCallback, useContext } from 'react';
import { flatMap } from 'lodash';
import { ScrollView } from 'react-native';

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

function EditAssignedWeaknessComponent({ componentId, weaknessSet, updateAssignedCards }: Props) {
  const { colors } = useContext(StyleContext);
  const weaknessCards = useWeaknessCards();
  const [, editAssignedCards] = useSlotActions(weaknessSet.assignedCards, undefined, updateAssignedCards);
  const cardPressed = useCallback((card: Card) => {
    showCard(componentId, card.code, card, colors, true);
  }, [componentId, colors]);

  const packCodes = new Set(weaknessSet.packCodes);
  return (
    <ScrollView>
      { flatMap(weaknessCards, card => {
        if (!packCodes.has(card.pack_code) || !editAssignedCards) {
          return null;
        }
        const count = (card.quantity || 0) - (weaknessSet.assignedCards[card.code] || 0);
        const limit = (card.quantity || 0);
        return (
          <CardSearchResult
            key={card.code}
            card={card}
            onPress={cardPressed}
            control={{
              type: 'quantity',
              count,
              limit,
              countChanged: editAssignedCards,
              showZeroCount: true,
            }}
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
