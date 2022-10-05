import React, { useMemo, useContext } from 'react';
import { map, find, flatMap, zip } from 'lodash';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import useCardList from '@components/card/useCardList';
import { CheckCampaignLogCardsEffect } from '@data/scenario/types'
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  effect: CheckCampaignLogCardsEffect;
  input?: string[]
  numberInput?: number[];
}

export default function CheckCampaignLogCardsComponent({ effect, input, numberInput }: Props) {
  const codes = useMemo(() => input || [], [input]);
  const { campaignGuide } = useContext(CampaignGuideContext);
  const fixedCards: { code: string; gender?: 'm' | 'f' | 'nb'; name: string }[] = useMemo(() => {
    return flatMap(codes, code => {
      const card = campaignGuide.card(code);
      return card ? card : [];
    });
  }, [campaignGuide, codes]);
  const [cards] = useCardList(codes, effect.card_type);
  const cardWithCounts = useMemo(() => {
    if (numberInput && numberInput.length === cards.length) {
      return flatMap(zip(codes, numberInput), ([code, count]) => {
        const fixedCard = find(fixedCards, c => c.code === code);
        const card = find(cards, c => c.code === code);
        if (card) {
          return {
            card: {
              code: card.code,
              name: card.name,
              gender: card.gender,
            },
            count: count || 1,
          };
        }
        if (fixedCard) {
          return {
            card: fixedCard,
            count: count || 1,
          };
        }
        return [];
      });
    }
    return flatMap(codes, code => {
      const fixedCard = find(fixedCards, c => c.code === code);
      const card = find(cards, c => c.code === code);
      if (card) {
        return {
          card: {
            code: card.code,
            name: card.name,
            gender: card.gender,
          },
          count: 1,
        };
      }
      if (fixedCard) {
        return {
          card: fixedCard,
          count: 1,
        };
      }
      return [];
    });
  }, [cards, fixedCards, codes, numberInput]);
  return (
    <>
      { map(cardWithCounts, ({ card, count }) => {
        let text: string = effect.text || '';
        if (card.gender) {
          switch (card.gender) {
            case Gender_Enum.M:
              text = effect.masculine_text || text;
              break;
            case Gender_Enum.F:
              text = effect.feminine_text || text;
              break;
            case Gender_Enum.Nb:
              text = effect.nonbinary_text || text;
              break;
          }
        }
        return (
          <SetupStepWrapper key={card.code} bulletType={effect.bullet_type}>
            <CampaignGuideTextComponent text={text.replace('#name#', card.name).replace('#X#', `${count}`)} />
          </SetupStepWrapper>
        );
      }) }
    </>
  );
}