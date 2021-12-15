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
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import EncounterIcon from '@icons/EncounterIcon';
import space from '@styles/space';

interface Props {
  card?: Card;
  backCard?: Card;
  componentId?: string;
  border?: boolean;
  size?: 'large' | 'small' | 'tiny';
  killedOrInsane?: boolean;
  yithian?: boolean;
  imageLink?: boolean;
  badge?: 'upgrade' | 'deck';
  tabooSetId?: number;
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

function getImpliedSize(size: 'large' | 'small' | 'tiny', fontScale: number) {
  if (size === 'small' || size === 'tiny') {
    return size;
  }
  return toggleButtonMode(fontScale) ? 'small' : 'large';
}

function InvestigatorImage({
  card,
  backCard,
  componentId,
  border,
  size = 'large',
  killedOrInsane,
  yithian,
  imageLink,
  badge,
  tabooSetId,
}: Props) {
  const { colors, fontScale, shadow } = useContext(StyleContext);

  const onPress = useCallback(() => {
    if (componentId && card) {
      if (imageLink) {
        showCardImage(componentId, card, colors);
      } else {
        showCard(componentId, card.code, card, colors, true, tabooSetId, backCard?.code);
      }
    }
  }, [card, backCard, tabooSetId, componentId, imageLink, colors]);

  const impliedSize = useMemo(() => {
    return getImpliedSize(size, fontScale);
  }, [size, fontScale]);


  const imageStyle = useMemo(() => {
    if (card?.type_code === 'asset') {
      switch (impliedSize) {
        case 'tiny': return styles.tinyAsset;
        case 'small': return styles.smallAsset;
        case 'large': return styles.largeAsset;
      }
    }
    switch (impliedSize) {
      case 'tiny': return yithian ? styles.yithianTiny : styles.tiny;
      case 'small': return yithian ? styles.yithianSmall : styles.small;
      case 'large': return yithian ? styles.yithianLarge : styles.large;
    }
  }, [impliedSize, yithian, card]);

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
      <View style={[{ width: size, height: size, position: 'relative' }, border && impliedSize === 'tiny' ? shadow.large : undefined]}>
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
                { card.encounter_code ? (
                  <View style={space.paddingTopXs}>
                    <EncounterIcon encounter_code={card.encounter_code} color="#FFFFFF" size={ICON_SIZE[impliedSize]} />
                  </View>
                ) : (
                  <FactionIcon faction={card.factionCode()} defaultColor="#FFFFFF" size={ICON_SIZE[impliedSize]} />
                ) }
              </View>
            </View>
          </View>
          { !!card.imagesrc && (
            <View style={styles.relative}>
              { styledImage }
            </View>
          ) }
        </View>
        { !!badge && (
          <View style={{ position: 'absolute', bottom: - size / 8 + 2, right: -size / 8, width: size / 2, height: size / 2, borderRadius: size / 4, backgroundColor: colors.upgrade, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <AppIcon size={size / 2.3} color={COLORS.D20} name={badge} />
          </View>
        ) }
      </View>
    );
  }, [card, killedOrInsane, badge, border, colors, impliedSize, styledImage, loadingAnimation, shadow]);

  if (componentId && card) {
    return (
      <TouchableOpacity onPress={onPress}>
        { image }
      </TouchableOpacity>
    );
  }
  return image;
}

InvestigatorImage.computeHeight = (size: 'large' | 'small' | 'tiny' = 'large', fontScale: number) => {
  return IMAGE_SIZE[getImpliedSize(size, fontScale)];
}

export default InvestigatorImage;

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
  tinyAsset: {
    position: 'absolute',
    top: -10,
    left: -12,
    width: (136 + 34) * 0.4,
    height: (166 + 44) * 0.4,
  },
  smallAsset: {
    position: 'absolute',
    top: -36,
    left: -20,
    width: (136 + 34),
    height: (166 + 44),
  },
  largeAsset: {
    position: 'absolute',
    top: -44,
    left: -20,
    width: (136 + 34) * 1.25,
    height: (166 + 44) * 1.25,
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
