import React from 'react';
import {
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { t } from 'ttag';

import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import Card from 'data/Card';
import {
  BranchStep,
  CampaignLogCountCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCountCondition;
  campaignLog: GuidedCampaignLog;
}

// TODO: fix this.
export default class CampaignLogCountConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition } = this.props;
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
                  return (
                    <BinaryPrompt
                      id={step.id}
                      text={prompt}
                      trueResult={find(condition.options, option => option.boolCondition === true)}
                      falseResult={find(condition.options, option => option.boolCondition === false)}
                    />
                  );
                }
                case 'card': {
                  return (
                    <SingleCardWrapper
                      code={logEntry.code}
                      render={(card: Card) => {
                        const prompt = step.text ||
                          t`Is ${card.name} is listed under ${logEntry.section}?`;
                        return (
                          <BinaryPrompt
                            id={step.id}
                            text={prompt}
                            trueResult={find(condition.options, option => option.boolCondition === true)}
                            falseResult={find(condition.options, option => option.boolCondition === false)}
                          />
                        );
                      }}
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
