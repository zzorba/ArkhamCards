import React, { useMemo } from 'react';
import { map } from 'lodash';

import { ChoicelistInput, InputStep } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import ChoiceListComponent from '@components/campaignguide/prompts/ChoiceListComponent';
import { ListItem } from '@components/campaignguide/prompts/CheckListComponent';
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
