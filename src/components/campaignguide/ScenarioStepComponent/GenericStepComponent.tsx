import React from 'react';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { BorderColor, GenericStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  step: GenericStep;
  color?: BorderColor;
}

export default function GenericStepComponent({ step, color }: Props) {
  if (!step.title && !step.text && !step.bullets) {
    return null;
  }
  if (step.hidden) {
    return null;
  }
  return (
    <>
      <SetupStepWrapper color={color} bulletType={step.title ? (step.bullet_type || 'none') : step.bullet_type}>
        { !!step.text && (
          <CampaignGuideTextComponent text={step.text} />
        ) }
      </SetupStepWrapper>
      <BulletsComponent bullets={step.bullets} />
    </>
  );
}
