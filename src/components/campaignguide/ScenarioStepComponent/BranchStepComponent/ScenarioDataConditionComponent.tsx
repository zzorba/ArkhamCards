import React from 'react';
import { ngettext, msgid } from 'ttag';

import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import {
  BranchStep,
  ScenarioDataCondition,
} from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import BinaryResult from '@components/campaignguide/BinaryResult';
import { fixedInvestigatorStatusConditionResult, investigatorStatusConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: BranchStep;
  condition: ScenarioDataCondition;
  campaignLog: GuidedCampaignLog;
}

export default function ScenarioDataConditionComponent({ step, condition, campaignLog }: Props) {
  switch (condition.scenario_data) {
    case 'player_count': {
      const playerCount = campaignLog.playerCount();
      return (
        <SetupStepWrapper bulletType={step.bullet_type}>
          <CampaignGuideTextComponent
            text={step.text ||
              ngettext(msgid`Because there is ${playerCount} player in the game:`,
                `Because there are ${playerCount} players in the game:`,
                playerCount)
            }
          />
        </SetupStepWrapper>
      );
    }
    case 'fixed_investigator_status':
      if (step.text) {
        const result = fixedInvestigatorStatusConditionResult(condition, campaignLog);
        return (
          <BinaryResult
            bulletType={step.bullet_type}
            prompt={step.text}
            result={result.decision}
          />
        );
      }
      return null;
    case 'investigator_status':
      if (step.text) {
        const result = investigatorStatusConditionResult(condition, campaignLog);
        return (
          <BinaryResult
            bulletType={step.bullet_type}
            prompt={step.text}
            result={result.decision}
          />
        );
      }
      return null;
    case 'resolution':
    case 'has_resolution': {
      // Only used for control flow right now.
      return null;
    }
  }
}
