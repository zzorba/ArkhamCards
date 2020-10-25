import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Sepia } from 'react-native-color-matrix-image-filters';
import {
  Placeholder,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';

import { showCard, showCardImage } from '@components/nav/helper';
import { toggleButtonMode } from '@components/cardlist/CardSearchResult/constants';
import FactionIcon from '@icons/FactionIcon';
import Card from '@data/Card';
import { isBig } from '@styles/space';
import StyleContext from '@styles/StyleContext';

const scaleFactor = isBig ? 1.2 : 1.0;

interface Props {
  card?: Card;
  componentId?: string;
  border?: boolean;
  small?: boolean;
  killedOrInsane?: boolean;
  yithian?: boolean;
  imageLink?: boolean;
}

export default function InvestigatorImage({
  card,
  componentId,
  border,
  small,
  killedOrInsane,
  yithian,
  imageLink,
}: Props) {
  const { colors, fontScale } = useContext(StyleContext);

  const onPress = useCallback(() => {
    if (componentId && card) {
      if (imageLink) {
        showCardImage(componentId, card, colors);
      } else {
        showCard(componentId, card.code, card, colors, true);
      }
    }
  }, [card, componentId, imageLink, colors]);

  const isSmall = useMemo(() => {
    return small || toggleButtonMode(fontScale);
  }, [small, fontScale]);

  const imageStyle = useMemo(() => {
    if (yithian) {
      return isSmall ? styles.smallYithianImage : styles.bigImage;
    }
    return isSmall ? styles.image : styles.bigImage;
  }, [isSmall, yithian]);

  const investigatorImage = useMemo(() => {
    if (card) {
      return (
        <FastImage
          style={imageStyle}
          source={{
            uri: `https://arkhamdb.com/${yithian ? 'bundles/cards/04244.jpg' : card.imagesrc}`,
          }}
          resizeMode="contain"
        />
      );
    }
    return (
      <View style={[imageStyle, { backgroundColor: colors.L20 }]} />
    );
  }, [card, yithian, colors, imageStyle]);

  const styledImage = useMemo(() => {
    if (killedOrInsane) {
      return (
        <Sepia>
          { investigatorImage }
        </Sepia>
      );
    }
    return investigatorImage;
  }, [killedOrInsane, investigatorImage]);

  const image = useMemo(() => {
    const size = (isSmall ? 65 : 110) * scaleFactor;
    if (!card) {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Placeholder Animation={(props) => <Fade {...props} style={{ backgroundColor: colors.L20 }} duration={1000} />}>
            <PlaceholderMedia
              color={colors.L10}
              style={[styles.container, { width: size, height: size }, styles.border, { borderColor: border ? colors.M : colors.L10 }]}
            />
          </Placeholder>
        </View>
      );
    }
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.relative}>
          <View style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              backgroundColor: colors.faction[killedOrInsane ? 'dead' : card.factionCode()].background,
            },
          ]}>
            <Text style={styles.placeholderIcon} allowFontScaling={false}>
              <FactionIcon faction={card.factionCode()} defaultColor="#FFFFFF" size={isSmall ? 40 : 55} />
            </Text>
          </View>
        </View>
        { !!card.imagesrc && (
          <View style={styles.relative}>
            { styledImage }
          </View>
        ) }
        <View style={styles.relative}>
          { !!border && (
            <View style={[
              styles.border,
              {
                borderColor: colors.faction[killedOrInsane ? 'dead' : card.factionCode()].background,
                width: size,
                height: size,
              },
            ]} />
          ) }
        </View>
      </View>
    );
  }, [card, killedOrInsane, border, colors, isSmall, styledImage]);

  if (componentId && card) {
    return (
      <TouchableOpacity onPress={onPress}>
        { image }
      </TouchableOpacity>
    );
  }
  return image;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 6,
  },
  relative: {
    position: 'relative',
  },
  smallYithianImage: {
    position: 'absolute',
    top: -36 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 24) * scaleFactor,
    height: (136 + 14) * scaleFactor,
  },
  image: {
    position: 'absolute',
    top: -36 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 44) * scaleFactor,
    height: (136 + 34) * scaleFactor,
  },
  bigImage: {
    position: 'absolute',
    top: -44 * scaleFactor,
    left: -20 * scaleFactor,
    width: (166 + 44) * 1.25 * scaleFactor,
    height: (136 + 34) * 1.25 * scaleFactor,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  placeholderIcon: {
    textAlign: 'center',
  },
});
