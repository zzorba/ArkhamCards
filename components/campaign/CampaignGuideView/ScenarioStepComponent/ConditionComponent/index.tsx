import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import { Condition } from '../../../../../data/scenario/types';
import CampaignGuide from '../../../../../data/scenario/CampaignGuide';
import typography from '../../../../../styles/typography';

interface Props {
  guide: CampaignGuide;
  condition: Condition;
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
export default class ConditionComponent extends React.Component<Props> {
  render() {
    const { condition, guide } = this.props;
    switch (condition.type) {
      case 'campaign_log':
        if (condition.id) {
          const logEntry = guide.logEntryText(condition.section, condition.id);
          return (
            <Text style={typography.text}>
              { t`Check Campaign Log. `}
              <Text style={typography.italic}>
                { t`If ${logEntry}` }
              </Text>
              :
            </Text>
          );
        }
        return (
          <Text>Check Campaign Log: {condition.section} {condition.id}</Text>
        );
      case 'campaign_data':
        return (
          <Text>Check Campaign Log: {condition.campaign_data}</Text>
        );
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
