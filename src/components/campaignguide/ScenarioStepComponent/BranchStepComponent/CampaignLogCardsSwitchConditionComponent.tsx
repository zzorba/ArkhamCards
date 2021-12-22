import React from 'react';

import { BranchStep } from '@data/scenario/types';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';

interface Props {
  step: BranchStep;
}

export default function CampaignLogCardsSwitchConditionComponent({ step }: Props) {
  if (step.text) {
    return (
      <SetupStepWrapper bulletType={step.bullet_type}>
        <CampaignGuideTextComponent
          text={step.text}
        />
      </SetupStepWrapper>
    );
  }
  return null;
}
