import React, { useCallback, useContext } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import FlipCard from 'react-native-flip-card';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { TAROT_CARD_RATIO } from '@styles/sizes';
import FastImage from 'react-native-fast-image';
import { TarotCard } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate } from '@components/core/hooks';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';
import TextWithIcons from '@components/core/TextWithIcons';
import { dark20 } from '@styles/theme';

interface Props {
  card: TarotCard;
  width: number;
  flipped: boolean;
  inverted: boolean;
  suffix?: string;

  onFlip?: (id: string) => void;
  onInvert?: (id: string, newInverted: boolean) => void;
}

function degToRad(deg: number): string {
  'worklet';
  return `${((deg * Math.PI) / 180)}rad`;
}

export default function TarotCardComponent({ card, width, flipped, inverted, suffix, onFlip, onInvert }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = TAROT_CARD_RATIO * width;
  const onPress = useCallback(() => {
    if (!flipped && onFlip) {
      onFlip?.(card.id);
    } else if (onInvert) {
      onInvert(card.id, !inverted);
    }
  }, [card, flipped, inverted, onFlip, onInvert]);
  const rotate = useSharedValue(flipped && inverted ? 1 : 0);
  useEffectUpdate(() => {
    rotate.value = withTiming(flipped && inverted ? 1 : 0, { duration: 500, easing: Easing.ease });
  }, [inverted, flipped])
  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rotate.value, [0, 1], [0, 180]);
    return {
      transform: [
        { translateX: interpolate(rotate.value, [0, 1], [0, -width / 2]) },
        { translateY: interpolate(rotate.value, [0, 1], [0, height / 2]) },
        { rotateZ: degToRad(rotation) },
        { translateX: interpolate(rotate.value, [0, 1], [0, -width / 2]) },
        { translateY: interpolate(rotate.value, [0, 1], [0, height / 2]) },
      ],
    };
  }, [width, height]);

  const fontSize = (width > 250 ? 18 : 12) * fontScale;
  return (
    <Animated.View style={[{ width, height }, cardStyle]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <FlipCard
          style={[{ width, height, borderRadius: 16, backgroundColor: 'rgb(35,21,38)', overflow: 'hidden' }]}
          friction={6}
          perspective={1000}
          flipHorizontal
          flipVertical={false}
          flip={flipped}
          clickable={false}
        >
          <FastImage
            accessibilityLabel={card.title}
            nativeID={`tarot_${card.id}_${flipped ? 'front' : 'back'}${suffix || ''}`}
            style={{ position: 'absolute', top: -4, left: -4, width: width + 8, height: height + 8 * TAROT_CARD_RATIO }}
            source={{
              uri: 'https://img.arkhamcards.com/tarot/tarot_back.jpg',
            }}
            resizeMode="contain"
          />
          <View style={{ overflow: 'hidden', backgroundColor: dark20, width, height, position: 'relative', borderRadius: 16, borderWidth: 2, borderColor: colors.faction.mythos.border }}>
            <FastImage
              accessibilityLabel={card.title}
              style={{ overflow: 'hidden', backgroundColor: colors.M, borderRadius: 16, width: width + 8, height: height + 8 * TAROT_CARD_RATIO, position: 'absolute', top: -2, left: -4 }}
              source={{
                uri: `https://img.arkhamcards.com/tarot/tarot_${card.position}.jpg`,
              }}
              resizeMode="contain"
            />
            { width > 150 ? (
              <>
                <View style={[
                  space.paddingS,
                  { borderColor: colors.D30, borderBottomWidth: 2, borderLeftWidth: 1, borderRightWidth: 1, borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                  { position: 'absolute', top: 0, left: -2, width: width, minHeight: height * 0.12, backgroundColor: colors.D20 },
                  { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
                ]}>
                  <View style={{ position: 'absolute', bottom: 4, left: 4 }}>
                    <AppIcon name="fleur_bottom_left" size={25} color={colors.faction.dual.invertedText} />
                  </View>
                  <View style={{ position: 'absolute', bottom: 4, right: 4 }}>
                    <AppIcon name="fleur_bottom_right" size={25} color={colors.faction.dual.invertedText} />
                  </View>
                  <View style={[space.paddingSideS, { transform: [{ rotate: degToRad(-180) }] }]}>
                    <Text style={[typography.gameFont, typography.center, { fontSize, lineHeight: fontSize + 2, color: colors.faction.dual.invertedText }]}>
                      <TextWithIcons text={card.inverted_text} color={colors.faction.dual.invertedText} size={fontSize * 0.8} />
                    </Text>
                  </View>
                </View>

                <View style={[
                  space.paddingVerticalXs,
                  space.paddingSideS,
                  { borderColor: colors.D30, borderTopWidth: 2, borderLeftWidth: 1, borderRightWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
                  { position: 'absolute', bottom: 0, left: -2, width, minHeight: height * 0.16, backgroundColor: colors.faction.survivor.text },
                  { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
                ]}>
                  <View style={{ position: 'absolute', top: 4, left: 4 }}>
                    <AppIcon name="fleur_top_left" size={30} color={colors.faction.dual.invertedText} />
                  </View>
                  <View style={{ position: 'absolute', top: 4, right: 4 }}>
                    <AppIcon name="fleur_top_right" size={30} color={colors.faction.dual.invertedText} />
                  </View>

                  <Text style={[typography.gameFont, typography.center, typography.underline, space.paddingBottomS, { fontSize: fontSize * 1.25, lineHeight: fontSize * 1.25 + 2, color: colors.faction.dual.invertedText }]}>
                    { card.title }
                  </Text>
                  <Text style={[typography.gameFont, typography.center, { flex: 1, textAlignVertical: 'center', fontSize: fontSize, lineHeight: fontSize + 2, color: colors.faction.dual.invertedText }]}>
                    <TextWithIcons text={card.text} color={colors.faction.dual.invertedText} size={fontSize * 0.8} />
                  </Text>
                </View>
              </>
            ) : (
              <View style={[
                space.paddingVerticalXs,
                space.paddingSideS,
                { borderColor: colors.D30, borderTopWidth: 2, borderLeftWidth: 1, borderRightWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
                { position: 'absolute', bottom: 0, left: -2, width, minHeight: height * 0.14, backgroundColor: colors.faction.mythos.text },
                { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
              ]}>
                <View style={{ position: 'absolute', top: 4, left: 4 }}>
                  <AppIcon name="fleur_top_left" size={width / 8} color={colors.faction.dual.invertedText} />
                </View>
                <View style={{ position: 'absolute', top: 4, right: 4 }}>
                  <AppIcon name="fleur_top_right" size={width / 8} color={colors.faction.dual.invertedText} />
                </View>

                <Text style={[typography.gameFont, typography.center, typography.underline, { fontSize: fontSize, lineHeight: fontSize * 1.25 + 2, color: colors.faction.dual.invertedText }]}>
                  { card.title }
                </Text>
              </View>
            )}
          </View>
        </FlipCard>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}