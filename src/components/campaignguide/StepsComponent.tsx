import React from 'react';
import { flatMap } from 'lodash';

import ScenarioStepComponent from './ScenarioStepComponent';
import ScenarioStateHelper from './ScenarioStateHelper';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';

interface Props {
  steps: string[];
}

export default class StepsComponent extends React.Component<Props> {
  render() {
    const {
      steps,
    } = this.props;
    var reachedBranch = false;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioGuide, scenarioState }: ScenarioGuideContextType) => {
          return flatMap(steps, stepId => {
            const step = scenarioGuide.step(stepId);
            if (!step) {
              return null;
            }
            if (reachedBranch) {
              return null;
            }
            if (step.type === 'input' || step.type === 'branch') {
              reachedBranch = !scenarioState.hasDecision(step.id);
            }
            return (
              <ScenarioStepComponent
                key={step.id}
                step={step}
              />
            );
          });
        }}
      </ScenarioGuideContext.Consumer>
    );
  }
}
