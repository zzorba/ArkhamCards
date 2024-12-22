import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { ReceiveCampaignLinkInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import space from '@styles/space';

interface Props {
  componentId: string;
  id: string;
  input: ReceiveCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario?: () => void;
}

export default function ReceiveCampaignLinkInputComponent({
  componentId,
  id,
  input,
  campaignLog,
  switchCampaignScenario,
}: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
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
          <View style={space.paddingS}>
            { input.flip_campaign ? (
              <ActionButton
                leftIcon="shuffle"
                color="light"
                title={t`Switch campaign`}
                onPress={switchCampaignScenario}
              />
            ) : (
              <ActionButton
                leftIcon="check"
                title={t`Close`}
                onPress={close}
                color="light"
              />
            ) }
          </View>
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
