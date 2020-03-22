import React from 'react';
import { Text } from 'react-native';

import ScenarioDataConditionComponent from './ScenarioDataConditionComponent';
import CampaignDataConditionComponent from './CampaignDataConditionComponent';
import TraumaConditionComponent from './TraumaConditionComponent';
import HasCardConditionComponent from './HasCardConditionComponent';
import CampaignLogConditionComponent from './CampaignLogConditionComponent';
import { BranchStep } from 'data/scenario/types';

interface Props {
  step: BranchStep;
}

export default class BranchStepComponent extends React.Component<Props> {
  render(): React.ReactNode {
    const { step } = this.props;
    const condition = step.condition;
    switch (condition.type) {
      case 'campaign_log_count':
      case 'campaign_log_section_exists':
      case 'math':
      case 'check_supplies':
        return <Text>{ condition.type }</Text>
      case 'campaign_log':
        return (
          <CampaignLogConditionComponent
            step={step}
            condition={condition}
          />
        );
      case 'campaign_data': {
        return (
          <CampaignDataConditionComponent
            step={step}
            condition={condition}
          />
        );
      }
      case 'scenario_data': {
        return (
          <ScenarioDataConditionComponent
            step={step}
            condition={condition}
          />
        );
      }
      case 'has_card': {
        return (
          <HasCardConditionComponent
            step={step}
            condition={condition}
          />
        );
      }
      case 'trauma': {
        return (
          <TraumaConditionComponent
            step={step}
            condition={condition}
          />
        );
      }
    }
  }
}
