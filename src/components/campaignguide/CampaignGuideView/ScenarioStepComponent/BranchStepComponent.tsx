import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { every, find, map } from 'lodash';
import { t } from 'ttag';

import CardWrapper from './CardWrapper';
import BinaryPrompt from './BinaryPrompt';
import ScenarioStateHelper from '../ScenarioStateHelper';
import Card from 'data/Card';
import {
  BranchStep,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  CampaignLogCondition,
  ScenarioDataCondition,
} from 'data/scenario/types';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

interface Props {
  scenarioState: ScenarioStateHelper;
  guide: CampaignGuide,
  scenario: ScenarioGuide;
  step: BranchStep;
}

/*
  export interface BranchStep {
    id: string;
    type: "branch";
    text?: string;
    condition: Condition;
    options: Option[];
  }
*/
export default class BranchStepComponent extends React.Component<Props> {

  renderCampaignData(condition:
    CampaignDataCondition
    | CampaignDataScenarioCondition
    | CampaignDataChaosBagCondition
  ) {
    const { guide } = this.props;
    switch (condition.campaign_data) {
      case 'difficulty':
        return (
          <Text>
            Check campaign difficulty.
          </Text>
        );
      case 'scenario_completed': {
        const scenario = guide.getScenario(condition.scenario);
        const scenarioName =
          scenario && scenario.scenario.scenarioName || condition.scenario;
        return (
          <CardTextComponent
            text={t`If you have already completed ${scenarioName}`}
          />
        );
      }
      case 'chaos_bag':
        return (
          <Text>Check Chaos Bag: {condition.campaign_data}</Text>
        );
    }
  }

  renderScenarioData(condition: ScenarioDataCondition) {
    return (
      <Text>Scenario Data: {condition.scenario_data}</Text>
    );
  }

  renderCampaignLog(condition: CampaignLogCondition) {
    const { guide, step, scenario, scenarioState } = this.props;
    if (every(step.options, option => option.boolCondition !== undefined)) {
      // It's a binary prompt.
      if (condition.id) {
        const logEntry = guide.logEntry(condition.section, condition.id);
        if (!logEntry) {
          return (
            <Text>
              Unknown campaign log {condition.section}.{condition.id}
            </Text>
          );
        }
        if (logEntry.type === 'text') {
          const prompt = step.text ||
            t`Check ${logEntry.section}. <i>If ${logEntry.text}</i>`;
          return (
            <BinaryPrompt
              id={step.id}
              text={prompt}
              trueResult={find(step.options, option => option.boolCondition === true)}
              falseResult={find(step.options, option => option.boolCondition === false)}
              guide={guide}
              scenario={scenario}
              scenarioState={scenarioState}
            />
          );
        }

        return (
          <CardWrapper
            code={logEntry.code}
            render={(card: Card) => {
              const prompt = step.text ||
                t`Is ${card.name} is listed under ${logEntry.section}?`;
              return (
                <BinaryPrompt
                  id={step.id}
                  text={prompt}
                  trueResult={find(step.options, option => option.boolCondition === true)}
                  falseResult={find(step.options, option => option.boolCondition === false)}
                  guide={guide}
                  scenario={scenario}
                  scenarioState={scenarioState}
                />
              );
            }}
          />
        );
      }
    }
    // Not a binary condition.
    return (
      <Text>A more complex Campaign Log branch of some sort</Text>
    );
    /*

    if (condition.section) {
      // Just a section.
    }
    return (
      <Text>
        Check Campaign Log: {condition.section} {condition.id}
      </Text>
    );*/
  }

  render() {
    const { step, guide } = this.props;
    const condition = step.condition;
    switch (condition.type) {
      case 'campaign_log':
        return this.renderCampaignLog(condition);
      case 'campaign_data': {
        return this.renderCampaignData(condition);
      }
      case 'scenario_data': {
        return this.renderScenarioData(condition);
      }
      default: return <Text>{condition.type}</Text>;
    }
  }
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
  },
})
