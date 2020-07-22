import React from 'react';
import { upperFirst } from 'lodash';
import { t } from 'ttag';

import BinaryResult from '@components/campaignguide/BinaryResult';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import {
  BranchStep,
  CampaignDataCondition,
} from '@data/scenario/types';
import { campaignDataScenarioConditionResult, campaignDataInvestigatorConditionResult } from '@data/scenario/conditionHelper';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  step: BranchStep;
  condition: CampaignDataCondition;
  campaignLog: GuidedCampaignLog;
}

export default class CampaignDataConditionComponent extends React.Component<Props> {
  render() {
    const { step, condition, campaignLog } = this.props;
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignGuide }: CampaignGuideContextType) => {
          switch (condition.campaign_data) {
            case 'difficulty': {
              const difficulty = upperFirst(campaignLog.campaignData.difficulty);
              return (
                <SetupStepWrapper bulletType={step.bullet_type}>
                  <CampaignGuideTextComponent
                    text={t`Because you are playing on <b>${difficulty}</b> difficulty:`}
                  />
                </SetupStepWrapper>
              );
            }
            case 'scenario_completed': {
              const result = campaignDataScenarioConditionResult(condition, campaignLog);
              const scenarioName: string =
                campaignGuide.scenarioName(condition.scenario) ||
                condition.scenario;
              return (
                <SetupStepWrapper bulletType={step.bullet_type}>
                  <CampaignGuideTextComponent text={result.decision ?
                    t`Because you have already completed <b>${scenarioName}</b>:` :
                    t`Because you have not yet completed <b>${scenarioName}</b>:`
                  } />
                </SetupStepWrapper>
              );
            }
            case 'investigator':
              if (step.text) {
                const result = campaignDataInvestigatorConditionResult(condition, campaignLog);
                return (
                  <BinaryResult
                    bulletType={step.bullet_type}
                    prompt={step.text}
                    result={result.decision}
                  />
                );
              }
              return null;
            case 'chaos_bag':
              // We always write these out.
              return null;
          }
        } }
      </CampaignGuideContext.Consumer>
    );
  }
}
