import React, { useCallback } from 'react';
import { View } from 'react-native';
import { find } from 'lodash';
import { c } from 'ttag';

import ChooseInvestigatorPrompt from '../../prompts/ChooseInvestigatorPrompt';
import SetupStepWrapper from '../../SetupStepWrapper';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import Card from '@data/types/Card';
import {
  InputStep,
  InvestigatorChoiceWithSuppliesInput,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceWithSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

function getPrompt(investigator: Card, sectionName: string) {
  switch (investigator.gender) {
    case Gender_Enum.F:
      return c('feminine').t`${investigator.name} reads <b>${sectionName}</b>`;
    case Gender_Enum.Nb:
      return c('nonbinary').t`${investigator.name} reads <b>${sectionName}</b>`;
    case Gender_Enum.M:
    default:
      return c('masculine').t`${investigator.name} reads <b>${sectionName}</b>`;
  }
}

export default function InvestigatorChoiceWithSuppliesInputComponent({ step, input, campaignLog }: Props) {
  const investigatorHasSupply = useCallback((code: string) => {
    const investigatorSection = campaignLog.investigatorSections[input.section] || {};
    const section = investigatorSection[code];
    return !!(section &&
      find(section.entries, entry => entry.id === input.id && entry.type === 'count' && entry.count > 0 && !entry.crossedOut)
    );
  }, [input, campaignLog]);

  const investigatorToString = useCallback((card: Card) => {
    if (investigatorHasSupply(card.code)) {
      return input.name;
    }
    return '';
  }, [input, investigatorHasSupply]);

  const renderInvestigatorChoiceResults = useCallback((investigator?: Card) => {
    if (!investigator) {
      return null;
    }
    const decision = investigatorHasSupply(investigator.code);
    const option = decision ? input.positiveChoice : input.negativeChoice;
    const sectionName = option.text;
    const prompt = getPrompt(investigator, sectionName);
    return (
      <SetupStepWrapper bulletType="small">
        <CampaignGuideTextComponent text={prompt} />
      </SetupStepWrapper>
    );
  }, [input, investigatorHasSupply]);

  return (
    <View>
      <SetupStepWrapper>
        { !!step.text && <CampaignGuideTextComponent text={step.text} /> }
      </SetupStepWrapper>
      <ChooseInvestigatorPrompt
        id={step.id}
        title={input.prompt}
        choiceId="investigator_choice"
        investigatorToValue={investigatorToString}
        renderResults={renderInvestigatorChoiceResults}
        required
      />
    </View>
  );
}
