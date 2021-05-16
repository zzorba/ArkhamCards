import React, { useMemo } from 'react';

import { BranchStep, CampaignLogInvestigatorCountCondition } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import BinaryResult from '@components/campaignguide/BinaryResult';
import { campaignLogInvestigatorCountConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: CampaignLogInvestigatorCountCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogInvestigatorCountConditionComponent({ step, condition, campaignLog }: Props) {
  const result = useMemo(() => {
    return campaignLogInvestigatorCountConditionResult(condition, campaignLog);
  }, [condition, campaignLog]);
  if (condition.section === 'hidden') {
    return null;
  }
  if (result.type === 'binary') {
    return (
      <BinaryResult
        prompt={step.text || ''}
        bulletType={step.bullet_type}
        result={result.decision}
      />
    );
  }
  // 'all' type ones are JUST for effects.
  return null;
}
