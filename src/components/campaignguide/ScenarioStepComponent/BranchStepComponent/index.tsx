import React from 'react';

import MultiConditionComponent from './MultiConditionComponent';
import MathConditionComponent from './MathConditionComponent';
import CheckSuppliesConditionComponent from './CheckSuppliesConditionComponent';
import CampaignLogSectionExistsConditionComponent from './CampaignLogSectionExistsConditionComponent';
import CampaignLogCountConditionComponent from './CampaignLogCountConditionComponent';
import ScenarioDataConditionComponent from './ScenarioDataConditionComponent';
import CampaignDataConditionComponent from './CampaignDataConditionComponent';
import TraumaConditionComponent from './TraumaConditionComponent';
import HasCardConditionComponent from './HasCardConditionComponent';
import CampaignLogConditionComponent from './CampaignLogConditionComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { BranchStep } from '@data/scenario/types';
import CampaignLogInvestigatorCountConditionComponent from './CampaignLogInvestigatorCountConditionComponent';
import CampaignLogCardsSwitchConditionComponent from './CampaignLogCardsSwitchConditionComponent';
import PartnerStatusConditionComponent from './PartnerStatusConditionComponent';

interface Props {
  step: BranchStep;
  campaignLog: GuidedCampaignLog;
}

export default function BranchStepComponent({ step, campaignLog }: Props) {
  if (step.hidden) {
    return null;
  }
  const condition = step.condition;
  switch (condition.type) {
    case 'multi':
      return (
        <MultiConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log_count':
      return (
        <CampaignLogCountConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log_investigator_count':
      return (
        <CampaignLogInvestigatorCountConditionComponent
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
      return (
        <MathConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'check_supplies':
      return (
        <CheckSuppliesConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log':
    case 'campaign_log_cards':
      return (
        <CampaignLogConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
    case 'campaign_log_cards_switch':
      return (
        <CampaignLogCardsSwitchConditionComponent step={step} />
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
    case 'partner_status':
      return (
        <PartnerStatusConditionComponent
          step={step}
          campaignLog={campaignLog}
          condition={condition}
        />
      );
  }
}
