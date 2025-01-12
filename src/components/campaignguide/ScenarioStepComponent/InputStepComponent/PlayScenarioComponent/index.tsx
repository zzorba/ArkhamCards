import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { c, t } from 'ttag';

import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { PlayScenarioInput } from '@data/scenario/types';
import { PlayingScenarioBranch } from '@data/scenario/fixedSteps';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { CampaignId } from '@actions/types';
import PlayOptionsComponent from './PlayOptionsComponent';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  componentId: string;
  campaignId: CampaignId;
  id: string;
  input: PlayScenarioInput;
}

export default function PlayScenarioComponent({ componentId, campaignId, id, input }: Props) {
  const iteration = useMemo(() => {
    return id.split('#')[1];
  }, [id]);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const { colors, typography } = useContext(StyleContext);

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
                id: 'other',
                text: c('campaign_log_entry').t`Other.`,
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
    if (firstDecision === PlayingScenarioBranch.RESOLUTION) {
      return (
        <View style={[styles.resolutionBlock, space.marginS, { backgroundColor: colors.campaign.background.resolution }]}>
          <View style={[styles.resolutionContent, space.paddingS]}>
            <Text style={[typography.bigGameFont, { color: colors.campaign.text.resolution }]}>
              {t`Scenario Ended`}
            </Text>
          </View>
        </View>
      )
    }
    return null;
  }, [scenarioState, campaignLog, typography, colors, componentId, campaignId, id, input]);

  return (
    <>
      { !iteration && (
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

const styles = StyleSheet.create({
  resolutionBlock: {
    borderRadius: 8,
  },
  resolutionContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
