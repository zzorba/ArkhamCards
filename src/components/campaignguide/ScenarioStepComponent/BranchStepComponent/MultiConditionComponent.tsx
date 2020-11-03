import React from 'react';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  MultiCondition,
} from '@data/scenario/types';
import { multiConditionResult } from '@data/scenario/conditionHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: MultiCondition;
  campaignLog: GuidedCampaignLog;
}


export default function MultiConditionComponent({ step, condition, campaignLog }: Props) {
  const result = multiConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
    />
  );
}
