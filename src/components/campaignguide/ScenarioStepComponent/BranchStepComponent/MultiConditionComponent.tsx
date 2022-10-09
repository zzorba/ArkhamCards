import React from 'react';

import BinaryResult from '../../BinaryResult';
import {
  BorderColor,
  BranchStep,
  MultiCondition,
} from '@data/scenario/types';
import { multiConditionResult } from '@data/scenario/conditionHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: MultiCondition;
  campaignLog: GuidedCampaignLog;
  color: BorderColor;
}


export default function MultiConditionComponent({ step, condition, campaignLog, color }: Props) {
  const result = multiConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
      color={color}
    />
  );
}
