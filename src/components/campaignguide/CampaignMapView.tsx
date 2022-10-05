import React, { useCallback, useContext, useRef, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';
import { interpolate } from 'react-native-reanimated';
import PanPinchView from 'react-native-pan-pinch-view';
import PriorityQueue from 'priority-queue-typescript';
import { filter, find, forEach, indexOf, map, sumBy } from 'lodash';
import { t, ngettext, msgid } from 'ttag';
import FastImage from 'react-native-fast-image';

import { NavigationProps } from '@components/nav/types';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { DossierElement, Dossier, MapLabel, MapLocation } from '@data/scenario/types';
import { useDialog } from '@components/deck/dialogs';
import space, { s } from '@styles/space';
import { Navigation } from 'react-native-navigation';
import AppIcon from '@icons/AppIcon';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import { useBackButton, useNavigationButtonPressed } from '@components/core/hooks';
import { TouchableQuickSize } from '@components/core/Touchables';

import MapSvg from '../../../assets/map.svg';
import StrikeSvg from '../../../assets/strikethrough.svg';
import EncounterIcon from '@icons/EncounterIcon';
import COLORS from '@styles/colors';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import colors from '@styles/colors';

const PAPER_TEXTURE = require('../../../assets/paper.jpeg');

function BorderBox({ children, locked, visited }: { children: React.ReactNode; locked: boolean; visited: boolean }) {
  const bgColor = locked ? '#394852' : '#F5F0E1';
  const size = 6;
  const [dimensions, setDimensions] = useState<{ width: number; height: number}>();
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setDimensions({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
  }, [setDimensions]);
  const opacity = useMemo(() => {
    if (!dimensions) {
      return 0;
    }
    return visited ? 0.5 : 0.8;
  }, [dimensions, visited])
  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        padding: 2,
        paddingLeft: 4,
        paddingRight: 4,
      }}
      onLayout={onLayout}
    >
      <View
        style={{ position: 'absolute', top: 0, left: 0, width: dimensions?.width, height: dimensions?.height }}
        opacity={opacity}
      >
        { !!dimensions && (
          <>
            <View style={{ position: 'absolute', top: size - 1, left: 0, width: size, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: size - 1, right: 0, width: size, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: 0, left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: size, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', bottom: 0, left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: size, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: size - 1 , left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
          </>
        ) }
        <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}><AppIcon name="label_tl_bg" color={bgColor} size={size} /></View>
        <View style={{ position: 'absolute', top: 0, right: 0, width: size, height: size }}><AppIcon name="label_tr_bg" color={bgColor} size={size} /></View>
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: size, height: size }}><AppIcon name="label_bl_bg" color={bgColor} size={size} /></View>
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: size, height: size }}><AppIcon name="label_br_bg" color={bgColor} size={size} /></View>
      </View>
      { !locked && (
        <>
          { !!dimensions && (
            <>
              <View style={{ position: 'absolute', top: size - 1, left: 1, width: 1, height: dimensions.height - size * 2 + 2, backgroundColor: '#656C6F' }} />
              <View style={{ position: 'absolute', top: size - 1, right: 1, width: 1, height: dimensions.height - size * 2 + 2, backgroundColor: '#656C6F' }} />
              <View style={{ position: 'absolute', top: 1, left: size - 1, width: dimensions.width - size * 2 + 2, height: 1, backgroundColor: '#656C6F' }} />
              <View style={{ position: 'absolute', bottom: 1, left: size - 1, width: dimensions.width - size * 2 + 2, height: 1, backgroundColor: '#656C6F' }} />
            </>
          ) }
          <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}>
            <AppIcon name="label_tl_bd" color="#656C6F" size={size} />
          </View>
          <View style={{ position: 'absolute', top: 0, right: 0, width: size, height: size }}>
            <AppIcon name="label_tr_bd" color="#656C6F" size={size} />
          </View>
          <View style={{ position: 'absolute', bottom: 0, left: 0, width: size, height: size }}>
            <AppIcon name="label_bl_bd" color="#656C6F" size={size} />
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: size, height: size }}>
            <AppIcon name="label_br_bd" color="#656C6F" size={size} />
          </View>
        </>
      ) }
      { children }
    </View>
  )
}

export interface CampaignMapProps extends CampaignGuideInputProps {
  onSelect?: (location: MapLocation, time: number, fast: boolean) => void;
  currentLocation: string | undefined;
  currentTime: number | undefined;
  hasFast: boolean;
  visitedLocations: string[];
  unlockedLocations: string[];
  unlockedDossiers: string[]
}


interface MapLabelProps {
  label: MapLabel;
  campaignWidth: number;
  widthRatio: number;
  heightRatio: number;
}

const fontTypeStyles = {
  connection: {
    fontSize: 18,
    lineHeight: 20,
    opacity: 0.7,
  },
  ocean: {
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 4,
    fontStyle: 'italic',
    opacity: 0.2,
  },
  small_ocean: {
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 1.5,
    fontStyle: 'italic',
    opacity: 0.2,
  },
  country: {
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 1.5,
    opacity: 0.2,
  },
  continent: {
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 3,
    opacity: 0.2,
  },
}

const fontDirectionStyle: { [key: string]: TextStyle } = {
  left: {
    textAlign: 'left',
  },
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
}
function MapLabelComponent({
  campaignWidth,
  label,
  widthRatio,
  heightRatio,
}: MapLabelProps) {
  const lineHeight = fontTypeStyles[label.type].lineHeight;
  const numLines = sumBy(label.name, c => c === '\n' ? 1 : 0) + 1;
  return (
    <View style={[{
      position: 'absolute',
      top: label.y * heightRatio - lineHeight * numLines,
    }, label.direction === 'left' ? {
      right: (campaignWidth - label.x) * widthRatio,
    } : {
      left: label.x * widthRatio,
    }]}>
      <Text style={[
        {
          fontFamily: 'Times New Roman',
          color: '#24303C',
        },
        fontTypeStyles[label.type],
        fontDirectionStyle[label.direction],
      ]}>
        {label.name}
      </Text>
    </View>
  )
}

const statusColors = {
  locked: '#E75122',
  side: '#128C60',
  standard: '#2D529A',
}
interface PointOfInterestProps {
  location: MapLocation;
  currentLocation: boolean;
  campaignWidth: number;
  campaignHeight: number;
  widthRatio: number;
  heightRatio: number;
  onSelect: (location: MapLocation) => void;
  visited: boolean;
  status: 'standard' | 'locked' | 'side';
}
function PointOfInterest({
  campaignWidth,
  campaignHeight,
  location,
  currentLocation,
  widthRatio,
  heightRatio,
  onSelect,
  visited,
  status,
}: PointOfInterestProps) {
  const borderRadius = widthRatio * 1.25;
  const dotRadius = widthRatio * (status === 'side' ? 6 : 8);
  const onPress = useCallback(() => {
    onSelect(location);
  }, [location, onSelect]);
  const [textDimensions, setTextDimensions] = useState<{ width: number; height: number }>();
  const onLayoutLabel = useCallback((event: LayoutChangeEvent) => {
    setTextDimensions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  }, [setTextDimensions]);

  if (status === 'locked' && location.hidden) {
    // Hidden locations.
    return null;
  }
  return (
    <View style={[{
      position: 'absolute',
      top: location.y * heightRatio - dotRadius - 3,
    }, location.direction === 'left' ? {
      right: (campaignWidth - location.x) * widthRatio - dotRadius - 3,
    } : {
      left: location.x * widthRatio - dotRadius - 4,
    }]}>
      <TouchableQuickSize onPress={onPress} activeScale={1.05}>
        <BorderBox locked={status === 'locked'} visited={visited && !currentLocation}>
          <View style={{
            flexDirection: location.direction === 'left' ? 'row' : 'row-reverse',
            justifyContent: 'flex-end',
            paddingTop: 1,
            paddingBottom: 1,
          }}>
            <View style={[
              {
                position: 'relative',
                alignItems: 'center',
              },
              location.direction === 'left' ? {
                marginRight: 2,
                paddingLeft: borderRadius * 2,
                justifyContent: 'flex-end',
              } : {
                marginLeft: 2,
                paddingRight: borderRadius * 2,
                justifyContent: 'flex-start',
              },
            ]}>
              <Text style={[
                { fontFamily: 'TT2020 Style E' },
                { color: status === 'locked' ? '#E6E1D3' : '#24303C' },
                visited && !currentLocation ? { opacity: 0.5 } : undefined,
                {
                  fontSize: dotRadius * 2 * 0.90,
                  lineHeight: dotRadius * 2,
                  textAlign: location.direction === 'left' ? 'right' : 'left',
                },
              ]} onLayout={onLayoutLabel}>
                { location.name }
              </Text>
              { visited && !currentLocation && !!textDimensions && (
                <View style={{ position: 'absolute', top: 0, left: 2, width: textDimensions.width, height: textDimensions.height }}>
                  <StrikeSvg width={textDimensions.width} height={textDimensions.height} color="black" />
                </View>
              ) }
            </View>
            <View
              style={{ width: dotRadius * 2, height: dotRadius * 2 }}
              opacity={visited && !currentLocation ? 0.5 : 1}
            >
              <AppIcon
                color={statusColors[status]}
                size={dotRadius * 2}
                name={`poi_${status}`}
              />
            </View>
          </View>
        </BorderBox>
      </TouchableQuickSize>
    </View>
  );
}

function CurrentLocationPin({ location, campaignWidth, campaignHeight, widthRatio, heightRatio }: { location: MapLocation; campaignWidth: number; campaignHeight: number; widthRatio: number; heightRatio: number }) {
  const pinSize = widthRatio * 8;
  return (
    <>
      <Text style={[
        styles.textWithShadow,
        space.paddingSideS,
        { position: 'absolute', flexDirection: 'row', justifyContent: 'center' },
          location.direction === 'left' ? {
            right: (campaignWidth - location.x) * widthRatio - pinSize - 2 - s,
          } : {
            left: location.x * widthRatio - pinSize - 2 - s,
          },
          location.current === 'down' ? {
            top: location.y * heightRatio - s,
            paddingTop: s,
            textShadowOffset: {
              width: 0,
              height: -2,
            },
          } : {
            bottom: (campaignHeight - location.y) * heightRatio - s,
            paddingBottom: s,
            textShadowOffset: {
              width: 0,
              height: 2,
            },
          },
      ]}>
        <AppIcon name={`${location.current || 'up'}_pin`} size={pinSize * 4} color={COLORS.D20} />
      </Text>

      <View style={[
        { position: 'absolute', },
        location.direction === 'left' ? {
          right: (campaignWidth - location.x) * widthRatio - pinSize,
        } : {
          left: location.x * widthRatio - pinSize,
        },
        location.current === 'down' ? {
          top: location.y * heightRatio + pinSize * 1.5,
        } : {
          bottom: (campaignHeight - location.y) * heightRatio + pinSize * 1.5,
        },
      ]}>
        <AppIcon name="investigator" size={pinSize * 2} color={COLORS.L30} />
      </View>
    </>
  );
}

interface Path {
  time: number;
  path: string[];
}

function findShortestPath(start: string, end: string, allLocations: MapLocation[]): Path | undefined{
  if (start === end) {
    return {
      path: [start],
      time: 0,
    };
  }
  const locationsById: { [id: string]: MapLocation } = {};
  forEach(allLocations, l => {
    locationsById[l.id] = l;
  });

  const queue = new PriorityQueue<Path>(10, (pathA: Path, pathB: Path) => pathA.time - pathB.time);
  const startLocation = locationsById[start];
  forEach(startLocation.connections, connection => {
    queue.add({
      path: [start, connection],
      time: 1,
    });
  });
  while (!queue.empty()) {
    const shortestCurrent: Path | null = queue.poll();
    if (shortestCurrent) {
      if (indexOf(shortestCurrent.path, end) !== -1) {
        return shortestCurrent;
      }
      const last = shortestCurrent.path[shortestCurrent.path.length - 1];
      const lastLocation = locationsById[last];
      forEach(lastLocation.connections, location => {
        if (indexOf(shortestCurrent.path, location) === -1) {
          // Add it to list if we don't have a loop;
          // Side locations only cost 1 time even when you pass through them.
          queue.add({
            path: [...shortestCurrent.path, location],
            time: shortestCurrent.time + (lastLocation.status === 'side' ? 0 : 1) - (startLocation.hidden ? 1 : 0),
          });
        }
      })
    }
  }
  return undefined;
}

function DossierImage({
  uri,
  ratio,
  width,
  alignment,
}: {
  uri: string;
  alignment: 'right' | 'left';
  ratio: number;
  width: number;
}) {
  return (
    <View style={alignment === 'left' ? space.marginRightM : space.marginLeftM}>
      <View style={{ padding: 8, paddingBottom: 32, backgroundColor: COLORS.white, transform: [{ rotate: alignment === 'left' ? '-4deg' : '4deg' }] }}>
        <FastImage
          source={{ uri: `https://img.arkhamcards.com${uri}` }}
          style={{ width: width - 8 * 2, height: (width * ratio) - 8 * 2 }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}


function DossierComponent({ dossier, showCity }: { dossier: Dossier; idx: number; showCity: (city: string) => void }) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={[
      { flexDirection: 'column', backgroundColor: colors.L20 },
      space.paddingM,
      space.marginBottomM,
    ]}>
      <Text style={[typography.text, typography.bold]}>{dossier.title}</Text>
      { map(dossier.entries, (entry, idx) => <DossierEntryComponent element={entry} key={idx} showCity={showCity} />)}
    </View>
  );
}



function DossierEntryComponent({
  element: {
    image,
    text,
    reference,
  },
  showCity,
}: {
  showCity: (city: string) => void;
  element: DossierElement;
}) {
  const { width } = useContext(StyleContext);
  const onPress = useCallback(() => {
    if (reference) {
      showCity(reference.city);
    }
  }, [reference, showCity]);
  if (image) {
    return (
      <View style={{ flexDirection: image?.alignment === 'left' ? 'row-reverse' : 'row' }}>
        { !!text && (
          <View style={{ flex: 1 }}>
            <CampaignGuideTextComponent text={text} />
          </View>
        ) }
        { !!image && (
          <View style={space.marginBottomS}>
            <DossierImage
              uri={image.uri}
              ratio={image.ratio}
              alignment={image.alignment}
              width={(width - s * 4) / 2.5}
            />
          </View>
        ) }
      </View>
    );
  }
  if (text) {
    return (
      <CampaignGuideTextComponent text={text} />
    );
  }
  if (reference) {
    return (
      <View style={space.paddingTopS}>
        <DeckButton
          icon="search"
          title={reference.name}
          onPress={onPress}
        />
      </View>
    );
  }
  return null;
}

function LocationContent({
  location,
  allLocations,
  currentLocation,
  setCurrentLocation,
  visited,
  status,
  hasFast,
  showCity,
  unlockedDossiers,
}: {
  allLocations?: MapLocation[];
  location: MapLocation;
  currentLocation: MapLocation | undefined;
  unlockedDossiers: string[],
  visited: boolean;
  setCurrentLocation?: (location: MapLocation, distance: number | undefined, fast: boolean) => void;
  status: 'standard' | 'side' | 'locked';
  hasFast: boolean;
  showCity: (city: string) => void;
}) {
  const { colors, typography, width } = useContext(StyleContext);
  const travelDistance = useMemo(() => {
    if (!currentLocation || !allLocations) {
      return undefined;
    }
    const shortestPath = findShortestPath(currentLocation.id, location.id, allLocations);
    return shortestPath?.time || 0;
  }, [currentLocation, allLocations, location]);
  const makeCurrent = useCallback(() => {
    setCurrentLocation?.(location, travelDistance, false);
  }, [setCurrentLocation, location, travelDistance]);
  const makeCurrentFast = useCallback(() => {
    setCurrentLocation?.(location, 1, true);
  }, [setCurrentLocation, location]);

  const atLocation = currentLocation?.id === location.id;
  const dossier = useMemo(() => {
    return filter(location.dossier, d => {
      return !d.locked || !!find(unlockedDossiers, u => u === d.locked);
    })
  }, [location.dossier, unlockedDossiers]);
  const travelSection = useMemo(() => {
    if (atLocation) {
      return (
        <View style={[{ flexDirection: 'row' }, space.paddingTopS, space.paddingBottomS]}>
          <DeckButton shrink thin icon="check-thin" color="light_gray" title={t`Currently here`} disabled />
        </View>
      );
    }
    if (visited) {
      return (
        <View style={[{ flexDirection: 'row' }, space.paddingTopS, space.paddingBottomS]}>
          <DeckButton shrink thin icon="check-thin" color="light_gray" title={t`Already visited`} disabled />
        </View>
      );
    }

    if (status === 'locked') {
      return (
        <>
          <View style={[{ flexDirection: 'row' }, space.paddingTopS, space.paddingBottomS]}>
            <DeckButton shrink thin icon="map" color="light_gray" title={t`Locked`} disabled />
          </View>
        </>

      );
    }
    if ((!currentLocation || !atLocation) && !visited) {
      return (
        <>
          { status === 'side' && (
            <>
              <Text style={typography.text}>
                { t`You may stop at this location to play a side-story. Passing through this location costs no additional time.` }
              </Text>
              <Text style={typography.text}>
                { t`As an additional cost to play the side-story, you must spend one time for each XP cost of the scenario.` }
              </Text>
            </>
          ) }
          { !!travelDistance && !!currentLocation && (
            <Text style={[typography.text, { }]} textBreakStrategy="highQuality">
              { t`Travel time:`} { ngettext(msgid`${travelDistance} day`, `${travelDistance} days`, travelDistance) }
            </Text>
          ) }
          { currentLocation?.id !== location.id && !!setCurrentLocation && !visited && (
            <View style={[{ flexDirection: 'row' }, space.paddingTopS, space.paddingBottomS]}>
              <DeckButton
                shrink
                thin
                icon="map"
                title={t`Travel here`}
                onPress={makeCurrent}
              />
              { !!hasFast && <DeckButton leftMargin={s} shrink thin icon="map" title={t`Travel here`} onPress={makeCurrentFast} /> }
            </View>
          ) }
        </>
      );
    }
  }, [location, makeCurrent, typography, travelDistance, currentLocation, visited, atLocation, setCurrentLocation]);
  return (
    <>
      <View style={[space.paddingSideS, { flexDirection: 'column', position: 'relative' }]}>
        <View style={{ position: 'absolute', top: 0, right: s }} opacity={0.15}>
          <EncounterIcon encounter_code={location.id} size={width / 3.5} color={colors.D20} />
        </View>
        <CardDetailSectionHeader title={t`Information`} />
        <Text style={typography.text}>
          {location.name}
        </Text>
        <Text style={typography.text}>
          {location.details.region.name}
        </Text>
        { !!location.details.country && (
          <Text style={typography.text}>
            {location.details.country.name}
          </Text>
        ) }
        {travelSection}
        { !!dossier.length && status !== 'locked' && (
          <View>
            <View style={space.paddingBottomS}>
              <CardDetailSectionHeader title={ngettext(msgid`Information`, `Information`, dossier.length)} />
            </View>
            { map(dossier, (entry, idx) => (
              <DossierComponent key={idx} dossier={entry} idx={idx} showCity={showCity} />
            )) }
          </View>
        ) }
      </View>
    </>
  );
}


function CampaignMapView(props: CampaignMapProps & NavigationProps) {
  const { componentId, onSelect, visitedLocations, unlockedLocations, unlockedDossiers, hasFast } = props;
  const { campaignGuide } = useContext(CampaignGuideContext);
  const campaignMap = campaignGuide.campaignMap();
  const currentLocation = useMemo(() => {
    return find(campaignMap?.locations, location => location.id === (props.currentLocation || 'london'));
  }, [campaignMap, props.currentLocation]);

  const { width, height } = useContext(StyleContext);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>();
  const setDialogVisibleRef = useRef<(visible: boolean) => void>();
  const onDismiss = useCallback(() => {
    setDialogVisibleRef.current?.(false);
    setTimeout(() => Navigation.dismissModal(componentId), 50);
    return true;
  }, [componentId]);

  const moveToLocation = useCallback((location: MapLocation, distance: number | undefined, fast: boolean) => {
    if (onSelect) {
      onSelect(location, distance || 1, fast);
      onDismiss();
    }
  }, [onSelect, onDismiss]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      onDismiss();
    }
  }, componentId, [onDismiss]);
  useBackButton(onDismiss);

  const showCity = useCallback((city: string) => {
    const location = find(campaignMap?.locations, l => l.id === city)
    if (location && pinchRef.current) {
      const campaignWidth = campaignMap?.width || 1;
      const campaignHeight = campaignMap?.height || 1;

      const x = interpolate(location.x * 1.0 / campaignWidth,
        [0, 1.0],
        [0, width - theWidth]
      );
      const y = interpolate(
        location.y * 1.0 / campaignHeight,
        [0, 1.0],
        [0, height - theHeight]);
      pinchRef.current.translateTo(x, y, false);
      setSelectedLocation(location);
    }
  }, [campaignMap, setSelectedLocation])

  const [theWidth, theHeight] = useMemo(() => {
    if (!campaignMap) {
      return [1, 1];
    }
    return [campaignMap.width * 1.0 / campaignMap.height * height, height];
  }, [campaignMap, height]);
  const clearSelection = useCallback(() => setSelectedLocation(undefined), []);
  const { dialog, showDialog, setVisible } = useDialog({
    title: selectedLocation?.name || '',
    content: !!selectedLocation && (
      <LocationContent
        location={selectedLocation}
        currentLocation={currentLocation}
        setCurrentLocation={onSelect ? moveToLocation : undefined}
        allLocations={campaignMap?.locations}
        hasFast={hasFast}
        unlockedDossiers={unlockedDossiers}
        visited={!!find(visitedLocations, loc => loc === selectedLocation.id)}
        status={(selectedLocation.status === 'locked' && !!find(unlockedLocations, loc => loc === selectedLocation.id) ? 'standard' : undefined) || selectedLocation.status}
        showCity={showCity}
      />
    ),
    dismiss: {
      onPress: clearSelection,
    },
    alignment: 'bottom',
    allowDismiss: true,
  });
  useEffect(() => {
    setDialogVisibleRef.current = setVisible;
  }, [setVisible]);
  const widthRatio = theWidth * 1.0 / (campaignMap?.width || 1);
  const heightRatio = theHeight * 1.0 / (campaignMap?.height || 1);

  useEffect(() => {
    if (selectedLocation) {
      showDialog();
    }
  }, [selectedLocation, showDialog]);
  const pinchRef = useRef<any>();

  useEffect(() => {
    if (currentLocation && pinchRef.current) {
      const campaignWidth = campaignMap?.width || 1;
      const campaignHeight = campaignMap?.height || 1;

      const x = interpolate(currentLocation.x * 1.0 / campaignWidth,
        [0, 1.0],
        [0, width - theWidth]
      );
      const y = interpolate(
        currentLocation.y * 1.0 / campaignHeight,
        [0, 1.0],
        [0, height - theHeight]);
      pinchRef.current.translateTo(x, y, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);
  if (!campaignMap) {
    return <Text>No map</Text>;
  }
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <PanPinchView
        ref={pinchRef}
        minScale={1}
        maxScale={4}
        initialScale={1.0}
        containerDimensions={{ width, height }}
        contentDimensions={{ width: theWidth, height: theHeight }}
      >
        <View style={{ width: theWidth, height: theHeight, position: 'relative' }}>
          <MapSvg width={theWidth} height={theHeight} viewBox="0 0 1893 988" />
          { map(campaignMap.labels, (label, idx) => (
            <MapLabelComponent
              key={idx}
              campaignWidth={campaignMap.width}
              label={label}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
            />
          )) }
          <View style={[styles.texture, { width: theWidth, height: theHeight }]} opacity={0.25}>
            <FastImage
              source={PAPER_TEXTURE}
              style={{ width: theWidth, height: theHeight }}
              resizeMode="cover"
            />
          </View>
          { map(campaignMap.locations, (location) => (
            <PointOfInterest
              key={location.id}
              currentLocation={!!currentLocation && currentLocation.id === location.id}
              campaignWidth={campaignMap.width}
              campaignHeight={campaignMap.height}
              location={location}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
              onSelect={setSelectedLocation}
              visited={!!find(visitedLocations, loc => loc === location.id)}
              status={(location.status === 'locked' && !!find(unlockedLocations, loc => loc === location.id) ? 'standard' : undefined) || location.status}
            />
          )) }
          { !!currentLocation && (
            <CurrentLocationPin
              location={currentLocation}
              campaignWidth={campaignMap.width}
              campaignHeight={campaignMap.height}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
           />
          ) }
        </View>
      </PanPinchView>
      { dialog }
    </View>
  );
}

export default withCampaignGuideContext(
  CampaignMapView,
  { rootView: false }
);

const styles = StyleSheet.create({
  texture: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textWithShadow:{
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 2,
    elevation: 2,
  }
});
