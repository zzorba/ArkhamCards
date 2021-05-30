import React, { useContext, useMemo } from 'react';
import { t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { PlayScenarioInput } from '@data/scenario/types';
import { PlayingScenarioBranch, PLAY_SCENARIO_STEP_ID } from '@data/scenario/fixedSteps';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { CampaignId } from '@actions/types';
import PlayOptionsComponent from './PlayOptionsComponent';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  id: string;
  input: PlayScenarioInput;
}

export default function PlayScenarioComponent({ componentId, campaignId, id, input }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { campaignLog } = useContext(ScenarioStepContext);

  const mainContent = useMemo(() => {
    const firstDecision = scenarioState.choice(id);
    if (firstDecision === PlayingScenarioBranch.CAMPAIGN_LOG) {
      const choices = chooseOneInputChoices(
        input.campaign_log || [],
        campaignLog
      );
      if (choices.length) {
        return (
          <ChooseOnePrompt
            id={`${id}_campaign_log`}
            text={t`Choose entry to add to campaign log:`}
            showUndo
            choices={[
              ...choices,
              {
                text: 'Other.',
              },
            ]}
          />
        );
      }
    }
    if (firstDecision === undefined) {
      return (
        <PlayOptionsComponent
          componentId={componentId}
          id={id}
          campaignId={campaignId}
          input={input}
        />
      );
    }
    return null;
  }, [scenarioState, campaignLog, componentId, campaignId, id, input]);

  return (
    <>
      { (id === PLAY_SCENARIO_STEP_ID) && (
        <SetupStepWrapper>
          <CampaignGuideTextComponent
            text={t`Start playing the scenario now.`}
          />
        </SetupStepWrapper>
      ) }
      { mainContent }
      { }
    </>
  );
}
