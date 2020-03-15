import React from 'react';
import {
  Text,
} from 'react-native';

import ScenarioStateHelper from '../ScenarioStateHelper';
import BranchStepComponent from './BranchStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import GenericStepComponent from './GenericStepComponent';
import InputStepComponent from './InputStepComponent';
import RuleReminderStepComponent from './RuleReminderStepComponent';
import StoryStepComponent from './StoryStepComponent';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { Step } from 'data/scenario/types';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
  step: Step;
  scenarioState: ScenarioStateHelper;
}

export default class ScenarioStepComponent extends React.Component<Props> {
  render() {
    const { guide, step, scenario, scenarioState } = this.props;
    if (!step.type) {
      return <GenericStepComponent step={step} guide={guide} />;
    }
    switch (step.type) {
      case 'branch':
        return (
          <BranchStepComponent
            step={step}
            scenarioState={scenarioState}
            guide={guide}
            scenario={scenario}
          />
        );
      case 'story':
        return <StoryStepComponent step={step} />;
      case 'encounter_sets':
        return <EncounterSetStepComponent step={step} />;
      case 'rule_reminder':
        return <RuleReminderStepComponent step={step} />;
      case 'input':
        return (
          <InputStepComponent
            step={step}
            scenarioState={scenarioState}
            guide={guide}
            scenario={scenario}
          />
        );
      default:
        return <Text>Unknown step type</Text>;
    }
  }
}
