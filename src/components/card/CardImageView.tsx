import React, { useContext, useLayoutEffect } from 'react';
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
            resizeMode="contain"
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
          resizeMode="contain"
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
        resizeMode="contain"
      />
    </ViewControl>
  );
}

export default function CardImageView() {
  const route = useRoute<RouteProp<BasicStackParamList, 'Card.Image'>>();
  const navigation = useNavigation();
  const { id, cardName } = route.params;
  const { backgroundStyle, colors } = useContext(StyleContext);
  const [flipped, toggleFlipped] = useFlag(false);
  const [card] = useSingleCard(id, 'encounter');

  // Set up navigation options with proper styling and buttons
  useLayoutEffect(() => {
    if (!card) {
      return;
    }
    const faction = card.factionCode();
    const doubleCard: boolean = card.double_sided || !!(card.linked_card && card.linked_card.hasImage());

    navigation.setOptions({
      title: cardName || card.name,
      headerStyle: {
        backgroundColor: faction ? colors.faction[faction].background : colors.background,
      },
      headerTintColor: faction ? '#FFFFFF' : colors.darkText,
      headerRight: doubleCard ? () => (
        <HeaderButton
          iconName="flip_card"
          color="#FFFFFF"
          onPress={toggleFlipped}
          accessibilityLabel={t`Flip Card`}
        />
      ) : undefined,
    });
  }, [card, cardName, navigation, colors, toggleFlipped]);
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
  return {
    title: route.params?.cardName || t`Card Image`,
  };
};

CardImageView.options = options;
