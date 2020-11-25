import React from 'react';

import SetupStepWrapper from '../SetupStepWrapper';
import BulletsComponent from './BulletsComponent';
import { RuleReminderStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';

interface Props {
  step: RuleReminderStep;
}

export default function RuleReminderStepComponent({ step }: Props) {
  return (
    <>
      { !!step.text && (
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      ) }
      <BulletsComponent bullets={step.bullets} normalBulletType />
      { !!step.example && (
        <SetupStepWrapper bulletType="none">
          <CampaignGuideTextComponent text={step.example} />
        </SetupStepWrapper>
      ) }
    </>
  );
}
