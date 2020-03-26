import React from 'react';
import {
  Text,
} from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import BinaryPrompt from '../../prompts/BinaryPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import {
  BranchStep,
  CampaignDataCondition,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignDataCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CampaignDataConditionComponent extends React.Component<Props> {
  render() {
    const { step, condition } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ campaignGuide }: ScenarioGuideContextType) => {
          switch (condition.campaign_data) {
            case 'investigator':
              return (
                <Text>
                  Some condition of an investigator.
                </Text>
              );
            case 'difficulty':
              return (
                <Text>
                  Check campaign difficulty.
                </Text>
              );
            case 'scenario_completed': {
              const chosenScenario = campaignGuide.getScenario(condition.scenario);
              const scenarioName =
                chosenScenario && chosenScenario.scenario.scenarioName || condition.scenario;
              return (
                <BinaryPrompt
                  id={step.id}
                  text={t`Have you have already completed ${scenarioName}?`}
                  trueResult={find(condition.options, option => option.boolCondition === true)}
                  falseResult={find(condition.options, option => option.boolCondition === false)}
                />
              );
            }
            case 'chaos_bag':
              return (
                <Text>
                  Check Chaos Bag: { condition.campaign_data }
                </Text>
              );
          }
        }}
      </ScenarioGuideContext.Consumer>
    );
  }
}
