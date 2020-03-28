import React from 'react';

import CheckSuppliesConditionComponent from './CheckSuppliesConditionComponent';
import CampaignLogSectionExistsConditionComponent from './CampaignLogSectionExistsConditionComponent';
import CampaignLogCountConditionComponent from './CampaignLogCountConditionComponent';
import ScenarioDataConditionComponent from './ScenarioDataConditionComponent';
import CampaignDataConditionComponent from './CampaignDataConditionComponent';
import TraumaConditionComponent from './TraumaConditionComponent';
import HasCardConditionComponent from './HasCardConditionComponent';
import CampaignLogConditionComponent from './CampaignLogConditionComponent';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { BranchStep } from 'data/scenario/types';

interface Props {
  step: BranchStep;
  campaignLog: GuidedCampaignLog;
}

export default function BranchStepComponent({ step, campaignLog }: Props) {
  const condition = step.condition;
  switch (condition.type) {
    case 'campaign_log_count':
      return (
        <CampaignLogCountConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log_section_exists':
      return (
        <CampaignLogSectionExistsConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'math':
      // We always write out the rational on the following steps.
      return null;
    case 'check_supplies':
      return (
        <CheckSuppliesConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log':
      return (
        <CampaignLogConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_data': {
      return (
        <CampaignDataConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    }
    case 'scenario_data': {
      return (
        <ScenarioDataConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    }
    case 'has_card': {
      return (
        <HasCardConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    }
    case 'trauma': {
      return (
        <TraumaConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    }
  }
}
