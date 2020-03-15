import React from 'react';
import {
  Text,
} from 'react-native';

import BinaryPrompt from './prompts/BinaryPrompt';
import NumberPrompt from './prompts/NumberPrompt';
import { InputStep } from 'data/scenario/types';
import ScenarioStateHelper from '../ScenarioStateHelper';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';

interface Props {
  step: InputStep;
  scenarioState: ScenarioStateHelper;
  guide: CampaignGuide,
  scenario: ScenarioGuide;
}

export default class InputStepComponent extends React.Component<Props> {
  render() {
    const { step, scenarioState, guide, scenario } = this.props;
    switch (step.input.type) {
      case 'choose_one':
        if (step.input.choices.length === 1) {
          return (
            <BinaryPrompt
              id={step.id}
              text={step.input.choices[0].text}
              trueResult={step.input.choices[0]}
              guide={guide}
              scenario={scenario}
              scenarioState={scenarioState}
            />
          );
        }
        return <Text>Choose One with {step.input.choices.length}</Text>;
      case 'counter':
        return (
          <>
            <NumberPrompt
              id={step.id}
              prompt={step.input.text}
              effects={step.input.effects}
              guide={guide}
              scenario={scenario}
              scenarioState={scenarioState}
              text={step.text}
            />
          </>
        );
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'investigator_counter':
        return <Text>Investigator Counter</Text>;
      case 'supplies':
        return <Text>Supplies</Text>;
      case 'use_supplies':
        return <Text>Use Supplies</Text>;
      case 'investigator_choice':
        return <Text>Choose an investigator</Text>;
      default:
        return (
          <Text>{step.input.type}</Text>
        );
      }
  }
}
