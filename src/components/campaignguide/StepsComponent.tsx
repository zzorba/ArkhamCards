import React from 'react';
import { map } from 'lodash';

import ScenarioStepComponent from './ScenarioStepComponent';
import ScenarioStep from 'data/scenario/ScenarioStep';

interface Props {
  steps: ScenarioStep[];
  componentId: string;
  fontScale: number;
  width: number;
}

export default class StepsComponent extends React.Component<Props> {
  render() {
    const {
      steps,
      componentId,
      fontScale,
      width,
    } = this.props;
    return map(steps, (step, idx) => (
      <ScenarioStepComponent
        key={`${step.step.id}_${idx}`}
        componentId={componentId}
        fontScale={fontScale}
        width={width}
        step={step}
      />
    ));
  }
}
