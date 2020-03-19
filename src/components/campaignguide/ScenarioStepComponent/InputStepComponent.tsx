import React from 'react';
import {
  Text,
} from 'react-native';

import ChooseOnePrompt from '../prompts/ChooseOnePrompt';
import BinaryPrompt from '../prompts/BinaryPrompt';
import NumberPrompt from '../prompts/NumberPrompt';
import SuppliesPrompt from '../prompts/SuppliesPrompt';
import InvestigatorChoicePrompt from '../prompts/InvestigatorChoicePrompt';
import { InputStep } from 'data/scenario/types';

interface Props {
  step: InputStep;
}

export default class InputStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    switch (step.input.type) {
      case 'choose_one':
        if (step.input.choices.length === 1) {
          return (
            <BinaryPrompt
              id={step.id}
              bulletType={step.bullet_type}
              text={step.input.choices[0].text}
              trueResult={step.input.choices[0]}
            />
          );
        }
        return (
          <ChooseOnePrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            choices={step.input.choices}
          />
        );
      case 'counter':
        return (
          <>
            <NumberPrompt
              id={step.id}
              bulletType={step.bullet_type}
              prompt={step.input.text}
              effects={step.input.effects}
              text={step.text}
            />
          </>
        );
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'investigator_counter':
        return <Text>Investigator Counter</Text>;
      case 'supplies':
        return (
          <SuppliesPrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            input={step.input}
          />
        );
      case 'use_supplies':
        return <Text>Use Supplies</Text>;
      case 'investigator_choice':
        return (
          <InvestigatorChoicePrompt
            id={step.id}
            text={step.text}
            bulletType={step.bullet_type}
            choices={step.input.choices}
            detailed={step.input.detailed}
            optional={step.input.investigator === 'choice'}
          />
        );
      default:
        return (
          <Text>{ step.input.type }</Text>
        );
    }
  }
}
