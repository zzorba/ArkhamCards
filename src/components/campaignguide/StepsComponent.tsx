import React from 'react';
import { map } from 'lodash';

import ScenarioStepComponent from './ScenarioStepComponent';
import { Step } from 'data/scenario/types';

interface Props {
  steps: Step[];
}

export default class StepsComponent extends React.Component<Props> {
  render() {
    const {
      steps,
    } = this.props;
    return map(steps, step => (
      <ScenarioStepComponent
        key={step.id}
        step={step}
      />
    ));
  }
}
