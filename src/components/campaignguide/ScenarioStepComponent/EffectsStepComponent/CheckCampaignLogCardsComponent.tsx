import React, { useMemo } from 'react';
import { map, flatMap, zip } from 'lodash';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import useCardList from '@components/card/useCardList';
import { CheckCampaignLogCardsEffect } from '@data/scenario/types'
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

interface Props {
  effect: CheckCampaignLogCardsEffect;
  input?: string[]
  numberInput?: number[];
}

export default function CheckCampaignLogCardsComponent({ effect, input, numberInput }: Props) {
  const codes = useMemo(() => input || [], [input]);
  const [cards] = useCardList(codes, effect.card_type);
  const cardWithCounts = useMemo(() => {
    if (numberInput && numberInput.length === cards.length) {
      return flatMap(zip(cards, numberInput), ([card, count]) => {
        if (!card) {
          return [];
        }
        return {
          card,
          count: count || 1,
        };
      });
    }
    return map(cards, card => {
      return {
        card,
        count: 1,
      };
    });
  }, [cards, numberInput]);
  return (
    <>
      { map(cardWithCounts, ({ card, count }) => {
        const text = (card.grammarGenderMasculine() ? effect.masculine_text : effect.feminine_text) || effect.text || '';
        return (
          <SetupStepWrapper key={card.code} bulletType={effect.bullet_type}>
            <CampaignGuideTextComponent text={text.replace('#name#', card.name).replace('#X#', `${count}`)} />
          </SetupStepWrapper>
        );
      }) }
    </>
  );
}