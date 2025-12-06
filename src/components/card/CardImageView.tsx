import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Image as FastImage } from 'expo-image';
import ViewControl from 'react-native-zoom-view';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';

import { t } from 'ttag';

import Card from '@data/types/Card';
import { HEADER_HEIGHT } from '@styles/sizes';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';
import useSingleCard from './useSingleCard';
import HeaderButton from '@components/core/HeaderButton';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export interface CardImageProps {
  id: string;
  cardName?: string;
  headerBackgroundColor?: string;
}

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
  if (card.double_sided || (card.linked_card && card.linked_card.hasImage())) {
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
            source={{
              uri: card.imageUri() ?? '',
            }}
            contentFit="contain"
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
          source={{
            uri: (card.double_sided ? card.backImageUri() : card.linked_card?.imageUri()) ?? '',
          }}
          contentFit="contain"
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
        source={{
          uri: card.imageUri() ?? '',
        }}
        contentFit="contain"
      />
    </ViewControl>
  );
}

export default function CardImageView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Card.Image'>>();
  const navigation = useNavigation();
  const { id } = route.params;
  const { backgroundStyle } = useContext(StyleContext);
  const [flipped, toggleFlipped] = useFlag(false);
  const [card] = useSingleCard(id, 'encounter');

  // Add flip button only when card loads
  useEffect(() => {
    if (!card) {
      return;
    }
    const doubleCard: boolean = card.double_sided || !!(card.linked_card && card.linked_card.hasImage());

    navigation.setOptions({
      headerRight: doubleCard ? () => (
        <HeaderButton
          iconName="flip_card"
          color="#FFFFFF"
          onPress={toggleFlipped}
          accessibilityLabel={t`Flip Card`}
        />
      ) : undefined,
    });
  }, [card, navigation, toggleFlipped]);
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


function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Card.Image'> }): NativeStackNavigationOptions {
  const { cardName, headerBackgroundColor } = route.params || {};
  return {
    title: cardName || t`Card Image`,
    headerStyle: headerBackgroundColor ? {
      backgroundColor: headerBackgroundColor,
    } : undefined,
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 20,
      fontWeight: '500' as const,
      color: '#FFFFFF',
    },
  };
};

CardImageView.options = options;
