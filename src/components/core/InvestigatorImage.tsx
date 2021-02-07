import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
import StyleContext from '@styles/StyleContext';

interface Props {
  card?: Card;
  componentId?: string;
  border?: boolean;
  size?: 'large' | 'small' | 'tiny';
  killedOrInsane?: boolean;
  yithian?: boolean;
  imageLink?: boolean;
}

const IMAGE_SIZE = {
  tiny: 40,
  small: 65,
  large: 110,
};

const ICON_SIZE = {
  tiny: 26,
  small: 40,
  large: 65,
};

export default function InvestigatorImage({
  card,
  componentId,
  border,
  size = 'large',
  killedOrInsane,
  yithian,
  imageLink,
}: Props) {
  const { colors, fontScale, shadow } = useContext(StyleContext);

  const onPress = useCallback(() => {
    if (componentId && card) {
      if (imageLink) {
        showCardImage(componentId, card, colors);
      } else {
        showCard(componentId, card.code, card, colors, true);
      }
    }
  }, [card, componentId, imageLink, colors]);

  const impliedSize = useMemo(() => {
    if (size === 'small' || size === 'tiny') {
      return size;
    }
    return toggleButtonMode(fontScale) ? 'small' : 'large';
  }, [size, fontScale]);


  const imageStyle = useMemo(() => {
    switch (impliedSize) {
      case 'tiny': return yithian ? styles.yithianTiny : styles.tiny;
      case 'small': return yithian ? styles.yithianSmall : styles.small;
      case 'large': return yithian ? styles.yithianLarge : styles.large;
    }
  }, [impliedSize, yithian]);

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

  const loadingAnimation = useCallback((props: any) => <Fade {...props} style={{ backgroundColor: colors.L20 }} duration={1000} />, [colors]);

  const image = useMemo(() => {
    const size = IMAGE_SIZE[impliedSize];
    if (!card) {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Placeholder Animation={loadingAnimation}>
            <PlaceholderMedia
              color={colors.L10}
              style={[styles.container, { width: size, height: size }, styles.border, { borderColor: border ? colors.M : colors.L10 }]}
            />
          </Placeholder>
        </View>
      );
    }
    return (
      <View style={border && impliedSize === 'tiny' ? shadow.large : undefined}>
        <View style={[
          styles.container,
          border ? styles.border : undefined,
          {
            width: size,
            height: size,
            borderColor: colors.faction[card.factionCode()].border,
            overflow: 'hidden',
          },
        ]}>
          <View style={styles.relative}>
            <View style={[
              styles.placeholder,
              {
                top: border ? -2 : 0,
                left: border ? -2 : 0,
                width: size,
                height: size,
                backgroundColor: colors.faction[killedOrInsane ? 'dead' : card.factionCode()].background,
              },
            ]}>
              <View style={styles.icon}>
                <FactionIcon faction={card.factionCode()} defaultColor="#FFFFFF" size={ICON_SIZE[impliedSize]} />
              </View>
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

              ]} />
            ) }
          </View>
        </View>
      </View>
    );
  }, [card, killedOrInsane, border, colors, impliedSize, styledImage, loadingAnimation, shadow]);

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
  yithianTiny: {
    position: 'absolute',
    top: -18,
    left: -8,
    width: (166 + 44) * 0.5,
    height: (136 + 34) * 0.5,
  },
  yithianSmall: {
    position: 'absolute',
    top: -36,
    left: -20,
    width: (166 + 24),
    height: (136 + 14),
  },
  yithianLarge: {
    position: 'absolute',
    top: -44,
    left: -20,
    width: (166 + 44) * 1.25,
    height: (136 + 34) * 1.25,
  },
  container: {
    position: 'relative',
    borderRadius: 6,
  },
  relative: {
    position: 'relative',
  },
  tiny: {
    position: 'absolute',
    top: -18,
    left: -8,
    width: (166 + 44) * 0.5,
    height: (136 + 34) * 0.5,
  },
  small: {
    position: 'absolute',
    top: -36,
    left: -20,
    width: (166 + 44),
    height: (136 + 34),
  },
  large: {
    position: 'absolute',
    top: -44,
    left: -20,
    width: (166 + 44) * 1.25,
    height: (136 + 34) * 1.25,
  },
  placeholder: {
    position: 'absolute',
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
  icon: {
    marginTop: -6,
  },
});
