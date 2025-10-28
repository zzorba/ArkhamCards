import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';

import { t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { ReceiveCampaignLinkInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import ActionButton from '@components/campaignguide/prompts/ActionButton';
import space from '@styles/space';
import { useNavigation } from '@react-navigation/native';

interface Props {
  id: string;
  input: ReceiveCampaignLinkInput;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario?: () => void;
}

export default function ReceiveCampaignLinkInputComponent({
  id,
  input,
  campaignLog,
  switchCampaignScenario,
}: Props) {
  const navigation = useNavigation();
  const { scenarioState } = useContext(ScenarioGuideContext);
  const close = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
