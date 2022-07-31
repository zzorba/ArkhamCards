import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PanPinchView from "react-native-pan-pinch-view";
import PriorityQueue from 'priority-queue-typescript';
import { t, ngettext, msgid } from 'ttag';

import { NavigationProps } from '@components/nav/types';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import CampaignGuideContext from './CampaignGuideContext';
import { View } from 'react-native-animatable';
import { Pressable, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import StyleContext from '@styles/StyleContext';
import { find, forEach, indexOf, map } from 'lodash';
import { Location } from '@data/scenario/types';
import { useDialog } from '@components/deck/dialogs';
import ArkhamButton from '@components/core/ArkhamButton';
import space from '@styles/space';
import { Navigation } from 'react-native-navigation';
import AppIcon from '@icons/AppIcon';
import CampaignGuideTextComponent from './CampaignGuideTextComponent';
import { useBackButton, useNavigationButtonPressed } from '@components/core/hooks';

const TSK_MAP = require('../../../assets/tsk.png');

export interface CampaignMapProps extends CampaignGuideInputProps {
  onSelect?: (location: Location) => void;
}

const colors = {
  locked: 'red',
  side: 'green',
  standard: 'blue',
}
interface PointOfInterestProps {
  location: Location;
  currentLocation: boolean;
  campaignWidth: number;
  widthRatio: number;
  heightRatio: number;
  onSelect: (location: Location) => void;
}
function PointOfInterest({
  campaignWidth,
  location,
  currentLocation,
  widthRatio,
  heightRatio,
  onSelect,
}: PointOfInterestProps) {
  const { typography } = useContext(StyleContext);
  const borderRadius = widthRatio;
  const dotRadius = widthRatio * (location.status === 'side' ? 2.5 : 3.5);
  const onPress = useCallback(() => {
    onSelect(location);
  }, [location, onSelect]);
  return (
    <View style={[{
      position: 'absolute',
      top: location.y * heightRatio - dotRadius,
    }, location.label === 'left' ? {
      right: (campaignWidth - location.x) * widthRatio - dotRadius,
    } : {
      left: location.x * widthRatio - dotRadius,
    }]}>
      <Pressable onPress={onPress}>
        <View style={{
          flexDirection: location.label === 'left' ? 'row' : 'row-reverse',
          justifyContent: 'flex-end',
        }}
        >
          <View style={[
            {
              backgroundColor: location.status === 'side' ? '#222222' : '#eeeeee',
              alignItems: 'center',
            },
            location.label === 'left' ? {
              marginRight: dotRadius,
              paddingRight: dotRadius * 1.25,
              paddingLeft: borderRadius,
              borderTopLeftRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
              justifyContent: 'flex-end',
            } : {
              marginLeft: dotRadius,
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              paddingLeft: dotRadius * 1.25,
              paddingRight: borderRadius,
              justifyContent: 'flex-start',
            },
          ]}>
            <Text style={[
              typography.text,
              {
                fontSize: dotRadius * 2 * 0.90,
                lineHeight: dotRadius * 2,
                color: location.status === 'side' ? '#eeeeee' : '#222222',
                textAlign: location.label === 'left' ? 'right' : 'left',
              }
            ]}>
              { location.name }
            </Text>
          </View>
          <View style={{
            width: dotRadius * 2,
            height: dotRadius * 2,
            borderRadius: dotRadius,
            backgroundColor: 'white',
            position: 'absolute',
          }}>
            <View style={{ position: 'absolute', top: -0.5, left: 0 }}>
              <AppIcon color={colors[location.status]} size={dotRadius * 2} name="map_compass" />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function findShortestPath(start: string, end: string, allLocations: Location[]): string[] {
  if (start === end) {
    return [start];
  }
  const locationsById: { [id: string]: Location } = {};
  forEach(allLocations, l => {
    locationsById[l.id] = l;
  });

  const queue = new PriorityQueue<string[]>(10, (pathA: string[], pathB: string[]) => pathA.length - pathB.length);
  const startLocation = locationsById[start];
  forEach(startLocation.connections, connection => {
    queue.add([start, connection]);
  });
  while (!queue.empty()) {
    const shortestCurrent = queue.poll();
    if (shortestCurrent) {
      if (indexOf(shortestCurrent, end) !== -1) {
        return shortestCurrent;
      }
      const last = shortestCurrent[shortestCurrent.length - 1];
      const lastLocation = locationsById[last];
      forEach(lastLocation.connections, location => {
        if (indexOf(shortestCurrent, location) === -1) {
          // Add it to list if we don't have a loop;
          queue.add([...shortestCurrent, location]);
        }
      })
    }
  }
  return [];
}

function LocationContent({
  location,
  allLocations,
  currentLocation,
  setCurrentLocation,
}: {
  allLocations?: Location[];
  location: Location;
  currentLocation: Location | undefined;
  setCurrentLocation: (location: Location) => void;
}) {
  const { typography } = useContext(StyleContext);
  const makeCurrent = useCallback(() => {
    setCurrentLocation(location);
  }, [setCurrentLocation, location.id]);

  const travelDistance = useMemo(() => {
    if (!currentLocation || !allLocations) {
      return undefined;
    }
    const shortestPath = findShortestPath(currentLocation.id, location.id, allLocations);
    return shortestPath.length - 1;
  }, [currentLocation, allLocations, location])
  return (
    <>
      <View style={[space.paddingSideS, { flexDirection: 'column' }]}>
        { currentLocation?.id === location.id && (
          <Text style={typography.text}>{t`You are here.`}</Text>
        ) }
        { location.status === 'locked' && (
          <Text style={typography.text}>{t`Warning: Locked`}</Text>
        ) }
        { (!currentLocation || currentLocation.id !== location.id) && (
          <>
            { !!travelDistance && !!currentLocation && (
              <Text style={[typography.text, { }]} textBreakStrategy="highQuality">
                { t`Travel time from ${currentLocation.name}:`} { ngettext(msgid`${travelDistance} day`, `${travelDistance} days`, travelDistance) }
              </Text>
            ) }
          </>
        ) }
        { currentLocation?.id !== location.id && (
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

function CampaignMapView({ componentId, onSelect }: CampaignMapProps & NavigationProps) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  const { width, height } = useContext(StyleContext);

  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const onDismiss = useCallback(() => {
    Navigation.dismissModal(componentId);
    return true;
  }, [componentId]);

  const moveToLocation = useCallback((location: Location) => {
    if (onSelect) {
      onSelect(location);
      onDismiss();
    }
  }, [onSelect, componentId, onDismiss]);

  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'close') {
      onDismiss();
    }
  }, componentId, [onDismiss]);
  useBackButton(onDismiss);


  const campaignMap = campaignGuide.campaignMap();
  const [theWidth, theHeight] = useMemo(() => {
    if (!campaignMap) {
      return [1, 1];
    }
    return [campaignMap.width * 1.0 / campaignMap.height * height, height];
  }, [campaignMap, width, height]);
  const clearSelection = useCallback(() => setSelectedLocation(undefined), []);
  const { dialog, showDialog } = useDialog({
    title: selectedLocation?.name || '',
    content: !!selectedLocation && (
      <LocationContent
        location={selectedLocation}
        currentLocation={currentLocation}
        setCurrentLocation={onSelect ? moveToLocation : setCurrentLocation}
        allLocations={campaignMap?.locations}
      />
    ),
    dismiss: {
      onPress: clearSelection,
    },
    alignment: 'bottom',
    allowDismiss: true,
  });
  const widthRatio = theWidth * 1.0 / (campaignMap?.width || 1);
  const heightRatio = theHeight * 1.0 / (campaignMap?.height || 1);

  useEffect(() => {
    if (selectedLocation) {
      showDialog();
    }
  }, [selectedLocation, showDialog]);

  if (!campaignMap) {
    return <Text>No map</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <PanPinchView
        minScale={0.5}
        initialScale={1}
        containerDimensions={{ width, height }}
        contentDimensions={{ width: theWidth, height: theHeight }}
      >
        <View style={{ width: theWidth, height: theHeight, position: 'relative' }}>
          <FastImage
            style={{ width: theWidth, height: theHeight }}
            source={TSK_MAP}
            resizeMode="stretch"
          />
          { map(campaignMap.locations, (location) => (
            <PointOfInterest
              key={location.id}
              currentLocation={currentLocation?.id === location.id}
              campaignWidth={campaignMap.width}
              location={location}
              widthRatio={widthRatio}
              heightRatio={heightRatio}
              onSelect={setSelectedLocation}
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
