import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { t } from 'ttag';

import CampaignLogCardCondition from './CampaignLogCardCondition';
import {
  Condition,
  CampaignDataCondition,
  CampaignDataScenarioCondition,
  CampaignDataChaosBagCondition,
} from '../../../../../data/scenario/types';
import CampaignGuide from '../../../../../data/scenario/CampaignGuide';
import typography from '../../../../../styles/typography';

interface Props {
  guide: CampaignGuide;
  condition: Condition;
}

export default class ConditionComponent extends React.Component<Props> {

  renderScenarioData(condition:
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
                  { t`If ${logEntry}` }
                </Text>
              </Text>
            );
          }
          return (
            <CampaignLogCardCondition
              code={logEntry.code}
              section={logEntry.section}
            />
          );
        }
        return (
          <Text>Check Campaign Log: {condition.section} {condition.id}</Text>
        );
      case 'campaign_data': {
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
