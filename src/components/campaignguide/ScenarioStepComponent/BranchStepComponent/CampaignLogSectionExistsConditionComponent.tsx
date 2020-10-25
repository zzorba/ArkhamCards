import React, { useContext } from 'react';
import { t } from 'ttag';

import BinaryResult from '../../BinaryResult';
import CampaignGuideContext from '../../CampaignGuideContext';
import {
  BranchStep,
  CampaignLogSectionExistsCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { campaignLogConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: CampaignLogSectionExistsCondition;
  campaignLog: GuidedCampaignLog;
}

export default function CampaignLogSectionExistsConditionComponent({ step, condition, campaignLog }: Props) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  const logEntry = campaignGuide.logSection(condition.section);
  const prompt = logEntry ?
    t`Check Campaign Log, is the <i>${logEntry.section}</i> not crossed off?` :
    `Unknown campaign section: ${condition.section}`;
  const result = campaignLogConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text || prompt}
      result={result.decision}
    />
  );
}
