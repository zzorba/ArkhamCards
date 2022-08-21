import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { Platform } from 'react-native';
import { dropRightWhile, find, findIndex, findLast, findLastIndex, map } from 'lodash';
import { t } from 'ttag';

import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { ShowAlert } from '@components/deck/dialogs';
import ScenarioCard from './ScenarioCard';
import space, { m } from '@styles/space';
import { useComponentVisible, useEffectUpdate } from '@components/core/hooks';
import { showScenario } from '../nav';
import EmbarkCard from './EmbarkCard';
import { MapLocation } from '@data/scenario/types';
import { Navigation, OptionsModalPresentationStyle } from 'react-native-navigation';
import { CampaignMapProps } from '../CampaignMapView';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { EmbarkData } from '@actions/types';
import { AddSideScenarioProps } from '../AddSideScenarioView';

interface Props {
  componentId: string;
  processedCampaign: ProcessedCampaign;
  displayLinkScenarioCount?: number;
  showLinkedScenario?: (scenarioId: string) => void;
  showAlert: ShowAlert;
}


interface ScenarioItem {
  type: 'scenario';
  scenario: ProcessedScenario;
}

interface EmbarkItem {
  type: 'embark';
}

type CarouselItem = ScenarioItem | EmbarkItem;

function getActiveIndex(items: CarouselItem[]) {
  const index = findIndex(items, s => {
    switch (s.type) {
      case 'scenario':
        return (
          s.scenario.type === 'playable' || s.scenario.type === 'started' || s.scenario.type === 'placeholder'
        );
      case 'embark':
        return true;
    }
  });
  if (index !== -1) {
    return index;
  }
  const lastIndex = findLastIndex(items, s => s.type === 'scenario' && s.scenario.type === 'completed');
  if (lastIndex !== -1) {
    return lastIndex;
  }
  return items.length - 1;
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
  const campaignMap = useMemo(() => campaignGuide.campaignMap(), [campaignGuide]);
  const carousel = useRef<Carousel<CarouselItem>>(null);
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
  const currentLocationId = processedCampaign.campaignLog.campaignData.location;
  const interScenarioId = useMemo(() => {
    if (processedCampaign && !find(processedCampaign.scenarios, scenario => scenario.type === 'started') &&
      !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed')) {
      return findLast(processedCampaign.scenarios, s => s.type === 'completed')?.id;
    }
    return undefined;
  }, [processedCampaign]);
  const currentTime = processedCampaign.campaignLog.count('time', '$count');

  const onEmbarkSide = useCallback(({ destination, time, previousScenarioId, nextScenario }: EmbarkData, xp_cost: number): EmbarkData | undefined => {
    const embarkData: EmbarkData = {
      destination,
      previousScenarioId,
      nextScenario,
      time: time + xp_cost,
    };
    if (campaignMap) {
      if (currentTime + embarkData.time >= campaignMap.max_time) {
        embarkData.nextScenario = campaignMap.final_scenario;
        campaignState.startScenario(campaignMap.final_scenario, embarkData);
        return undefined;
      }
    }
    return embarkData;
  }, [campaignState, currentTime, campaignMap])

  const onEmbark = useCallback((location: MapLocation, timeSpent: number) => {
    if (interScenarioId && campaignMap) {
      const embarkData: EmbarkData = {
        destination: location.id,
        time: timeSpent,
        previousScenarioId: interScenarioId.encodedScenarioId,
        nextScenario: location.scenario,
      };
      if (currentTime + timeSpent >= campaignMap.max_time) {
        // You got redirected fool, out of time sucker...
        embarkData.nextScenario = campaignMap.final_scenario;
        campaignState.startScenario(campaignMap.final_scenario, embarkData);
      } else if (location.scenario === '$side_scenario') {
        Navigation.push<AddSideScenarioProps>(componentId, {
          component: {
            name: 'Guide.SideScenario',
            passProps: {
              campaignId,
              latestScenarioId: interScenarioId,
              embarkData: embarkData,
              onEmbarkSide,
            },
            options: {
              topBar: {
                title: {
                  text: t`Choose Side-Scenario`,
                },
                subtitle: {
                  text: location.name,
                },
                backButton: {
                  title: t`Back`,
                },
              },
            },
          },
        });
      } else {
        campaignState.startScenario(location.scenario, embarkData);
      }
    }
  }, [onEmbarkSide, componentId, campaignId, campaignState, interScenarioId, currentTime, campaignMap]);

  const onShowEmbark = useCallback(() => {
    scenarioPressed.current = true;
    const passProps: CampaignMapProps = {
      campaignId,
      currentLocation: currentLocationId,
      currentTime: processedCampaign.campaignLog.count('time', '$count'),
      onSelect: onEmbark,
      visitedLocations: processedCampaign.campaignLog.campaignData.visitedLocations,
    };
    Navigation.showModal<CampaignMapProps>({
      stack: {
        children: [{
          component: {
            name: 'Campaign.Map',
            passProps,
            options: {
              topBar: {
                title: {
                  text: t`Map`,
                },
                leftButtons: [{
                  icon: iconsMap.dismiss,
                  id: 'close',
                  color: COLORS.M,
                  accessibilityLabel: t`Close`,
                }],
              },
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.fullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }, [campaignId, currentLocationId, onEmbark, processedCampaign]);

  const data = useMemo(() => {
    const items: (ScenarioItem | EmbarkItem)[] = map(processedCampaign.scenarios, scenario => {
      return {
        type: 'scenario',
        scenario,
      };
    });
    const noInProgress = !find(processedCampaign.scenarios, scenario => scenario.type === 'started');
    if (noInProgress && processedCampaign.campaignLog.campaignData.embark) {
      items.push({
        type: 'embark',
      });
    }
    return items;
  }, [processedCampaign]);
  const activeIndex = useMemo(() => getActiveIndex(data), [data]);
  const [selectedIndex, setIndex] = useState(activeIndex);
  useEffectUpdate(() => {
    if (visible) {
      if (scenarioPressed.current) {
        scenarioPressed.current = false;
        if (carousel.current && selectedIndex !== activeIndex) {
          const activeIndex = getActiveIndex(data)
          carousel.current.snapToItem(activeIndex, true, false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const numScenarios = processedCampaign.scenarios.length;
  const lastCompletedIndex = dropRightWhile(processedCampaign.scenarios, s => s.type === 'skipped').length - 1;
  const currentLocation = useMemo(() => {
    const current = processedCampaign.campaignLog.campaignData.location;
    return current ? find(campaignGuide.campaignMap()?.locations, location => location.id === current) : undefined;
  }, [campaignGuide, processedCampaign.campaignLog.campaignData.location]);
  const renderScenario = useCallback(({ item, index }: { item: CarouselItem; index: number }) => {
    switch (item.type) {
      case 'scenario':
        return (
          <ScenarioCard
            key={index}
            showScenario={onShowScenario}
            scenario={item.scenario}
            campaignMap={campaignMap}
            showAlert={showAlert}
            processedCampaign={processedCampaign}
            componentId={componentId}
            isActive={index === activeIndex}
            last={index === numScenarios - 1}
            finalScenario={index === lastCompletedIndex}
          />
        );
      case 'embark':
        return (
          <EmbarkCard
            key={index}
            currentLocation={currentLocation}
            onPress={onShowEmbark}
            isActive={index === activeIndex}
            last={index === numScenarios - 1}
          />
        );
    }
  }, [onShowScenario, showAlert, onShowEmbark, processedCampaign, componentId,
    campaignMap,currentLocation, lastCompletedIndex, numScenarios, activeIndex]);
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
      data={data}
      renderItem={renderScenario}
      onSnapToItem={setIndex}
    />
  );
}
