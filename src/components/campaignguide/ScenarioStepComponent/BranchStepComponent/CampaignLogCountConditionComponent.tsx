import React from 'react';
import {
  Text,
} from 'react-native';
import { every, find } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import BinaryPrompt from '../../prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import Card from 'data/Card';
import {
  BranchStep,
  CampaignLogCountCondition,
} from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignLogCountCondition;
  campaignLog: GuidedCampaignLog;
}

// TODO: fix this.
export default class CampaignLogCountConditionComponent extends React.Component<Props> {
  getPrompt(campaignGuide: CampaignGuide, count: number) {
    const { condition } = this.props;
    const logEntry = campaignGuide.logEntry(condition.section, condition.id);
    switch (logEntry.type) {
      case 'section_count':
        return ngettext(
          msgid`Check Campaign Log. Because there is ${count} entry under '${logEntry.section}'`,
          `Check Campaign Log. Because there are ${count} entries under '${logEntry.section}'`,
          count
        );
      case 'text': {
        return t`Check Campaign Log. Because <i>${logEntry.text.replace('#X#', `${count}`)}</i>`;
      }
      default:
        return 'Some other count condition';
    }
  }

  render(): React.ReactNode {
    const { step, condition, campaignLog } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          if (campaignLog.fullyGuided) {
            const count = campaignLog.count(condition.section, condition.id);
            return (
              <SetupStepWrapper bulletType={step.bullet_type}>
                <CardTextComponent
                  text={this.getPrompt(campaignGuide, count)}
                />
              </SetupStepWrapper>
            );
          }
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
                      bulletType={step.bullet_type}
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
                          t`Is ${card.name} listed under ${logEntry.section}?`;
                        return (
                          <BinaryPrompt
                            id={step.id}
                            bulletType={step.bullet_type}
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
