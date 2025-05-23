import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image as FastImage } from 'expo-image';
import { Sepia } from 'react-native-color-matrix-image-filters';
import {
  Placeholder,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';

import { TouchableOpacity } from '@components/core/Touchables';
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
  image?: string;
  backCard?: Card;
  componentId?: string;
  border?: boolean;
  size?: 'large' | 'small' | 'tiny' | 'extra_tiny';
  killedOrInsane?: boolean;
  yithian?: boolean;
  imageLink?: boolean;
  badge?: 'upgrade' | 'deck';
  tabooSetId?: number;
  noShadow?: boolean;
  arkhamCardsImg?: string;
  imageOffset?: 'right' | 'left';
  round?: boolean;
}

const IMAGE_SIZE = {
  extra_tiny: 30,
  tiny: 40,
  small: 65,
  large: 110,
};

const ICON_SIZE = {
  extra_tiny: 20,
  tiny: 26,
  small: 40,
  large: 65,
};

const INVESTIGATOR_VERTICAL_OFFSET: { [key: string]: number | undefined } = {
  '09008': 1.7,
  '06001': 0.9,
  '03001': 0.95,
  '04001': 0.9,
  '08001': 0.95,
  '05001': 0.95,
  '03004': 0.95,
  '07004': 0.9,
  '04004': 0.9,
  'zbh_00010': 0.9,
  '02004': 0.92,
  '02005': 0.95,
  '08016': 1.2,
  '04005': 0.9,
  '09015': 0.95,
  'zbh_00013': 1.8,
  '07005': 0.9,
  '01005': 0.95,
  '03006': 0.95,
  '09018': 0.95,
  'zsti_00004': 1.5,
  '10001': 0.95,
  '10012': 0.95,
  '11001': 0.9,
  '11007': 0.9,
  '11008': 0.9,
  '11011': 0.95,
  '11014': 0.95,
  '11017': 0.95,
  '08004': 0.95,
  '07002': 0.90,
};
const INVESTIGATOR_HORIZONTAL_OFFSET: { [key: string]: number | undefined } = {
  'zbh_00001': 1.2,
  'zaw_00304': 1.6,
  '05001': 1.3,
  '08001': 0.9,
  '04001': 1.4,
  '03001': 0.7,
  '60101': 1.3,
  '07001': 1.85,
  '06001': 0.5,
  '02001': 1.2,
  '07002': 1.7,
  '60201': 1.2,
  '05002': 0.3,
  'zbh_00004': 1.8,
  '06002': 1.3,
  '03002': 0.9,
  '08004': 1.2,
  '04002': 0.8,
  'zsti_00010': 1.3,
  '04003': 0.3,
  'zjc_00027': 1.5,
  'zbh_00007': 0.8,
  '02003': 1.3,
  '09004': 0.8,
  '06003': 0.5,
  '03004': 0.2,
  '09011': 1.8,
  '04004': 0.5,
  'zbh_00010': 0.6,
  '60401': 1.4,
  '02004': 0.5,
  '08010': 0.4,
  '06004': 0.8,
  '05006': 1.6,
  '02005': 0.2,
  '08016': 0.1,
  '04005': 0.8,
  'zbh_00013': 1.4,
  '06005': 0.1,
  '05005': 1.8,
  'zsti_00022': 0.5,
  '07005': 0.5,
  '01005': 0.8,
  '09018': 0.9,
  '03006': 0.7,
  'zsti_00004': 1.4,
  '10001': 1.6,
  '10004': 1.5,
  '10009': 1.3,
  '09008': 0.5,
  '09015': 1.4,
  '11001': 1.4,
  '11007': 1.8,
  '11008': 1.8,
  '11011': 1.8,
  '11014': 1.7,
};

function getImpliedSize(size: 'large' | 'small' | 'tiny' | 'extra_tiny', fontScale: number) {
  if (size === 'small' || size === 'tiny' || size === 'extra_tiny') {
    return size;
  }
  return toggleButtonMode(fontScale) ? 'small' : 'large';
}

function InvestigatorImage({
  card,
  arkhamCardsImg,
  backCard,
  componentId,
  border,
  size = 'large',
  killedOrInsane,
  yithian,
  imageLink,
  badge,
  tabooSetId,
  noShadow,
  imageOffset,
  round,
  image,
}: Props) {
  const { colors, fontScale, shadow } = useContext(StyleContext);

  const onPress = useCallback(() => {
    if (componentId && card) {
      if (imageLink) {
        showCardImage(componentId, card, colors);
      } else {
        showCard(componentId, card.code, card, colors, { showSpoilers: true, tabooSetId, backCode: backCard?.code });
      }
    }
  }, [card, backCard, tabooSetId, componentId, imageLink, colors]);

  const impliedSize = useMemo(() => {
    return getImpliedSize(size, fontScale);
  }, [size, fontScale]);


  const imageStyle = useMemo(() => {
    if (card?.type_code === 'asset') {
      switch (impliedSize) {
        case 'extra_tiny': return imageOffset === 'right' ? styles.extraTinyRightAsset : styles.extraTinyAsset;
        case 'tiny': return imageOffset === 'right' ? styles.tinyRightAsset : styles.tinyAsset;
        case 'small': return imageOffset === 'right' ? styles.smallRightAsset : styles.smallAsset;
        case 'large': return imageOffset === 'right' ? styles.largeRightAsset : styles.largeAsset;
      }
    }
    if (yithian) {
      switch (impliedSize) {
        case 'extra_tiny': return styles.yithianExtraTiny
        case 'tiny': return styles.yithianTiny;
        case 'small': return styles.yithianSmall;
        case 'large': return styles.yithianLarge;
      }
    }
    switch (impliedSize) {
      case 'extra_tiny': return styles.extraTiny;
      case 'tiny': return styles.tiny;
      case 'small': return styles.small;
      case 'large': return styles.large;
    }
  }, [impliedSize, imageOffset, yithian, card]);
  const imgUri = useMemo(() => {
    if (image) {
      return image;
    }
    if (card) {
      if (yithian) {
        return 'https://arkhamdb.com/bundles/cards/04244.jpg';
      }
      const img = card.imageUri();
      if (img) {
        return img;
      }
    }
    return arkhamCardsImg;
  }, [image, card, yithian, arkhamCardsImg]);

  const investigatorImage = useMemo(() => {
    if (imgUri) {
      const leftOffset = card?.code ? (INVESTIGATOR_HORIZONTAL_OFFSET[card.code] || 1) : 3.9;
      const topOffset = card?.code ? (INVESTIGATOR_VERTICAL_OFFSET[card.code] || 1) : 0.6;
      return (
        <FastImage
          style={[
            imageStyle,
            {
              left: imageStyle.left * leftOffset,
              top: imageStyle.top * topOffset ,
            },
          ]}
          source={{
            uri: imgUri,
          }}
          resizeMode="contain"
        />
      );
    }
    return (
      <View style={[imageStyle, { backgroundColor: colors.L20 }]} />
    );
  }, [imgUri, colors, imageStyle, card?.code]);

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

  const imageNode = useMemo(() => {
    const size = IMAGE_SIZE[impliedSize];
    const faction = card?.factionCode() ?? 'neutral';
    const encounterCode = card?.encounter_code;
    if (!card && !imgUri) {
      return (
        <View style={[
          styles.container,
          round ? { borderRadius: size / 2, backgroundColor: colors.M } : undefined,
          { width: size, height: size },
        ]}>
          <Placeholder Animation={loadingAnimation}>
            <PlaceholderMedia
              color={colors.L10}
              style={[
                styles.container,
                { width: size, height: size },
                styles.border,
                round ? { borderRadius: size / 2 } : undefined,
                { borderColor: border ? colors.M : colors.L10 },
              ]}
            />
          </Placeholder>
        </View>
      );
    }
    return (
      <View style={[{ width: size, height: size, position: 'relative' }]}>
        <View style={[
          styles.container,
          border && impliedSize === 'tiny' && !noShadow ? shadow.large : undefined,
          border ? styles.border : undefined,
          round ? { borderRadius: size / 2 } : undefined,
          {
            width: size,
            height: size,
            borderColor: round ? colors.faction[faction].background : colors.faction[faction].border,
            overflow: 'hidden',
            backgroundColor: colors.background,
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
                backgroundColor: colors.faction[killedOrInsane ? 'dead' : faction].background,
              },
            ]}>
              <View style={styles.icon}>
                { encounterCode ? (
                  <View style={space.paddingTopXs}>
                    <EncounterIcon encounter_code={encounterCode} color="#FFFFFF" size={ICON_SIZE[impliedSize]} />
                  </View>
                ) : (
                  <FactionIcon faction={faction} defaultColor="#FFFFFF" size={ICON_SIZE[impliedSize]} />
                ) }
              </View>
            </View>
          </View>
          { !!imgUri && (
            <View style={styles.relative}>
              { styledImage }
            </View>
          ) }
        </View>
        { !!badge && (
          <View style={{
            position: 'absolute',
            bottom: - size / 8 + 2,
            right: -size / 8,
            width: size / 2,
            height: size / 2,
            borderRadius: size / 4,
            backgroundColor: colors.upgrade,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <AppIcon size={size / 2.3} color={COLORS.D20} name={badge} />
          </View>
        ) }
      </View>
    );
  }, [card, round, imgUri, killedOrInsane, badge, border, colors, impliedSize, styledImage, loadingAnimation, shadow, noShadow]);

  if (componentId && card) {
    return (
      <TouchableOpacity onPress={onPress}>
        { imageNode }
      </TouchableOpacity>
    );
  }
  return imageNode;
}

InvestigatorImage.computeHeight = (size: 'large' | 'small' | 'tiny' = 'large', fontScale: number) => {
  return IMAGE_SIZE[getImpliedSize(size, fontScale)];
}

export default InvestigatorImage;

const styles = StyleSheet.create({
  yithianExtraTiny: {
    position: 'absolute',
    top: -18,
    left: -8,
    width: (166 + 44) * 0.35,
    height: (136 + 34) * 0.35,
  },
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
  extraTiny: {
    position: 'absolute',
    top: -12,
    left: -4,
    width: (166 + 44) * 0.35,
    height: (136 + 34) * 0.35,
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
  extraTinyAsset: {
    position: 'absolute',
    top: -5,
    left: -6,
    width: (136 + 34) * 0.3,
    height: (166 + 44) * 0.3,
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

  extraTinyRightAsset: {
    position: 'absolute',
    top: -12,
    left: -27,
    width: (136 + 34) * 0.25,
    height: (166 + 44) * 0.25,
  },
  tinyRightAsset: {
    position: 'absolute',
    top: -12,
    left: -27,
    width: (136 + 34) * 0.45,
    height: (166 + 44) * 0.45,
  },
  smallRightAsset: {
    position: 'absolute',
    top: -36,
    left: -40,
    width: (136 + 34),
    height: (166 + 44),
  },
  largeRightAsset: {
    position: 'absolute',
    top: -44,
    left: -40,
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
