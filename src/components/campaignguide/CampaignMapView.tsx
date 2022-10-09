import React, { useCallback, useContext, useRef, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Platform, ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';
import { interpolate } from 'react-native-reanimated';
import PanPinchView from 'react-native-pan-pinch-view';
import PriorityQueue from 'priority-queue-typescript';
import { filter, flatMap, values, find, sortBy, forEach, indexOf, map, sumBy, groupBy } from 'lodash';
import { t, ngettext, msgid } from 'ttag';
import FastImage from 'react-native-fast-image';
import {
  Defs,
  Svg,
  Mask,
  Path,
} from 'react-native-svg';

import { NavigationProps } from '@components/nav/types';
import { CampaignGuideInputProps } from './withCampaignGuideContext';
import StyleContext from '@styles/StyleContext';
import { DossierElement, Dossier, MapLabel, MapLocation, CampaignMap } from '@data/scenario/types';
import { useDialog } from '@components/deck/dialogs';
import space, { s } from '@styles/space';
import { Navigation, OptionsModalTransitionStyle } from 'react-native-navigation';
import AppIcon from '@icons/AppIcon';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import { useBackButton, useFlag, useNavigationButtonPressed, useSettingValue } from '@components/core/hooks';
import { TouchableOpacity, TouchableQuickSize } from '@components/core/Touchables';

import MapSvg from '../../../assets/map.svg';
import StrikeSvg from '../../../assets/strikethrough.svg';
import EncounterIcon from '@icons/EncounterIcon';
import COLORS from '@styles/colors';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import DeckButton from '@components/deck/controls/DeckButton';
import colors from '@styles/colors';
import CardSectionHeader from '@components/core/CardSectionHeader';
import MapToggleButton from './MapToggleButton';
import LanguageContext from '@lib/i18n/LanguageContext';

const PAPER_TEXTURE = require('../../../assets/paper.jpeg');

function BackgroundSvg({ width, height, fill, opacity }: { width: number; height: number; fill: string; opacity: number }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <Path
        opacity={opacity}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d={`M${width - 4} 0H4C4 2.20914 2.20914 4 0 4V${height - 4}C2.20914 ${height - 4} 4 ${height - 3}.7909 4 ${height}H${width - 4}C${width - 4} ${height - 3}.7909 ${width - 3}.791 ${height - 4} ${width} ${height - 4}V4C${width - 3}.791 4 ${width - 4} 2.20914 ${width - 4} 0Z`}
        fill={fill}
      />
    </Svg>
  );
}

function BorderSvg({ width, height, fill }: { width: number, height: number; fill: string }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <Defs>
        <Mask id="clip" fill="white">
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d={`M${width - 5}.1 1H4.89998C4.5023 2.95913 2.95913 4.5023 1 4.89998V${height - 5}.1C2.95913 ${height - 5}.4977 4.5023 ${height - 3}.0409 4.89998 ${height - 1}H${width - 5}.1C${width - 5}.498 ${height - 3}.0409 ${width - 3}.041 ${height - 5}.4977 ${width - 1} ${height - 5}.1V4.89998C${width - 3}.041 4.5023 ${width - 5}.498 2.95913 ${width - 5}.1 1Z`}
          />
        </Mask>
      </Defs>
      <Path
        d={`M${width - 5}.1 1L${width - 4}.08 0.801068L${width - 5}.917 0H${width - 5}.1V1ZM4.89998 1V0H4.08258L3.91997 0.801068L4.89998 1ZM1 4.89998L0.801068 3.91997L0 4.08258V4.89998H1ZM1 ${height - 5}.1H0V${height - 5}.9174L0.801068 ${height - 4}.08L1 ${height - 5}.1ZM4.89998 ${height - 1}L3.91997 ${height - 1}.1989L4.08258 ${height}H4.89998V${height - 1}ZM${width - 5}.1 ${height - 1}V${height}H${width - 5}.917L${width - 4}.08 ${height - 1}.1989L${width - 5}.1 ${height - 1}ZM${width - 1} ${height - 5}.1L${width - 1}.199 ${height - 4}.08L${width} ${height - 5}.9174V${height - 5}.1H${width - 1}ZM${width - 1} 4.89998H${width}V4.08258L${width - 1}.199 3.91997L${width - 1} 4.89998ZM${width - 5}.1 0H4.89998V2H${width - 5}.1V0ZM3.91997 0.801068C3.60218 2.36661 2.36661 3.60218 0.801068 3.91997L1.19893 5.88C3.55165 5.40242 5.40242 3.55165 5.88 1.19893L3.91997 0.801068ZM0 4.89998V${height - 5}.1H2V4.89998H0ZM0.801068 ${height - 4}.08C2.36661 ${height - 4}.3978 3.60218 ${height - 3}.6334 3.91997 ${height - 1}.1989L5.87999 ${height - 2}.8011C5.40242 ${height - 4}.4484 3.55165 ${height - 6}.5976 1.19893 ${height - 6}.12L0.801068 ${height - 4}.08ZM4.89998 ${height}H${width - 5}.1V${height - 2}H4.89998V44ZM${width - 4}.08 ${height - 1}.1989C${width - 4}.398 ${height - 3}.6334 ${width - 3}.633 ${height - 4}.3978 ${width - 1}.199 ${height - 4}.08L${width - 2}.801 ${height - 6}.12C${width - 4}.448 ${height - 6}.5976 ${width - 6}.598 ${height - 4}.4484 ${width - 6}.12 ${height - 2}.8011L${width - 4}.08 ${height - 1}.1989ZM${width} ${height - 5}.1V4.89998H${width - 2}V${height - 5}.1H${width}ZM${width - 1}.199 3.91997C${width - 3}.633 3.60218 ${width - 4}.398 2.36661 ${width - 4}.08 0.801068L${width - 6}.12 1.19893C${width - 6}.598 3.55165 ${width - 4}.448 5.40242 ${width - 2}.801 5.87999L${width - 1}.199 3.91997Z`}
        fill={fill}
        opacity={1}
        mask="url(#clip)"
      />
    </Svg>
  );
}

function BorderBox({ children, locked, visited, height, side }: { children: React.ReactNode; locked: boolean; visited: boolean; height: number; side: boolean }) {
  const bgColor = locked ? '#394852' : '#F5F0E1';
  const [dimensions, setDimensions] = useState<{ width: number; height: number}>();
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setDimensions({ width: Math.ceil(event.nativeEvent.layout.width), height: Math.ceil(event.nativeEvent.layout.height) });
  }, [setDimensions]);
  const opacity = useMemo(() => {
    if (!dimensions) {
      return 0;
    }
    return visited ? 0.5 : 0.8;
  }, [dimensions, visited]);
  const trueHeight = Math.ceil(height + (side ? 3 : 4));
  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        paddingTop: side ? 1.5 : 2,
        paddingBottom: side ? 1.5 : 2,
        paddingLeft: 4,
        paddingRight: 4,
      }}
      onLayout={onLayout}
    >
      { !!dimensions && (
        <>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: dimensions.width, height: trueHeight }} renderToHardwareTextureAndroid>
            <BackgroundSvg
              width={dimensions.width}
              height={trueHeight}
              fill={bgColor}
              opacity={opacity}
            />
          </View>
          { !locked && (
            <View style={{ position: 'absolute', top: 0, left: 0, width: dimensions.width, height: trueHeight }} renderToHardwareTextureAndroid>
              <BorderSvg
                width={dimensions.width}
                height={trueHeight}
                fill="#656C6F"
              />
            </View>
          ) }
        </>
      ) }
      { children }
    </View>
  )
}

export interface CampaignMapProps extends CampaignGuideInputProps {
  campaignMap: CampaignMap;
  onSelect?: (location: MapLocation, time: number, fast: boolean) => void;
  currentLocation: string | undefined;
  currentTime: number | undefined;
  hasFast: boolean;
  visitedLocations: string[];
  unlockedLocations: string[];
  unlockedDossiers: string[]
}

function getMapLabelStyles(widthRatio: number) {
  return {
    connection: {
      fontSize: 18 * widthRatio,
      lineHeight: 20 * widthRatio,
      opacity: 0.7,
    },
    ocean: {
      fontSize: 28 * widthRatio,
      lineHeight: 30 * widthRatio,
      letterSpacing: 4,
      fontStyle: 'italic',
      opacity: 0.2,
    },
    small_ocean: {
      fontSize: 20 * widthRatio,
      lineHeight: 22 * widthRatio,
      letterSpacing: 1.5,
      fontStyle: 'italic',
      opacity: 0.2,
    },
    country: {
      fontSize: 20 * widthRatio,
      lineHeight: 22 * widthRatio,
      letterSpacing: 1.5,
      opacity: 0.2,
    },
    continent: {
      fontSize: 28 * widthRatio,
      lineHeight: 30 * widthRatio,
      letterSpacing: 3,
      opacity: 0.2,
    },
  };
}

type MapLabelStyles = ReturnType<typeof getMapLabelStyles>;

interface MapLabelProps {
  label: MapLabel;
  campaignWidth: number;
  widthRatio: number;
  heightRatio: number;
  mapLabelStyles: MapLabelStyles;
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
  mapLabelStyles,
}: MapLabelProps) {
  const lineHeight = mapLabelStyles[label.type].lineHeight;
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
        mapLabelStyles[label.type],
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
        <BorderBox
          locked={status === 'locked'}
          visited={visited && !currentLocation}
          height={dotRadius * 2 + 2}
          side={status === 'side'}
        >
          <View style={{
            flexDirection: location.direction === 'left' ? 'row' : 'row-reverse',
            justifyContent: 'flex-end',
            paddingTop: 1,
            paddingBottom: 1,
          }}>
            <View style={[
              {
                position: 'relative',
                flexDirection: 'row',
                alignItems: 'flex-end',
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
                { fontFamily: Platform.OS === 'ios' ? 'TT2020 Style E' : 'TT2020StyleE-Regular' },
                { color: status === 'locked' ? '#E6E1D3' : '#24303C' },
                location.direction === 'left' ? { paddingLeft: 2 } : { paddingRight: 1 },
                visited && !currentLocation ? { opacity: 0.5 } : undefined,
                {
                  fontSize: dotRadius * 2 * 0.90,
                  lineHeight: dotRadius * 2 * (Platform.OS === 'ios' ? 1 : 0.85),
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
                size={dotRadius * (Platform.OS === 'android' ? 1.85 : 1.9)}
                name={`poi_${status}`}
              />
            </View>
          </View>
        </BorderBox>
      </TouchableQuickSize>
    </View>
  );
}

function CurrentLocationPin({
  location,
  campaignWidth,
  campaignHeight,
  widthRatio,
  heightRatio,
  status,
}: {
  location: MapLocation;
  campaignWidth: number;
  campaignHeight: number;
  widthRatio: number;
  heightRatio: number;
  status: 'standard' | 'locked' | 'side';
}) {
  const invert = status === 'locked';
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
        <AppIcon name={`${location.current || 'up'}_pin`} size={pinSize * 4} color={invert ? COLORS.L20 : COLORS.D20} />
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
        <AppIcon
          name="investigator"
          size={pinSize * 2}
          color={invert ? COLORS.D20 : COLORS.L30}
        />
      </View>
    </>
  );
}

interface TravelPath {
  time: number;
  path: string[];
}

function computeShortestPaths(start: string, allLocations: MapLocation[]): { [city: string]: TravelPath | undefined } {
  const result: { [city: string]: TravelPath | undefined } = {};

  const locationsById: { [id: string]: MapLocation } = {};
  forEach(allLocations, l => {
    locationsById[l.id] = l;
  });
  const queue = new PriorityQueue<TravelPath>(10, (pathA: TravelPath, pathB: TravelPath) => pathA.time - pathB.time);
  const startLocation = locationsById[start];
  forEach(startLocation.connections, connection => {
    queue.add({
      path: [start, connection],
      time: startLocation.hidden ? 0 : 1,
    });
  });

  while (!queue.empty()) {
    const shortestCurrent: TravelPath | null = queue.poll();
    if (shortestCurrent) {
      const last = shortestCurrent.path[shortestCurrent.path.length - 1];
      if (result[last]) {
        // Already reached here by a shorter path, so skip it.
        continue;
      }
      result[last] = {
        path: shortestCurrent.path,
        time: Math.max(shortestCurrent.time, 1),
      };
      const lastLocation = locationsById[last];
      forEach(lastLocation.connections, location => {
        if (indexOf(shortestCurrent.path, location) === -1) {
          // Add it to list if we don't have a loop;
          // Side locations only cost 1 time even when you pass through them.
          queue.add({
            path: [...shortestCurrent.path, location],
            time: shortestCurrent.time + (lastLocation.status === 'side' ? 0 : 1),
          });
        }
      })
    }
  }
  return result;
}

function findShortestPath(start: string, end: string, allLocations: MapLocation[]): TravelPath | undefined{
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

  const queue = new PriorityQueue<TravelPath>(10, (pathA: TravelPath, pathB: TravelPath) => pathA.time - pathB.time);
  const startLocation = locationsById[start];
  forEach(startLocation.connections, connection => {
    queue.add({
      path: [start, connection],
      time: 1,
    });
  });
  while (!queue.empty()) {
    const shortestCurrent: TravelPath | null = queue.poll();
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
  const { darkMode } = useContext(StyleContext);
  return (
    <View style={alignment === 'left' ? space.marginRightM : space.marginLeftM}>
      <View style={{ padding: 8, paddingBottom: 32, backgroundColor: darkMode ? COLORS.D10 : COLORS.white, transform: [{ rotate: alignment === 'left' ? '-4deg' : '4deg' }] }}>
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
        <View style={space.marginBottomS}>
          <DossierImage
            uri={image.uri}
            ratio={image.ratio}
            alignment={image.alignment}
            width={(width - s * 4) / 2.5}
          />
        </View>
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
  travelDistance,
}: {
  allLocations?: MapLocation[];
  location: MapLocation;
  travelDistance: number;
  currentLocation: MapLocation | undefined;
  unlockedDossiers: string[],
  visited: boolean;
  setCurrentLocation?: (location: MapLocation, distance: number | undefined, fast: boolean) => void;
  status: 'standard' | 'side' | 'locked';
  hasFast: boolean;
  showCity: (city: string) => void;
}) {
  const { colors, typography, width } = useContext(StyleContext);
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
            <View style={space.paddingTopM}>
              <Text style={typography.text}>
                { t`This is a side-story location.`}
              </Text>
            </View>
          ) }
          { !!travelDistance && !!currentLocation && (
            <Text style={[typography.text, space.paddingTopS]} textBreakStrategy="highQuality">
              { ngettext(msgid`Travel cost: ${travelDistance} time`, `Travel cost: ${travelDistance} time`, travelDistance) }
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
          <EncounterIcon encounter_code={location.id} size={width / 3.2} color={colors.D20} />
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

function LocationLine({ location, status, visited, onSelect }: {
  location: MapLocation;
  status: 'locked' | 'standard' | 'side';
  visited: boolean;
  onSelect: (location: MapLocation) => void;
}) {
  const { width, borderStyle, colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => onSelect(location), [onSelect, location]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ width }}
    >
      <View style={[styles.column, space.marginSideS, space.paddingVerticalS, { position: 'relative', borderBottomWidth: StyleSheet.hairlineWidth }, borderStyle]}>
        <View style={{ position: 'absolute', right: 0, top: 0 }}>
          <EncounterIcon size={54} encounter_code={location.id} color={colors.L10} />
        </View>
        <View key={location.id} style={styles.row}>
          <AppIcon
            color={statusColors[status]}
            size={24}
            name={`poi_${status}`}
          />
          <View style={[styles.column, space.paddingLeftS, { flex: 1 }]}>
            <Text style={[typography.header, typography.regular, visited ? { color: colors.M, textDecorationLine: 'line-through' } : undefined]}>
              { location.name }
            </Text>
            <Text style={[typography.small, typography.italic, typography.light, visited ? { color: colors.M, textDecorationLine: 'line-through' } : undefined]}>
              {location.details.region.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CampaignMapView(props: CampaignMapProps & NavigationProps) {
  const { componentId, onSelect, campaignMap, visitedLocations, unlockedLocations, unlockedDossiers, hasFast } = props;
  const [currentLocation, visited] = useMemo(() => {
    return [
      find(campaignMap?.locations, location => location.id === (props.currentLocation || 'london')),
      new Set(visitedLocations),
    ];
  }, [campaignMap, props.currentLocation, visitedLocations]);

  const { listSeperator } = useContext(LanguageContext);
  const { colors, backgroundStyle, borderStyle, typography, width, height } = useContext(StyleContext);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>();
  const setDialogVisibleRef = useRef<(visible: boolean) => void>();
  const onDismiss = useCallback(() => {
    setDialogVisibleRef.current?.(false);
    setTimeout(() => Navigation.dismissModal(componentId), 50);
    return true;
  }, [componentId]);

  const travelDistances = useMemo(() => {
    if (props.currentLocation) {
      return computeShortestPaths(props.currentLocation, campaignMap.locations);
    }
    return undefined;
  }, [props.currentLocation, campaignMap.locations]);

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
        travelDistance={travelDistances?.[selectedLocation.id]?.time || 1}
        setCurrentLocation={onSelect ? moveToLocation : undefined}
        allLocations={campaignMap?.locations}
        hasFast={hasFast}
        unlockedDossiers={unlockedDossiers}
        visited={visited.has(selectedLocation.id)}
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
  const labelStyles = useMemo(() => getMapLabelStyles(widthRatio), [widthRatio]);
  const timeTableMode = useSettingValue('map_list');
  const locationsByDistance = useMemo(() => {
    return sortBy(
      values(
        groupBy(
          sortBy(
            sortBy(
              filter(campaignMap.locations, location => location.id !== props.currentLocation),
              location => location.name
            ),
            location => travelDistances?.[location.id]?.time || 1
          ),
          location => {
            if (visited.has(location.id)) {
              return 'visited';
            }
            const status = ((location.status === 'locked' && !!find(unlockedLocations, loc => loc === location.id) ? 'standard' : undefined) || location.status);
            if (status === 'locked') {
              return 'locked';
            }
            return `dist_${travelDistances?.[location.id]?.time || 1}`;
          }
        )
      ), group => {
        const location = group[0];
        if (visited.has(location.id)) {
          return 'visited';
        }
        const status = ((location.status === 'locked' && !!find(unlockedLocations, loc => loc === location.id) ? 'standard' : undefined) || location.status);
        if (status === 'locked') {
          return 'locked';
        }
        return `dist_${travelDistances?.[location.id]?.time || 1}`;
      }
    );
  }, [campaignMap.locations, travelDistances, visited]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'toggle',
            component: {
              name: 'MapToggleButton',
              passProps: {},
              width: MapToggleButton.WIDTH,
              height: MapToggleButton.HEIGHT,
            },
            accessibilityLabel: t`Map`,
            enabled: true,
          },
        ],
      },
    });
  }, [componentId]);
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      { timeTableMode ? (
        <ScrollView contentContainerStyle={[backgroundStyle, styles.column]}>
          { flatMap(locationsByDistance, (locations) => {
            const first = locations[0];
            const status = (first.status === 'locked' && !!find(unlockedLocations, loc => loc === first.id) ? 'standard' : undefined) || first.status;
            const alreadyVisited = visited.has(first.id);
            const travelDistance = travelDistances?.[first.id]?.time || 1;
            return (
              <>
                <View style={[styles.row, space.paddingS, { backgroundColor: colors.L10 }]}>
                  <Text style={[typography.subHeaderText, typography.dark, { flex: 1 }]}>
                    { alreadyVisited ? t`Already visited` : (status === 'locked' ? t`Locked` :  ngettext(msgid`Travel cost: ${travelDistance} time`, `Travel cost: ${travelDistance} time`, travelDistance)) }
                  </Text>
                </View>
                {
                  map(locations, location => {
                    const status = (location.status === 'locked' && !!find(unlockedLocations, loc => loc === location.id) ? 'standard' : undefined) || location.status;
                    if (status === 'locked' && location.hidden) {
                      return null;
                    }
                    return (
                      <LocationLine
                        key={location.id}
                        location={location}
                        visited={alreadyVisited}
                        status={status}
                        onSelect={setSelectedLocation}
                      />
                    )
                  })
                }
              </>
            );
          }) }
        </ScrollView>
      ) : (
        <PanPinchView
          ref={pinchRef}
          minScale={1}
          maxScale={4}
          initialScale={1.0}
          style={{ backgroundColor: '0x8A9284' }}
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
                mapLabelStyles={labelStyles}
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
                visited={visited.has(location.id)}
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
                status={(currentLocation.status === 'locked' && !!find(unlockedLocations, loc => loc === currentLocation.id) ? 'standard' : undefined) || currentLocation.status}
            />
            ) }
          </View>
        </PanPinchView>
      ) }
      { dialog }
      { Platform.OS === 'ios' && <View style={[styles.gutter, { height }]} /> }
    </View>
  );
}

const styles = StyleSheet.create({
  texture: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textWithShadow:{
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 4,
    elevation: 2,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  gutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
  },
});
