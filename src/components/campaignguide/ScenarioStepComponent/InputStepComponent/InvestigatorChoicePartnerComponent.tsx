import React, { useContext, useMemo } from 'react';
import { flatMap, filter, keys, find } from 'lodash';

import { InvestigatorPartnerChoiceInput } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import { UniversalChoices } from '@data/scenario';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { partnerStatusConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  id: string;
  input: InvestigatorPartnerChoiceInput;
}
export default function InvestigatorChoicePartnerComponent({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const [partners, codes] = useMemo(() => {
    const conditionPartners = partnerStatusConditionResult(input.condition, campaignLog);
    const selection = keys(conditionPartners.investigatorChoices);
    const selectionSet = new Set(selection);
    const selectedPartners = filter(campaignLog.campaignGuide.campaignLogPartners(input.condition.section), p => selectionSet.has(p.code));
    return [selectedPartners, selection];
  }, [input, campaignLog]);
  const [cards, loading] = useCardList(codes, 'encounter');
  const options: UniversalChoices = useMemo(() => {
    return {
      type: 'universal',
      choices: flatMap(partners, partner => {
        const trauma = campaignLog.traumaAndCardData(partner.code);
        return {
          id: partner.code,
          text: partner.name,
          description: partner.description,
          trauma: trauma,
          card: find(cards, c => c.code === partner.code),
        };
      }),
    };
  }, [partners, cards, campaignLog]);
  return (
    <InvestigatorChoicePrompt
      id={id}
      promptType="header"
      text={input.prompt}
      unique
      optional
      options={options}
      loading={loading}
    />
  );
}