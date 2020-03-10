import React from 'react';
import { flatMap } from 'lodash';

import ScenarioStepComponent from './ScenarioStepComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';

interface Props {
  guide: CampaignGuide;
  scenario: ScenarioGuide;
  steps: string[];
  scenarioState: ScenarioStateHelper;
}

export default class StepsComponent extends React.Component<Props> {
  render() {
    const { guide, scenario, scenarioState, steps } = this.props;
    return flatMap(steps, stepId => {
      const step = scenario.step(stepId);
      if (!step) {
        return null;
      }
      return (
        <ScenarioStepComponent
          key={step.id}
          step={step}
          scenario={scenario}
          guide={guide}
          scenarioState={scenarioState}
        />
      );
    });
  }
}
