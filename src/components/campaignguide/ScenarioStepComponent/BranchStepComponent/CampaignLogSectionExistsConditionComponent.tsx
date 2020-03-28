import React from 'react';
import { find } from 'lodash';
import { t } from 'ttag';

import BinaryPrompt from '../../prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import {
  BranchStep,
  CampaignLogSectionExistsCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogSectionExistsCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CampaignLogSectionExistsConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          const logEntry = campaignGuide.logSection(condition.section);
          const prompt = logEntry ?
            t`Check Campaign Log, is the <i>${logEntry.section}</i> not crossed off?` :
            `Unknown campaign section: ${condition.section}`;
          return (
            <BinaryPrompt
              id={step.id}
              bulletType={step.bullet_type}
              text={prompt}
              trueResult={find(condition.options, option => option.boolCondition === true)}
              falseResult={find(condition.options, option => option.boolCondition === false)}
            />
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
