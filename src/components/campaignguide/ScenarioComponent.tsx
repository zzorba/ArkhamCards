import React, { useCallback, useContext, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { last } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';
import { useSelector } from 'react-redux';

import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import CampaignGuideContext from './CampaignGuideContext';
import StepsComponent from './StepsComponent';
import { hasDissonantVoices } from '@reducers';
import BasicButton from '@components/core/BasicButton';
import { NavigationProps } from '@components/nav/types';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { useNavigationButtonPressed } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import NarrationWrapper, { NarrationTrack, setNarrationQueue } from '@components/campaignguide/NarrationWrapper';
import { SHOW_DISSONANT_VOICES } from '@lib/audio/narrationPlayer';
import ScenarioStep from '@data/scenario/ScenarioStep';
import ScenarioGuideContext from './ScenarioGuideContext';
import { ProcessedScenario } from '@data/scenario';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { showGuideCampaignLog } from '@components/campaign/nav';

interface ScenarioProps {
  standalone: boolean;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
  footer?: React.ReactNode;
}
type Props = NavigationProps & ScenarioProps;

function getNarrationQueue(processedScenario: ProcessedScenario, scenarioState: ScenarioStateHelper) {
  const campaignCode = processedScenario.scenarioGuide.campaignGuide.campaignCycleCode();
  const campaignName = processedScenario.scenarioGuide.campaignGuide.campaignName();
  const scenarioName = processedScenario.scenarioGuide.scenarioName();

  const queue: NarrationTrack[] = [];
  const scenarioSteps: ScenarioStep[] = [];
  for (const scenarioStep of processedScenario.steps) {
    if (scenarioStep.step.type === 'effects') {
      for (const effectsWithInput of scenarioStep.step.effectsWithInput) {
        for (const effect of effectsWithInput.effects) {
          if ('steps' in effect) {
            scenarioSteps.push(...processedScenario.scenarioGuide.expandSteps(
              effect.steps,
              scenarioState,
              scenarioStep.campaignLog
            ));
          }
        }
      }
    } else {
      scenarioSteps.push(scenarioStep);
    }
  }
  for (const scenarioStep of scenarioSteps) {
    switch(scenarioStep.step.type) {
      case 'resolution': {
        const narration = processedScenario.scenarioGuide.resolution(
          scenarioStep.step.resolution
        )?.narration;
        if (narration) {
          queue.push({
            ...narration,
            campaignCode,
            campaignName,
            scenarioName,
          });
        }
        break;
      }
      case 'story':
      case 'branch':
      case 'input': {
        const narration = scenarioStep.step.narration;
        if (narration) {
          queue.push({
            ...narration,
            campaignCode,
            campaignName,
            scenarioName,
          });
        }
      }
    }
  }
  return queue;
}

const RESET_ENABLED = false;
export function dynamicOptions(undo: boolean) {
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


export default function ScenarioComponent({ componentId, showLinkedScenario, standalone, footer }: Props) {
  const { campaignState, campaignId } = useContext(CampaignGuideContext);
  const { processedScenario, scenarioState } = useContext(ScenarioGuideContext);
  const { backgroundStyle, width } = useContext(StyleContext);
  const scenarioId = processedScenario.id.encodedScenarioId;
  useEffect(() => {
    if (standalone && processedScenario.type !== 'started' && processedScenario.type !== 'completed') {
      campaignState.startScenario(scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    Navigation.mergeOptions(componentId, dynamicOptions(processedScenario.canUndo));
  }, [componentId, processedScenario.canUndo]);

  const menuPressed = useCallback(() => {
    const log = last(processedScenario.steps);
    if (!log) {
      return;
    }
    showGuideCampaignLog(
      componentId,
      campaignId,
      processedScenario.scenarioGuide.campaignGuide,
      log.campaignLog,
      standalone,
      scenarioId
    );
  }, [componentId, processedScenario, campaignId, scenarioId, standalone]);

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
  }, componentId, [resetPressed, menuPressed, undoPressed], 100);


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
  const hasDS = useSelector(hasDissonantVoices);

  useEffect(() => {
    if (!hasDS || !SHOW_DISSONANT_VOICES) {
      return;
    }
    const queue = getNarrationQueue(processedScenario, scenarioState);
    setNarrationQueue(queue);
  }, [processedScenario, scenarioState, hasDS]);

  const hasInterludeFaq = processedScenario.scenarioGuide.scenarioType() !== 'scenario' &&
    processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;
  const customData = processedScenario.scenarioGuide.scenarioCustomData();
  const downloadPressed = useCallback(() => {
    if (customData) {
      Linking.openURL(customData.download_link);
    }
  }, [customData]);
  return (
    <KeyboardAvoidingView
      style={[styles.keyboardView, backgroundStyle]}
      behavior="position"
      enabled
      keyboardVerticalOffset={100}
    >
      <KeepAwake />
      <NarrationWrapper>
        <ScrollView contentContainerStyle={backgroundStyle}>
          { !!customData && <BasicButton title={t`Download print and play cards`} onPress={downloadPressed} /> }
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
          { !!footer && footer }
        </ScrollView>
      </NarrationWrapper>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
