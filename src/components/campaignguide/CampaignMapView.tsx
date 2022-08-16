import React, { useCallback, useContext, useRef, useEffect, useMemo, useState } from 'react';
import PanPinchView from 'react-native-pan-pinch-view';
import PriorityQueue from 'priority-queue-typescript';
import { find, forEach, indexOf, map, sumBy } from 'lodash';
import { t, ngettext, msgid } from 'ttag';

import { NavigationProps } from '@components/nav/types';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import { View } from 'react-native-animatable';
import { LayoutChangeEvent, Pressable, Text, TextStyle } from 'react-native';
import StyleContext from '@styles/StyleContext';
import { MapLabel, MapLocation } from '@data/scenario/types';
import { useDialog } from '@components/deck/dialogs';
import ArkhamButton from '@components/core/ArkhamButton';
import space from '@styles/space';
import { Navigation } from 'react-native-navigation';
import AppIcon from '@icons/AppIcon';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import { useBackButton, useNavigationButtonPressed } from '@components/core/hooks';
import { interpolate } from 'react-native-reanimated';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';

import MapSvg from '../../../assets/map.svg';
import StrikeSvg from '../../../assets/strikethrough.svg';

function BorderBox({ children, locked, visited }: { children: React.ReactNode; locked: boolean; visited: boolean }) {
  const bgColor = locked ? '#394852' : '#F5F0E1';
  const size = 6;
  const [dimensions, setDimensions] = useState<{ width: number; height: number}>();
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setDimensions({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
  }, [setDimensions]);
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
        opacity={!dimensions ? 0 : (visited ? 0.5 : 0.8)}
      >
        { !!dimensions && (
          <>
            <View style={{ position: 'absolute', top: size - 1, left: 0, width: size, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: size - 1, right: 0, width: size, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: 0, left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: size, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', bottom: 0, left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: size, backgroundColor: bgColor }} />
            <View style={{ position: 'absolute', top: size -1 , left: size - 1, width: Math.ceil(dimensions.width - size * 2) + 2, height: Math.ceil(dimensions.height - size * 2) + 2, backgroundColor: bgColor }} />
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



//const TSK_MAP = require('../../../assets/tsk.png');

export interface CampaignMapProps extends CampaignGuideInputProps {
  onSelect?: (location: MapLocation, time: number) => void;
  currentLocation: string | undefined;
  currentTime: number | undefined;
  visitedLocations: string[];
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
  heightRatio
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
  widthRatio: number;
  heightRatio: number;
  onSelect: (location: MapLocation) => void;
  visited: boolean;
}
function PointOfInterest({
  campaignWidth,
  location,
  currentLocation,
  widthRatio,
  heightRatio,
  onSelect,
  visited,
}: PointOfInterestProps) {
  const borderRadius = widthRatio * 1.25;
  const dotRadius = widthRatio * (location.status === 'side' ? 6 : 8);
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
  return (
    <View style={[{
      position: 'absolute',
      top: location.y * heightRatio - dotRadius - 3,
    }, location.direction === 'left' ? {
      right: (campaignWidth - location.x) * widthRatio - dotRadius - 3,
    } : {
      left: location.x * widthRatio - dotRadius - 4,
    }]}>
      <Pressable onPress={onPress}>
        <BorderBox locked={location.status === 'locked'} visited={visited && !currentLocation}>
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
                { color: location.status === 'locked' ? '#E6E1D3' : '#24303C' },
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
                color={statusColors[location.status]}
                size={dotRadius * 2}
                name={`poi_${location.status}`}
              />
            </View>
          </View>
        </BorderBox>
      </Pressable>
    </View>
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
    const shortestCurrent: Path | undefined = queue.poll();
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
            time: shortestCurrent.time + (lastLocation.status === 'side' ? 0 : 1)
          });
        }
      })
    }
  }
  return undefined;
}

function LocationContent({
  location,
  allLocations,
  currentLocation,
  setCurrentLocation,
  visited,
}: {
  allLocations?: MapLocation[];
  location: MapLocation;
  currentLocation: MapLocation | undefined;
  visited: boolean;
  setCurrentLocation?: (location: MapLocation, distance: number | undefined) => void;
}) {
  const { typography } = useContext(StyleContext);
  const travelDistance = useMemo(() => {
    if (!currentLocation || !allLocations) {
      return undefined;
    }
    const shortestPath = findShortestPath(currentLocation.id, location.id, allLocations);
    return shortestPath?.time || 0;
  }, [currentLocation, allLocations, location])
  const makeCurrent = useCallback(() => {
    setCurrentLocation?.(location, travelDistance);
  }, [setCurrentLocation, location, travelDistance]);
  const atLocation = currentLocation?.id === location.id
  return (
    <>
      <View style={[space.paddingSideS, { flexDirection: 'column' }]}>
        { atLocation && (
          <Text style={typography.text}>{t`You are currently here.`}</Text>
        ) }
        { visited && !atLocation && (
          <Text style={typography.text}>{t`You have already visited this location.`}</Text>
        ) }
        { location.status === 'locked' && (
          <Text style={typography.text}>{t`Warning: Locked`}</Text>
        ) }
        { !visited && !atLocation && location.status === 'side' && (
          <Text style={typography.text}>
            {t`Travelling to this location will allow you to insert a side-scenarion into your campaign.`}
          </Text>
        ) }
        { (!currentLocation || !atLocation) && !visited && location.status !== 'locked' && (
          <>
            { !!travelDistance && !!currentLocation && (
              <Text style={[typography.text, { }]} textBreakStrategy="highQuality">
                { t`Travel time from ${currentLocation.name}:`} { ngettext(msgid`${travelDistance} day`, `${travelDistance} days`, travelDistance) }
              </Text>
            ) }
          </>
        ) }
        { currentLocation?.id !== location.id && !!setCurrentLocation && !visited && (
          <ArkhamButton icon="check" title="Move here" onPress={makeCurrent} />
        ) }
        { !!location.dossier && map(location.dossier, (entry, idx) => (
          <View key={idx}>
            { !!entry.text && <CampaignGuideTextComponent text={entry.text} /> }
          </View>
        ))}
      </View>
    </>
  );
}


function CampaignMapView(props: CampaignMapProps & NavigationProps) {
  const { componentId, onSelect, visitedLocations } = props;
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

  const moveToLocation = useCallback((location: MapLocation, distance: number | undefined) => {
    if (onSelect) {
      onSelect(location, distance || 1);
      onDismiss();
    }
  }, [onSelect, componentId, onDismiss]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      onDismiss();
    }
  }, componentId, [onDismiss]);
  useBackButton(onDismiss);

  const [theWidth, theHeight] = useMemo(() => {
    if (!campaignMap) {
      return [1, 1];
    }
    return [campaignMap.width * 1.0 / campaignMap.height * height, height];
  }, [campaignMap, width, height]);
  const clearSelection = useCallback(() => setSelectedLocation(undefined), []);
  const { dialog, showDialog, setVisible } = useDialog({
    title: selectedLocation?.name || '',
    content: !!selectedLocation && (
      <LocationContent
        location={selectedLocation}
        currentLocation={currentLocation}
        setCurrentLocation={onSelect ? moveToLocation : undefined}
        allLocations={campaignMap?.locations}
        visited={!!find(visitedLocations, loc => loc === selectedLocation.id)}
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
          <MapSvg width={theWidth} height={theHeight} viewBox="0 0 1893 988"/>
          { map(campaignMap.labels, (label, idx) => (
            <MapLabelComponent
              key={idx}
              campaignWidth={campaignMap.width}
              label={label}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
            />
          )) }
          { map(campaignMap.locations, (location) => (
            <PointOfInterest
              key={location.id}
              currentLocation={!!currentLocation && currentLocation.id === location.id}
              campaignWidth={campaignMap.width}
              location={location}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
              onSelect={setSelectedLocation}
              visited={!!find(visitedLocations, loc => loc === location.id)}
            />
          ) )}
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
