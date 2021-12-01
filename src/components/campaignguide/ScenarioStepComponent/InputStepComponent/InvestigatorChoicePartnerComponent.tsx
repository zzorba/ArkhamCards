import React, { useContext, useMemo } from 'react';
import { flatMap, filter, keys, find } from 'lodash';

import { InvestigatorPartnerChoiceInput, BulletType } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import { UniversalChoices } from '@data/scenario';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { partnerStatusConditionResult } from '@data/scenario/conditionHelper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';

interface Props {
  id: string;
  input: InvestigatorPartnerChoiceInput;
  text?: string;
  bulletType?: BulletType;
}
export default function InvestigatorChoicePartnerComponent({ id, input, text, bulletType }: Props) {
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
          resolute: !!find(trauma.storyAssets || [], code => code === 'resolute'),
          card: find(cards, c => c.code === partner.code),
        };
      }),
    };
  }, [partners, cards, campaignLog]);
  return (
    <>
      { !!text && (
        <SetupStepWrapper bulletType={bulletType}>
          <CampaignGuideTextComponent text={text} />
        </SetupStepWrapper>
      ) }
      <InvestigatorChoicePrompt
        id={id}
        promptType="header"
        text={input.prompt}
        unique
        optional
        options={options}
        loading={loading}
      />
    </>
  );
}