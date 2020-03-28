import React from 'react';
import { Text } from 'react-native';
import { find, map } from 'lodash';

import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import BinaryPrompt from 'components/campaignguide/prompts/BinaryPrompt';
import CampaignGuideContext, { CampaignGuideContextType } from '../../CampaignGuideContext';
import {
  BranchStep,
  CheckSuppliesCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CheckSuppliesCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CheckSuppliesConditionComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step, condition } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          switch (condition.investigator) {
            case 'any':
              return (
                <BinaryPrompt
                  id={step.id}
                  bulletType={step.bullet_type}
                  text={step.text}
                  trueResult={find(condition.options, option => option.boolCondition === true)}
                  falseResult={find(condition.options, option => option.boolCondition === false)}
                />
              );
            case 'all': {
              return (
                <InvestigatorChoicePrompt
                  id={step.id}
                  text={step.text}
                  bulletType={step.bullet_type}
                  choices={map(condition.options, option => {
                    return {
                      text: option.condition || 'Missing fake text',
                      effects: option.effects || [],
                    };
                  })}
                />
              )
            }
            case 'choice':
              return (<Text>Check Supplies Investigator Choice</Text>);
          }
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
