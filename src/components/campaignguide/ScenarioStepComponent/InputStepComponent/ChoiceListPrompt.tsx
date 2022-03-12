import React, { useMemo } from 'react';
import { filter, map } from 'lodash';

import InvestigatorCheckListComponent from '@components/campaignguide/prompts/InvestigatorCheckListComponent';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from '@components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import { ChoicelistInput, InputStep, InvestigatorChoiceInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { chooseOneInputChoices, investigatorChoiceInputChoices } from '@data/scenario/inputHelper';
import { basicTraumaConditionResult } from '@data/scenario/conditionHelper';
import ChoiceListComponent, { ListItem } from '@components/campaignguide/prompts/ChoiceListComponent';
import { UniversalChoices } from '@data/scenario';

interface Props {
  step: InputStep;
  input: ChoicelistInput;
  campaignLog: GuidedCampaignLog;
}

export default function ChoiceListPrompt({ step, input, campaignLog }: Props) {
  const [items, options] = useMemo(() => {
    const options: UniversalChoices = {
      type: 'universal',
      choices: chooseOneInputChoices(input.choices, campaignLog),
    };
    return [
      chooseOneInputChoices(input.items, campaignLog),
      options,
    ];
  }, [input, campaignLog]);
  const choiceItems: ListItem[] = useMemo(() => map(items, item => {
    return {
      code: item.id,
      name: item.text || '',
    };
  }), [items])
  return (
    <ChoiceListComponent
      id={step.id}
      text={step.text}
      promptType={step.prompt_type}
      bulletType={step.bullet_type}
      options={options}
      items={choiceItems}
    />
  );
}
