import React, { useCallback, useContext, useEffect } from 'react';
import {
  GestureResponderEvent,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import { Image as FastImage } from 'expo-image';
import { ReactNativeZoomableView, ZoomableViewEvent } from '@openspacelabs/react-native-zoomable-view';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import Card from '@data/types/Card';
import { HEADER_HEIGHT } from '@styles/sizes';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import useSingleCard from './useSingleCard';

export interface CardImageProps {
  id: string;
  embedded?: boolean;
}

type Props = CardImageProps & NavigationProps;

interface CardImageDetailProps {
  card?: Card;
  flipped: boolean;
}

function CardImageDetail({ card, flipped }: CardImageDetailProps) {
  const { backgroundStyle, width, height } = useContext(StyleContext);
  const cardRatio = 68 / 95;
  const cardHeight = (height - HEADER_HEIGHT) * cardRatio;
  const cardWidth = width - 16;
  const onShouldBlockNativeResponderHandler = useCallback((
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
    zoomableViewEventObject: ZoomableViewEvent
  ): boolean => {
    if (zoomableViewEventObject.zoomLevel === 1) {
      return false;
    }
    return true;
  }, []);
  if (!card) {
    return null;
  }
  if (card.double_sided || (card.linked_card && card.linked_card.hasImage())) {
    if (!flipped) {
      return (
        <ReactNativeZoomableView
          maxZoom={3}
          minZoom={1}
          initialZoom={1}
          style={{
            width,
            height: height - HEADER_HEIGHT,
          }}
          // contentWidth={cardWidth}
          // contentHeight={cardHeight}
          onShouldBlockNativeResponder={onShouldBlockNativeResponderHandler}
          disablePanOnInitialZoom
          panBoundaryPadding={10}
          // style={[styles.container, backgroundStyle]}
        >
          <FastImage
            style={{ height: cardHeight, width: cardWidth }}
            source={{
              uri: card.imageUri() ?? '',
            }}
            resizeMode="contain"
          />
        </ReactNativeZoomableView>
      );
    }
    return (
      <ReactNativeZoomableView
        maxZoom={3}
        minZoom={1}
        initialZoom={1}
        // cropWidth={width}
        // cropHeight={height - HEADER_HEIGHT}
        contentWidth={cardWidth}
        contentHeight={cardHeight}
        disablePanOnInitialZoom
        panBoundaryPadding={10}
        onShouldBlockNativeResponder={onShouldBlockNativeResponderHandler}
        style={{
          width,
          height: height - HEADER_HEIGHT,
        }}
        // style={[styles.container, backgroundStyle]}
      >
        <FastImage
          style={{ height: cardHeight, width: cardWidth }}
          source={{
            uri: (card.double_sided ? card.backImageUri() : card.linked_card?.imageUri()) ?? '',
          }}
          resizeMode="contain"
        />
      </ReactNativeZoomableView>
    );
  }
  return (
    <ReactNativeZoomableView
      maxZoom={3}
      minZoom={1}
      initialZoom={1}
      // cropWidth={width}
      // cropHeight={height - HEADER_HEIGHT}
      contentWidth={cardWidth}
      contentHeight={cardHeight}
      disablePanOnInitialZoom
      onShouldBlockNativeResponder={onShouldBlockNativeResponderHandler}
      panBoundaryPadding={10}
      style={{
        width,
        height: height - HEADER_HEIGHT,
      }}
      // style={[styles.container, backgroundStyle]}
    >
      <FastImage
        style={{ height: cardHeight, width: cardWidth }}
        source={{
          uri: card.imageUri() ?? '',
        }}
        resizeMode="contain"
      />
    </ReactNativeZoomableView>
  );
}

export default function CardImageView({ componentId, id, embedded }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const [flipped, toggleFlipped] = useFlag(false);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'flip') {
      toggleFlipped();
    }
  }, componentId, [toggleFlipped]);
  const [card] = useSingleCard(id, 'encounter');
  useEffect(() => {
    if (!card || embedded) {
      return;
    }
    const doubleCard: boolean = card.double_sided || !!(card.linked_card && card.linked_card.hasImage());
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: doubleCard ? [{
          id: 'flip',
          icon: iconsMap.flip_card,
          color: '#FFFFFF',
          accessibilityLabel: t`Flip Card`,
        }] : [],
      },
    });
  }, [card, embedded, componentId]);
  return (
    <View style={[styles.container, backgroundStyle]}>
      <CardImageDetail
        card={card}
        flipped={!!flipped}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
