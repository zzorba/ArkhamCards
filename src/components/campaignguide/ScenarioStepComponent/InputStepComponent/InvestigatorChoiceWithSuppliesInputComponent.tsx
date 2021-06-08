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

interface Props {
  step: InputStep;
  input: InvestigatorChoiceWithSuppliesInput;
  campaignLog: GuidedCampaignLog;
}

export default function InvestigatorChoiceWithSuppliesInputComponent({ step, input, campaignLog }: Props) {
  const investigatorHasSupply = useCallback((code: string) => {
    const investigatorSection = campaignLog.investigatorSections[input.section] || {};
    const section = investigatorSection[code];
    return !!(section &&
      find(section.entries, entry => entry.id === input.id && entry.type === 'count' && entry.count > 0) &&
      !section.crossedOut[input.id]
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
    const prompt = investigator.grammarGenderMasculine() ?
      c('masculine').t`${investigator.name} reads <b>${sectionName}</b>` :
      c('feminine').t`${investigator.name} reads <b>${sectionName}</b>`;
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
