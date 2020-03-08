import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { t } from 'ttag';

import CardConditionWrapper from './CardConditionWrapper';
import {
  Condition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
  ScenarioDataCondition,
} from 'data/scenario/types';
import Card from 'data/Card';
import CampaignGuide from 'data/scenario/CampaignGuide';
import typography from 'styles/typography';

interface Props {
  guide: CampaignGuide;
  condition: Condition;
}

export default class ConditionComponent extends React.Component<Props> {

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
        return (
          <Text>
            If you have already completed {scenario ?
              scenario.scenario.scenarioName :
              condition.scenario
            }.
          </Text>
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

  render() {
    const { condition, guide } = this.props;
    switch (condition.type) {
      case 'campaign_log':
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
            return (
              <Text style={typography.text}>
                { t`Check ${logEntry.section}. `}
                <Text style={typography.italic}>
                  { t`If ${logEntry.text}` }
                </Text>
              </Text>
            );
          }
          return (
            <CardConditionWrapper
              code={logEntry.code}
              render={(card: Card) => (
                <Text style={typography.text}>
                  { t`If ${card.name} is listed under ${logEntry.section}. `}
                </Text>
              )}
            />
          );
        }
        return (
          <Text>
            Check Campaign Log: {condition.section} {condition.id}
          </Text>
        );
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
