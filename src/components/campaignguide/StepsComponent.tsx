import React from 'react';
import { map } from 'lodash';

import ScenarioStepComponent from './ScenarioStepComponent';
import ScenarioStep from '@data/scenario/ScenarioStep';

interface Props {
  steps: ScenarioStep[];
  width: number;
  switchCampaignScenario?: () => void;
  noTitle?: boolean;
}

export default function StepsComponent({
  steps,
  width,
  switchCampaignScenario,
  noTitle,
}: Props) {
  return (
    <>
      { map(steps, (step, idx) => (
        <ScenarioStepComponent
          key={`${step.step.id}_${idx}`}
          width={width}
          step={step}
          switchCampaignScenario={switchCampaignScenario}
          noTitle={noTitle}
        />
      )) }
    </>
  );
}
