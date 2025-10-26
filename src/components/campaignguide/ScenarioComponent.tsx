import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { find, last } from 'lodash';

import { t } from 'ttag';
import KeepAwake from 'react-native-keep-awake';

import COLORS from '@styles/colors';
import CampaignGuideContext from './CampaignGuideContext';
import StepsComponent from './StepsComponent';
import StyleContext from '@styles/StyleContext';
import NarrationWrapper, { NarrationTrack } from '@components/campaignguide/NarrationWrapper';
import ScenarioStep from '@data/scenario/ScenarioStep';
import ScenarioGuideContext from './ScenarioGuideContext';
import { ProcessedScenario } from '@data/scenario';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { showGuideCampaignLog } from '@components/campaign/nav';
import ArkhamButton from '@components/core/ArkhamButton';
import { CustomData, Narration } from '@data/scenario/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useAudioAccess, useSetNarratinQueue } from '@lib/audio/narrationHelpers';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import RoundButton from '@components/core/RoundButton';
import AppIcon from '@icons/AppIcon';
import { m } from '@styles/space';
import { useNavigation } from '@react-navigation/native';
import HeaderButton from '@components/core/HeaderButton';

interface ScenarioProps {
  standalone: boolean;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
  footer?: React.ReactNode;
  onEditNamePressed?: () => void;
}
type Props = ScenarioProps;

export function getDownloadLink(lang: string, customData?: CustomData) {
  if (!customData?.download_link) {
    return undefined;
  }
  switch (lang) {
    case 'ko':
    case 'en':
    case 'zh':
    case 'zh-cn':
    case 'fr':
    case 'es':
    case 'pt':
    case 'uk':
    case 'de':
    case 'it':
    case 'ru':
    case 'vi':
    case 'pl':
      return customData.download_link[lang] || customData.download_link.en;
    default:
      return customData.download_link.en;
  }
}

function hasNarrationAccess(narration: Narration, narrationLangs: string[]): string | undefined {
  const set = new Set(narrationLangs);
  // Not every entry has a 'DissonantVoices' one present, due to some missing entries, sometimes in the original.
  return find(narration.lang, lang => set.has(lang));
}

function getNarrationQueue(processedScenario: ProcessedScenario, scenarioState: ScenarioStateHelper, narrationLangs: string[]) {
  const campaignCode = processedScenario.scenarioGuide.campaignGuide.campaignCycleCode();
  const campaignName = processedScenario.scenarioGuide.campaignGuide.campaignName();
  const scenarioName = processedScenario.scenarioGuide.scenarioName();

  const queue: NarrationTrack[] = [];
  const scenarioSteps: ScenarioStep[] = [];
  for (const scenarioStep of processedScenario.steps) {
    if (scenarioStep.step.type === 'effects') {
      for (const effectsWithInput of scenarioStep.step.effectsWithInput) {
        for (const effect of effectsWithInput.effects) {
          if (effect.type === 'story_step' && effect.steps) {
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
        const lang = narration ? hasNarrationAccess(narration, narrationLangs) : undefined;
        if (narration && lang) {
          queue.push({
            ...narration,
            campaignCode,
            campaignName,
            scenarioName,
            lang,
          });
        }
        break;
      }
      default: {
        const narration = scenarioStep.step.narration;
        const lang = narration ? hasNarrationAccess(narration, narrationLangs) : undefined;
        if (narration && lang) {
          queue.push({
            ...narration,
            campaignCode,
            campaignName,
            scenarioName,
            lang,
          });
        }
      }
    }
  }
  return queue;
}

export default function ScenarioComponent({ showLinkedScenario, standalone, footer, onEditNamePressed }: Props) {
  const { campaignState, campaignId } = useContext(CampaignGuideContext);
  const { processedScenario, processedCampaign, scenarioState } = useContext(ScenarioGuideContext);
  const { backgroundStyle, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const scenarioId = processedScenario.id.encodedScenarioId;
  useEffect(() => {
    if (standalone && processedScenario.type !== 'started' && processedScenario.type !== 'completed') {
      campaignState.startScenario(scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigation = useNavigation();

  const menuPressed = useCallback(() => {
    const log = last(processedScenario.steps);
    if (!log) {
      return;
    }
    showGuideCampaignLog(
      navigation,
      campaignId,
      processedScenario.scenarioGuide.campaignGuide,
      log.campaignLog,
      { standalone },
      scenarioId,
      processedCampaign
    );
  }, [navigation, processedCampaign, processedScenario, campaignId, scenarioId, standalone]);

  const undoPressed = useCallback(() => {
    campaignState.undo(scenarioId);
    if (processedScenario.closeOnUndo) {
      navigation.goBack();
    }
  }, [navigation, scenarioId, processedScenario.closeOnUndo, campaignState]);

  useLayoutEffect(() => {
    const rightButtons = [
      ...(!!onEditNamePressed ? [<HeaderButton key="edit" iconName="edit" color={COLORS.M} onPress={onEditNamePressed} accessibilityLabel={t`Edit Name`} />] : []),
      <HeaderButton key="log" iconName="log" color={COLORS.M} onPress={menuPressed} accessibilityLabel={t`Campaign Log`} />,
      ...(processedScenario.canUndo ? [<HeaderButton key="undo" iconName="undo" color={COLORS.M} onPress={undoPressed} accessibilityLabel={t`Undo`} />] : []),
    ];
    navigation.setOptions({
      headerRight: () => <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>{ rightButtons }</View>,
    });
  }, [onEditNamePressed, navigation, menuPressed, undoPressed, processedScenario.canUndo]);

  const switchCampaignScenario = useCallback(() => {
    navigation.goBack();
    if (showLinkedScenario) {
      showLinkedScenario(processedScenario.id.encodedScenarioId);
    }
  }, [navigation, showLinkedScenario, processedScenario.id]);

  const showScenarioFaq = useCallback(() => {
    navigation.navigate('Guide.ScenarioFaq', {
      scenario: processedScenario.id.scenarioId,
      campaignId,
    });
  }, [navigation, campaignId, processedScenario.id]);
  const [hasAudio, narrationLangs] = useAudioAccess()
  const setNarrationQueue = useSetNarratinQueue();
  useEffect(() => {
    if (!hasAudio) {
      return;
    }
    const queue = getNarrationQueue(processedScenario, scenarioState, narrationLangs);
    setNarrationQueue(queue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedScenario, scenarioState, hasAudio, narrationLangs]);

  const hasInterludeFaq = processedScenario.scenarioGuide.scenarioType() !== 'scenario' &&
    processedScenario.scenarioGuide.campaignGuide.scenarioFaq(processedScenario.id.scenarioId).length;
  const customData = processedScenario.scenarioGuide.scenarioCustomData();
  const downloadPressed = useCallback(() => {
    const link = getDownloadLink(lang, customData);
    if (link) {
      Linking.openURL(link);
    }
  }, [customData, lang]);
  const [showFAB, setShowFAB] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fabOpacity = useSharedValue(0)

  // Function to check if FAB should be visible
  const checkFABVisibility = useCallback(() => {
    if (contentHeight === 0 || scrollViewHeight === 0) {
      return;
    }

    const distanceFromBottom = contentHeight - (scrollY.current + scrollViewHeight);
    const shouldShowFAB = distanceFromBottom > 250;

    if (shouldShowFAB !== showFAB) {
      setShowFAB(shouldShowFAB);
      fabOpacity.value = withTiming(shouldShowFAB ? 1 : 0, {
        duration: 200,
      });
    }
  }, [setShowFAB, contentHeight, scrollViewHeight, showFAB, fabOpacity]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    scrollY.current = contentOffset.y;
    checkFABVisibility();
  }, [checkFABVisibility]);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [scrollViewRef]);

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      opacity: fabOpacity.value,
      transform: [
        {
          scale: interpolate(fabOpacity.value, [0, 1], [0.8, 1]),
        },
      ],
    };
  });

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentHeight(height);
    // Check FAB visibility when content size changes
    setTimeout(() => checkFABVisibility(), 0);
  }, [setContentHeight, checkFABVisibility]);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
    // Check FAB visibility when content size changes
    setTimeout(() => checkFABVisibility(), 0);
  }, [setScrollViewHeight, checkFABVisibility]);

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardView, backgroundStyle]}
      behavior="position"
      enabled
      keyboardVerticalOffset={100}
    >
      <KeepAwake />
      <NarrationWrapper>
        <View style={{ position: 'relative' }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={backgroundStyle}
            keyboardShouldPersistTaps="always"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={onContentSizeChange}
            onLayout={onLayout}
          >
            { !!customData && <ArkhamButton icon="world" title={t`Download print and play cards`} onPress={downloadPressed} /> }
            { !!hasInterludeFaq && (
              <ArkhamButton icon="faq" title={t`Interlude FAQ`} onPress={showScenarioFaq} />
            ) }
            <StepsComponent
              width={width}
              steps={processedScenario.steps}
              switchCampaignScenario={switchCampaignScenario}
            />
            { !!footer ? footer : <View style={{ height: 100 }} /> }
          </ScrollView>
          <View style={{ position: 'absolute', bottom: m, right: m }}>
            <Animated.View
              style={animatedFabStyle}
              pointerEvents={showFAB ? 'auto' : 'none'}
            >
              <RoundButton onPress={scrollToBottom}>
                <AppIcon name="expand_more" size={28} color={COLORS.D10} />
              </RoundButton>
            </Animated.View>
          </View>
        </View>
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
