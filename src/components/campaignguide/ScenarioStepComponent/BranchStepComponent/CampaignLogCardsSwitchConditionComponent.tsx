import React from 'react';

import {
  BranchStep,
  CampaignLogCardsSwitchCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';

interface Props {
  step: BranchStep;
  condition: CampaignLogCardsSwitchCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogCardsSwitchConditionComponent({ step, condition, campaignLog }: Props) {
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
