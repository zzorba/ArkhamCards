import React, { useCallback, useContext } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { ReceiveCampaignLinkInput } from '@data/scenario/types';
import BasicButton from '@components/core/BasicButton';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

interface Props {
  componentId: string;
  id: string;
  input: ReceiveCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

export default function ReceiveCampaignLinkInputComponent({
  componentId,
  id,
  input,
  campaignLog,
  switchCampaignScenario,
}: Props) {
  const { scenarioState } = useContext(ScenarioStepContext);
  const close = useCallback(() => {
    Navigation.pop(componentId);
  }, [componentId]);

  if (campaignLog.linked) {
    const decision = scenarioState.campaignLink('receive', input.id);
    if (decision === undefined) {
      return (
        <>
          { input.linked_prompt && (
            <SetupStepWrapper>
              <CampaignGuideTextComponent text={input.linked_prompt} />
            </SetupStepWrapper>
          ) }
          { input.flip_campaign ? (
            <BasicButton
              title={t`Switch campaign`}
              onPress={switchCampaignScenario}
            />
          ) : (
            <BasicButton
              title={t`Close`}
              onPress={close}
            />
          ) }
        </>
      );
    }
    return null;
  }
  if (!input.choices.length) {
    // Just a roadbump
    return null;
  }
  return (
    <ChooseOnePrompt
      id={id}
      text={input.manual_prompt}
      choices={input.choices}
    />
  );
}
