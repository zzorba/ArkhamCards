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
import CampaignLogConditionComponent, { InvestigatorCampaignLogCardsConditionComponent } from './CampaignLogConditionComponent';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { BorderColor, BranchStep, LocationCondition, ScarletKeyCondition } from '@data/scenario/types';
import CampaignLogInvestigatorCountConditionComponent from './CampaignLogInvestigatorCountConditionComponent';
import CampaignLogCardsSwitchConditionComponent from './CampaignLogCardsSwitchConditionComponent';
import PartnerStatusConditionComponent from './PartnerStatusConditionComponent';
import { locationConditionResult, scarletKeyConditionResult } from '@data/scenario/conditionHelper';
import BinaryResult from '@components/campaignguide/BinaryResult';

interface Props {
  step: BranchStep;
  campaignLog: GuidedCampaignLog;
  color?: BorderColor;
}

function LocationConditionComponent({ step, condition, campaignLog }: Props & { condition: LocationCondition }) {
  const result = locationConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
    />
  );
}

function ScarletKeyConditionComponent({ condition, step, campaignLog }: Props & { condition: ScarletKeyCondition }) {
  const result = scarletKeyConditionResult(condition, campaignLog);
  return (
    <BinaryResult
      bulletType={step.bullet_type}
      prompt={step.text}
      result={result.decision}
    />
  );
}

export default function BranchStepComponent({ step, campaignLog, color }: Props) {
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
          color={color}
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
    case 'investigator_campaign_log_cards':
      return (
        <InvestigatorCampaignLogCardsConditionComponent
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
          color={color}
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
    case 'location': {
      return (
        <LocationConditionComponent
          step={step}
          condition={condition}
          campaignLog={campaignLog}
        />
      );
    }
    case 'scarlet_key': {
      return (
        <ScarletKeyConditionComponent
          step={step}
          condition={condition}
          campaignLog={campaignLog}
        />
      );
    }
    case 'scarlet_key_count':
    case 'campaign_log_task':
      // Just used for control flow
      return null;
  }
}
