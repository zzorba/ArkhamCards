import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import SnapCarousel from 'react-native-snap-carousel';
import { Platform } from 'react-native';
import { dropRightWhile, find, findIndex, findLast, findLastIndex, map, sumBy } from 'lodash';
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
import { Navigation, OptionsModalPresentationStyle, OptionsModalTransitionStyle } from 'react-native-navigation';
import { CampaignMapProps } from '../CampaignMapView';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { EmbarkData } from '@actions/types';
import { AddSideScenarioProps } from '../AddSideScenarioView';
import { RUSSIAN_LOCATIONS } from '@components/campaign/constants';
import LanguageContext from '@lib/i18n/LanguageContext';

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


function russianDeparture(id: string, name: string | undefined) {
  const location = RUSSIAN_LOCATIONS[id]?.genitive ?? name;
  return t`Departing from ${location}`;
}


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
  const { lang } = useContext(LanguageContext);
  const { width } = useContext(StyleContext);
  const { campaignState, campaignGuide, campaignId } = useContext(CampaignGuideContext);
  const campaignMap = useMemo(() => campaignGuide.campaignMap(), [campaignGuide]);
  const carousel = useRef<SnapCarousel<CarouselItem>>(null);
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
  const currentLocationId = processedCampaign.campaignLog.campaignData.scarlet.location;
  const interScenarioId = useMemo(() => {
    if (processedCampaign && !find(processedCampaign.scenarios, scenario => scenario.type === 'started') &&
      !!find(processedCampaign.scenarios, scenario => scenario.type === 'completed')) {
      return findLast(processedCampaign.scenarios, s => s.type === 'completed')?.id;
    }
    return undefined;
  }, [processedCampaign]);
  const campaignLog = processedCampaign.campaignLog;

  const onEmbarkSide = useCallback(({ destination, time, previousScenarioId, nextScenario, fast }: EmbarkData, xp_cost: number): EmbarkData | undefined => {
    const embarkData: EmbarkData = {
      destination,
      previousScenarioId,
      departure: currentLocationId,
      nextScenario,
      time: time + xp_cost,
      fast,
      transit: false,
    };
    return embarkData;
  }, [currentLocationId])
  const onEmbark = useCallback((
    location: MapLocation,
    timeSpent: number,
    fast: boolean,
    transitOnly: boolean,
  ) => {
    if (interScenarioId && campaignMap) {
      const scenarioId = transitOnly ? 'travelling' : location.scenario;
      const attempt = campaignLog.scenarioStatus(scenarioId) === 'completed' ?
        sumBy(processedCampaign.scenarios, s => s.id.scenarioId === scenarioId ? 1 : 0) :
        undefined;
      const nextScenario = attempt ? `${scenarioId}#${attempt}` : scenarioId;
      const embarkData: EmbarkData = {
        destination: location.id,
        departure: currentLocationId,
        time: timeSpent,
        previousScenarioId: interScenarioId.encodedScenarioId,
        nextScenario,
        fast,
        transit: transitOnly,
      };
      if (scenarioId === '$side_scenario') {
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
        campaignState.startScenario(nextScenario, embarkData);
      }
    }
  }, [
    onEmbarkSide,
    componentId,
    processedCampaign,
    currentLocationId,
    campaignLog, campaignId, campaignState, interScenarioId, campaignMap]);

  const data = useMemo(() => {
    const items: (ScenarioItem | EmbarkItem)[] = map(processedCampaign.scenarios, scenario => {
      return {
        type: 'scenario',
        scenario,
      };
    });
    const noInProgress = !find(processedCampaign.scenarios, scenario => scenario.type === 'started');
    if (noInProgress && processedCampaign.campaignLog.campaignData.scarlet.embark) {
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
    const current = processedCampaign.campaignLog.campaignData.scarlet.location;
    return current ? find(campaignGuide.campaignMap()?.locations, location => location.id === current) : undefined;
  }, [campaignGuide, processedCampaign.campaignLog.campaignData.scarlet.location]);

  const onShowEmbark = useCallback(() => {
    if (campaignMap) {
      scenarioPressed.current = true;
      const investigators = processedCampaign.campaignLog.investigatorCodes(false);
      const hasFast = !!find(investigators, code => processedCampaign.campaignLog.hasCard(code, campaignMap.fast_code));
      const passProps: CampaignMapProps = {
        campaignId,
        campaignMap,
        currentLocation: currentLocationId,
        currentTime: campaignLog.count('time', '$count'),
        statusReports: campaignLog.calendarEntries('time'),
        onSelect: onEmbark,
        visitedLocations: processedCampaign.campaignLog.campaignData.scarlet.visitedLocations,
        unlockedLocations: processedCampaign.campaignLog.campaignData.scarlet.unlockedLocations,
        unlockedDossiers: processedCampaign.campaignLog.campaignData.scarlet.unlockedDossiers,
        hasFast,
      };
      const location = find(campaignMap.locations, location => location.id === currentLocationId)?.name;
      let subtitle = location ? t`Departing from ${location}` : undefined;
      if (lang === 'ru' && currentLocationId) {
        subtitle = russianDeparture(currentLocationId, location);
      }
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
                  subtitle: {
                    text: subtitle,
                  },
                  leftButtons: [{
                    icon: iconsMap.dismiss,
                    id: 'close',
                    color: COLORS.M,
                    accessibilityLabel: t`Close`,
                  }],
                },
                layout: {
                  backgroundColor: '0x8A9284',
                },
                modalPresentationStyle: Platform.OS === 'ios' ?
                  OptionsModalPresentationStyle.fullScreen :
                  OptionsModalPresentationStyle.overCurrentContext,
                modalTransitionStyle: OptionsModalTransitionStyle.crossDissolve,
              },
            },
          }],
        },
      });
    }
  }, [campaignMap, processedCampaign.campaignLog, campaignId, currentLocationId, campaignLog, onEmbark, lang]);

  // eslint-disable-next-line react/no-unused-prop-types
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
            last={index === numScenarios - 1}
          />
        );
    }
  }, [onShowScenario, showAlert, onShowEmbark, processedCampaign, componentId,
    campaignMap,currentLocation, lastCompletedIndex, numScenarios, activeIndex]);
  return (
    <SnapCarousel
      ref={carousel}
      vertical={false}
      itemWidth={width - m * 3}
      sliderWidth={width}
      contentContainerCustomStyle={space.paddingSideS}
      inactiveSlideOpacity={1}
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
