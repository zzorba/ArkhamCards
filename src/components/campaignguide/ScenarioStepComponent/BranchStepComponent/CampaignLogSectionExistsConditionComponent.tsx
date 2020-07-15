import React from 'react';
import { t } from 'ttag';

import BinaryResult from '../../BinaryResult';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
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

export default class CampaignLogSectionExistsConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
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
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
