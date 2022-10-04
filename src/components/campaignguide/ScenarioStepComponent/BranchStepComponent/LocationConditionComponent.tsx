import React from 'react';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  LocationCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { locationConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: LocationCondition;
  campaignLog: GuidedCampaignLog;
}

export default function LocationConditionComponent({ step, condition, campaignLog }: Props) {
  const result = locationConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
    />
  );
}
