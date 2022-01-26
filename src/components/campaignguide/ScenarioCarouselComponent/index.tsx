import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { Platform } from 'react-native';
import { dropRightWhile, findIndex, findLastIndex } from 'lodash';

import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { ShowAlert } from '@components/deck/dialogs';
import ScenarioCard from './ScenarioCard';
import space, { m } from '@styles/space';
import { useComponentVisible, useEffectUpdate } from '@components/core/hooks';
import { showScenario } from '../nav';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  displayLinkScenarioCount?: number;
  showLinkedScenario?: (scenarioId: string) => void;
  showAlert: ShowAlert;
}

function getActiveIndex(scenarios: ProcessedScenario[]) {
  const index = findIndex(scenarios, s =>
    s.type === 'playable' || s.type === 'started' || s.type === 'placeholder');
  if (index !== -1) {
    return index;
  }
  const lastIndex = findLastIndex(scenarios, s => s.type === 'completed');
  if (lastIndex !== -1) {
    return lastIndex;
  }
  return scenarios.length - 1;
}

interface ScenarioItem {
  item: ProcessedScenario;
  index: number;
}
export default function ScenarioCarouselComponent({
  componentId,
  processedCampaign,
  displayLinkScenarioCount,
  showLinkedScenario,
  showAlert,
}: Props) {
  const { width } = useContext(StyleContext);
  const { campaignState, campaignGuide, campaignId } = useContext(CampaignGuideContext);
  const carousel = useRef<Carousel<ProcessedScenario>>(null);
  const scenarioPressed = useRef<boolean>(false);
  const visible = useComponentVisible(componentId);
  useEffectUpdate(() => {
    setTimeout(() => {
      scenarioPressed.current = true;
    }, 500);
  }, [displayLinkScenarioCount]);

  const onShowLinkedScenario = useCallback((scenarioId: string) => {
    scenarioPressed.current = true;
    showLinkedScenario && showLinkedScenario(scenarioId);
  }, [showLinkedScenario]);
  const onShowScenario = useCallback((scenario: ProcessedScenario) => {
    if (scenario.type !== 'completed') {
      scenarioPressed.current = true;
    }
    showScenario(
      componentId,
      scenario,
      campaignId,
      campaignState,
      showLinkedScenario ? campaignGuide.campaignName() : undefined,
      showLinkedScenario ? onShowLinkedScenario : undefined,
      processedCampaign
    );
  }, [componentId, campaignId, campaignGuide, showLinkedScenario, onShowLinkedScenario, campaignState, processedCampaign]);
  const activeIndex = useMemo(() => getActiveIndex(processedCampaign.scenarios), [processedCampaign.scenarios]);
  const [selectedIndex, setIndex] = useState(activeIndex);
  useEffectUpdate(() => {
    if (visible) {
      if (scenarioPressed.current) {
        scenarioPressed.current = false;
        if (carousel.current && selectedIndex !== activeIndex) {
          const activeIndex = getActiveIndex(processedCampaign.scenarios)
          carousel.current.snapToItem(activeIndex, true, false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const numScenarios = processedCampaign.scenarios.length;
  const lastCompletedIndex = dropRightWhile(processedCampaign.scenarios, s => s.type === 'skipped').length - 1;
  const renderScenario = useCallback(({ item, index }: ScenarioItem) => {
    return (
      <ScenarioCard
        key={index}
        showScenario={onShowScenario}
        scenario={item}
        showAlert={showAlert}
        processedCampaign={processedCampaign}
        componentId={componentId}
        isActive={index === activeIndex}
        last={index === numScenarios - 1}
        finalScenario={index === lastCompletedIndex}
      />
    );
  }, [onShowScenario, showAlert, processedCampaign, componentId, lastCompletedIndex, numScenarios, activeIndex]);
  return (
    <Carousel
      ref={carousel}
      vertical={false}
      itemWidth={width - m * 3}
      sliderWidth={width}
      contentContainerCustomStyle={space.paddingSideS}
      firstItem={selectedIndex}
      useExperimentalSnap={Platform.OS === 'android'}
      useScrollView
      disableIntervalMomentum
      initialNumToRender={processedCampaign.scenarios.length}
      data={processedCampaign.scenarios}
      renderItem={renderScenario}
      onSnapToItem={setIndex}
    />
  );
}
