import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import BranchStepComponent from './BranchStepComponent';
import GenericStepComponent from './GenericStepComponent';
import EncounterSetStepComponent from './EncounterSetStepComponent';
import StoryStepComponent from './StoryStepComponent';
import CampaignGuide from '../../../../data/scenario/CampaignGuide';
import { Step } from '../../../../data/scenario/types';

interface Props {
  guide: CampaignGuide;
  step: Step;
}

export default class ScenarioStepComponent extends React.Component<Props> {
  render() {
    const { guide, step } = this.props;
    if (!step.type) {
      return <GenericStepComponent step={step} />
    }
    switch (step.type) {
      case 'branch':
        return <BranchStepComponent step={step} guide={guide} />
      case 'story':
        return <StoryStepComponent step={step} />;
      case 'encounter_sets': {
        return <EncounterSetStepComponent step={step} />;
      }
      default:
        return <Text>{`Unknown ${step.type}`}</Text>;
    }
  }
}
