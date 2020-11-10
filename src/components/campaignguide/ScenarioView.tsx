import React, { useCallback, useContext, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { last } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import CampaignGuideContext from './CampaignGuideContext';
import { ScenarioGuideContextType } from './ScenarioGuideContext';
import StepsComponent from './StepsComponent';
import { CampaignLogProps } from './CampaignLogView';
import withScenarioGuideContext, { ScenarioGuideInputProps } from './withScenarioGuideContext';
import { iconsMap } from '@app/NavIcons';
import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import COLORS from '@styles/colors';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { useNavigationButtonPressed } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import NarratorView, { NarrationTrack, queueNarration } from './Narrator';

interface OwnProps {
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}
type InputProps = NavigationProps & ScenarioGuideInputProps & OwnProps;

type Props = InputProps & ScenarioGuideContextType;

export type ScenarioProps = ScenarioGuideInputProps & OwnProps;

const RESET_ENABLED = false;

function dynamicOptions(undo: boolean) {
  const rightButtons = RESET_ENABLED ? [{
    icon: iconsMap.replay,
    id: 'reset',
    color: COLORS.M,
  }] : [{
    icon: iconsMap.menu,
    id: 'log',
    color: COLORS.M,
    accessibilityLabel: t`Campaign Log`,
  }];
  if (undo) {
    rightButtons.push({
      icon: iconsMap.undo,
      id: 'undo',
      color: COLORS.M,
      accessibilityLabel: t`Undo`,
    });
  }
  return {
    topBar: {
      rightButtons,
    },
  };
}

function ScenarioView({ componentId, campaignId, showLinkedScenario, processedScenario, scenarioId }: Props) {
  const { campaignState } = useContext(CampaignGuideContext);
  const { backgroundStyle } = useContext(StyleContext);
  const { width } = useWindowDimensions();
  useEffect(() => {
    Navigation.mergeOptions(componentId, dynamicOptions(processedScenario.canUndo));
  }, [componentId, processedScenario.canUndo]);

  const menuPressed = useCallback(() => {
    const log = last(processedScenario.steps);
    if (!log) {
      return;
    }
    Navigation.push<CampaignLogProps>(componentId, {
      component: {
        name: 'Guide.Log',
        passProps: {
          campaignId,
          campaignLog: log.campaignLog,
          campaignGuide: processedScenario.scenarioGuide.campaignGuide,
        },
        options: {
          topBar: {
            title: {
              text: t`Campaign Log`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, processedScenario, campaignId]);

  const resetPressed = useCallback(() => {
    Alert.alert(
      t`Reset Scenario?`,
      t`Are you sure you want to reset this scenario?\n\nAll data you have entered will be lost.`,
      [{
        text: t`Nevermind`,
      }, {
        text: t`Reset`,
        style: 'destructive',
        onPress: () => {
          campaignState.resetScenario(scenarioId);
        },
      }]
    );
  }, [campaignState, scenarioId]);

  const undoPressed = useCallback(() => {
    campaignState.undo(scenarioId);
    if (processedScenario.closeOnUndo) {
      Navigation.pop(componentId);
    }
  }, [componentId, scenarioId, processedScenario.closeOnUndo, campaignState]);

  useNavigationButtonPressed(({ buttonId }) => {
    switch (buttonId) {
      case 'reset': {
        resetPressed();
        break;
      }
      case 'log': {
        menuPressed();
        break;
      }
      case 'undo': {
        undoPressed();
        break;
      }
    }
  }, componentId, [resetPressed, menuPressed, undoPressed]);


  const switchCampaignScenario = useCallback(() => {
    Navigation.pop(componentId).then(() => {
      if (showLinkedScenario) {
        showLinkedScenario(processedScenario.id.encodedScenarioId);
      }
    });
  }, [componentId, showLinkedScenario, processedScenario.id]);

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
  }, [componentId, campaignId, processedScenario.id]);
  
  useEffect(() => {
    const queue: NarrationTrack[] = [];
    for (const scenarioStep of processedScenario.steps) {
      if (scenarioStep.step.type === "resolution") {
        const narration = processedScenario.scenarioGuide.resolution(
          scenarioStep.step.resolution
        )?.narration;
        if (!narration) continue;

        queue.push({
          ...narration,
          campaignCode: processedScenario.scenarioGuide.campaignGuide.campaignCycleCode(),
          campaignName: processedScenario.scenarioGuide.campaignGuide.campaignName(),
          scenarioName: processedScenario.scenarioGuide.scenarioName(),
        });
      } else if (scenarioStep.step.type === "story") {
        const narration = scenarioStep.step.narration;
        if (!narration) continue;

        queue.push({
          ...narration,
          campaignCode: processedScenario.scenarioGuide.campaignGuide.campaignCycleCode(),
          campaignName: processedScenario.scenarioGuide.campaignGuide.campaignName(),
          scenarioName: processedScenario.scenarioGuide.scenarioName(),
        });
      }
    }
    queueNarration(queue);
  }, [processedScenario]);


  const hasInterludeFaq = processedScenario.scenarioGuide.scenarioType() !== 'scenario' &&
    processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;
  return (
    <KeyboardAvoidingView
      style={[styles.keyboardView, backgroundStyle]}
      behavior="position"
      enabled
      keyboardVerticalOffset={100}
    >
      <KeepAwake />
      <NarratorView>
        <ScrollView contentContainerStyle={backgroundStyle}>
          { !!hasInterludeFaq && (
            <BasicButton
              title={t`Interlude FAQ`}
              onPress={showScenarioFaq}
            />
          ) }
          <StepsComponent
            componentId={componentId}
            width={width}
            steps={processedScenario.steps}
            switchCampaignScenario={switchCampaignScenario}
          />
          <View style={styles.footer} />
        </ScrollView>
      </NarratorView>
    </KeyboardAvoidingView>
  );
}

ScenarioView.options = () => {
  return dynamicOptions(false);
};

export default withScenarioGuideContext<InputProps>(ScenarioView);

const styles = StyleSheet.create({
  footer: {
    marginTop: 64,
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
