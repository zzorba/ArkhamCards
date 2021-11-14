import React from 'react';
import { values, find } from 'lodash';

import BinaryResult from '../../BinaryResult';
import {
  BranchStep,
  PartnerStatusCondition,
} from '@data/scenario/types';
import { partnerStatusConditionResult } from '@data/scenario/conditionHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: PartnerStatusCondition;
  campaignLog: GuidedCampaignLog;
}


export default function PartnerStatusConditionComponent({ step, condition, campaignLog }: Props) {
  const result = partnerStatusConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={!!find(values(result.investigatorChoices), x => !!find(x, y => y === 'true'))}
    />
  );
}
