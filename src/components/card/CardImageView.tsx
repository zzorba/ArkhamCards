import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ViewControl from 'react-native-zoom-view';
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
  if (!card) {
    return null;
  }

  if (card.double_sided || (card.linked_card && card.linked_card.imagesrc)) {
    if (!flipped) {
      return (
        <ViewControl
          cropWidth={width}
          cropHeight={height - HEADER_HEIGHT}
          imageWidth={cardWidth}
          imageHeight={cardHeight}
          style={[styles.container, backgroundStyle]}
        >
          <FastImage
            style={{ height: cardHeight, width: cardWidth }}
            resizeMode="contain"
            source={{
              uri: `https://arkhamdb.com${card.imagesrc}`,
            }}
          />
        </ViewControl>
      );
    }
    return (
      <ViewControl
        cropWidth={width}
        cropHeight={height - HEADER_HEIGHT}
        imageWidth={cardWidth}
        imageHeight={cardHeight}
        style={[styles.container, backgroundStyle]}
      >
        <FastImage
          style={{ height: cardHeight, width: cardWidth }}
          resizeMode="contain"
          source={{
            // @ts-ignore
            uri: `https://arkhamdb.com${card.double_sided ? card.backimagesrc : card.linked_card.imagesrc}`,
          }}
        />
      </ViewControl>
    );
  }

  return (
    <ViewControl
      cropWidth={width}
      cropHeight={height - HEADER_HEIGHT}
      imageWidth={cardWidth}
      imageHeight={cardHeight}
      style={[styles.container, backgroundStyle]}
    >
      <FastImage
        style={{ height: cardHeight, width: cardWidth }}
        resizeMode="contain"
        source={{
          uri: `https://arkhamdb.com${card.imagesrc}`,
        }}
      />
    </ViewControl>
  );
}

export default function CardImageView({ componentId, id }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const [flipped, toggleFlipped] = useFlag(false);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'flip') {
      toggleFlipped();
    }
  }, componentId, [toggleFlipped]);
  const [card] = useSingleCard(id, 'encounter');
  useEffect(() => {
    if (!card) {
      return;
    }
    const doubleCard: boolean = card.double_sided || !!(card.linked_card && card.linked_card.imagesrc);
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
  }, [card, componentId]);
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
