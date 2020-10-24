import React, { useCallback, useContext, useMemo } from 'react';
import { Navigation } from 'react-native-navigation';
import { map } from 'lodash';
import { t } from 'ttag';

import BranchButton from './BranchButton';
import { GuideChaosBagProps } from '@components/campaignguide/GuideChaosBagView';
import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { PlayScenarioInput } from '@data/scenario/types';
import { PlayingScenarioBranch } from '@data/scenario/fixedSteps';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';

interface Props {
  componentId: string;
  campaignId: number;
  id: string;
  input: PlayScenarioInput;
}

export default function PlayScenarioComponent({ componentId, campaignId, id, input }: Props) {
  const { scenarioState, processedScenario, campaignLog } = useContext(ScenarioStepContext);

  const branchPress = useCallback((index: number) => {
    scenarioState.setChoice(id, index);
  }, [scenarioState, id]);

  const campaignLogPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.CAMPAIGN_LOG);
  }, [branchPress]);

  const resolutionPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.RESOLUTION);
  }, [branchPress]);
  const drawWeaknessPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.DRAW_WEAKNESS);
  }, [branchPress]);
  const recordTraumaPressed = useCallback(() => {
    branchPress(PlayingScenarioBranch.RECORD_TRAUMA);
  }, [branchPress]);

  const showScenarioFaq = useCallback(() => {
    Navigation.push<ScenarioFaqProps>(componentId, {
      component: {
        name: 'Guide.ScenarioFaq',
        passProps: {
          scenario: processedScenario.id.scenarioId,
          campaignId,
        },
      },
    });
  }, [componentId, campaignId, processedScenario]);

  const chaosBagSimulatorPressed = useCallback(() => {
    Navigation.push<GuideChaosBagProps>(componentId, {
      component: {
        name: 'Guide.ChaosBag',
        passProps: {
          componentId,
          campaignId,
          chaosBag: campaignLog.chaosBag,
        },
        options: {
          topBar: {
            title: {
              text: t`Chaos Bag`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, campaignLog]);

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
      const hasFaq = processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;
      return (
        <>
          { map(
            input.branches || [],
            (choice, index) => (
              <BranchButton
                key={index}
                index={index}
                choice={choice}
                campaignLog={campaignLog}
                onPress={branchPress}
              />
            )
          ) }
          <BasicButton
            title={t`Edit campaign log`}
            onPress={campaignLogPressed}
          />
          <BasicButton
            title={t`Draw chaos tokens`}
            onPress={chaosBagSimulatorPressed}
          />
          <BasicButton
            title={t`Draw random basic weakness`}
            onPress={drawWeaknessPressed}
          />
          <BasicButton
            title={t`Record trauma`}
            onPress={recordTraumaPressed}
          />
          { !!hasFaq && (
            <BasicButton
              title={t`Scenario FAQ`}
              onPress={showScenarioFaq}
            />
          ) }
          <BasicButton
            title={input.no_resolutions ? t`Scenario completed` : t`Resolutions`}
            onPress={resolutionPressed}
          />
        </>
      );
    }
    return null;
  }, [scenarioState, processedScenario, campaignLog, id, input, branchPress, campaignLogPressed, chaosBagSimulatorPressed, drawWeaknessPressed, recordTraumaPressed, showScenarioFaq, resolutionPressed]);

  return (
    <>
      { (id === '$play_scenario') && (
        <SetupStepWrapper>
          <CampaignGuideTextComponent
            text={t`Start playing the scenario now.`}
          />
        </SetupStepWrapper>
      ) }
      { mainContent }
    </>
  );
}
