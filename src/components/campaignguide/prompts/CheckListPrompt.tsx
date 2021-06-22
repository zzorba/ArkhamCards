import React, { useContext } from 'react';

import { BulletType, ChecklistInput } from '@data/scenario/types';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import CheckListComponent from './CheckListComponent';
import ScenarioStepContext from '../ScenarioStepContext';
import { map } from 'lodash';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  input: ChecklistInput;
}

export default function CheckListPrompt({ id, bulletType, text, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const choices = chooseOneInputChoices(input.choices, campaignLog);
  return (
    <CheckListComponent
      id={id}
      choiceId="checked"
      text={text}
      bulletType={bulletType}
      min={input.min}
      max={input.max}
      items={map(choices, choice => {
        return {
          code: choice.id,
          name: choice.text || '',
          description: choice.description,
        };
      })}
      checkText={input.text}
    />
  );
}
