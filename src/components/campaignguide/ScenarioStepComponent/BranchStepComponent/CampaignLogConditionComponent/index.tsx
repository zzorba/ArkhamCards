import React from 'react';
import {
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { t } from 'ttag';

import CampaignLogCardConditionComponent from './CampaignLogCardConditionComponent';
import BinaryResult from '../../../BinaryResult';
import BinaryPrompt from '../../../prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../../CampaignGuideContext';
import {
  BranchStep,
  CampaignLogCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CampaignLogConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          if (every(condition.options, option => option.boolCondition !== undefined)) {
            // It's a binary prompt.
            if (condition.id) {
              const logEntry = campaignGuide.logEntry(condition.section, condition.id);
              if (!logEntry) {
                return (
                  <Text>
                    Unknown campaign log { condition.section }.{ condition.id }
                  </Text>
                );
              }
              switch (logEntry.type) {
                case 'text': {
                  const prompt = step.text ||
                    t`Check ${logEntry.section}. <i>If ${logEntry.text}</i>`;

                  if (campaignLog.fullyGuided) {
                    const result = campaignLog.check(condition.section, condition.id);
                    return (
                      <BinaryResult
                        prompt={prompt}
                        result={result}
                        bulletType={step.bullet_type}
                      />
                    );
                  }

                  return (
                    <BinaryPrompt
                      id={step.id}
                      bulletType={step.bullet_type}
                      text={prompt}
                      trueResult={find(condition.options, option => option.boolCondition === true)}
                      falseResult={find(condition.options, option => option.boolCondition === false)}
                    />
                  );
                }
                case 'card': {
                  return (
                    <CampaignLogCardConditionComponent
                      step={step}
                      entry={logEntry}
                      condition={condition}
                      campaignLog={campaignLog}
                    />
                  );
                }
              }
            }
          }
          // Not a binary condition.
          return (
            <Text>
              A more complex Campaign Log branch of some sort
            </Text>
          );
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
