import React from 'react';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  MathCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { mathEqualsConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: MathCondition;
  campaignLog: GuidedCampaignLog;
}

export default function MathConditionComponent({ step, condition, campaignLog }: Props) {
  if (condition.operation !== 'equals' || !step.text) {
    // Always spell these out;
    return null;
  }
  const result = mathEqualsConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
    />
  );
}
