import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { findIndex } from 'lodash';

import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { ShowAlert } from '@components/deck/dialogs';
import ScenarioCard from './ScenarioCard';
import space, { m } from '@styles/space';
import { useComponentVisible } from '@components/core/hooks';
import { showScenario } from '../nav';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  showLinkedScenario?: (scenarioId: string) => void;
  showAlert: ShowAlert;
}

export default function ScenarioCarouselComponent({
  componentId,
  processedCampaign,
  showLinkedScenario,
  showAlert,
}: Props) {
  const { width } = useContext(StyleContext);
  const { campaignState, campaignGuide, campaignId } = useContext(CampaignGuideContext);
  const carousel = useRef<Carousel<ProcessedScenario>>(null);
  const scenarioPressed = useRef<boolean>(false);
  const visible = useComponentVisible(componentId);

  const onShowLinkedScenario = useCallback((scenarioId: string) => {
    scenarioPressed.current = true;
    showLinkedScenario && showLinkedScenario(scenarioId);
  }, [showLinkedScenario]);
  const onShowScenario = useCallback((scenario: ProcessedScenario) => {
    scenarioPressed.current = true;
    showScenario(
      componentId,
      scenario,
      campaignId,
      campaignState,
      showLinkedScenario ? campaignGuide.campaignName() : undefined,
      showLinkedScenario ? onShowLinkedScenario : undefined
    );
  }, [componentId, campaignId, campaignGuide, showLinkedScenario, onShowLinkedScenario, campaignState]);
  useEffect(() => {
    if (visible) {
      if (scenarioPressed.current) {
        scenarioPressed.current = false;
        const scenarioIndex = findIndex(processedCampaign.scenarios, s => s.type === 'playable' || s.type === 'started');
        if (carousel.current) {
          carousel.current.snapToItem(scenarioIndex);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  const [selectedIndex, setIndex] = useState(findIndex(processedCampaign.scenarios, s => s.type === 'playable' || s.type === 'started'));
  const renderScenario = useCallback(({ item, index }: { item: ProcessedScenario; index: number; dataIndex: number }) => {
    return (
      <ScenarioCard
        key={index}
        showScenario={onShowScenario}
        scenario={item}
        showAlert={showAlert}
        processedCampaign={processedCampaign}
        componentId={componentId}
      />
    );
  }, [onShowScenario, showAlert, processedCampaign, componentId]);
  return (
    <Carousel
      ref={carousel}
      vertical={false}
      itemWidth={width - m * 3}
      sliderWidth={width}
      contentContainerCustomStyle={space.paddingSideS}
      firstItem={selectedIndex}
      shouldOptimizeUpdates
      enableSnap
      disableIntervalMomentum
      data={processedCampaign.scenarios}
      renderItem={renderScenario}
      onScrollIndexChanged={setIndex}
    />
  );
}
