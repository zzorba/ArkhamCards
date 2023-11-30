import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { map, range } from 'lodash';
import FastImage from 'react-native-blasted-image';

import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import useSingleCard from '@components/card/useSingleCard';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { LocationAnnotation } from '@data/scenario/types';
import ToolTip from '@components/core/ToolTip';

const PLAYER_BACK = require('../../../../assets/player-back.png');
const ATLACH = require('../../../../assets/atlach.jpg');

interface Props {
  annotation?: LocationAnnotation;
  code: string;
  height: number;
  width: number;
  left: number;
  top: number;
  name?: string;
  resource_dividers?: {
    right?: number;
    bottom?: number;
  };
}

function TextCard({ name }: { name: string }) {
  const { colors, borderStyle, typography } = useContext(StyleContext);
  return (
    <View style={[
      styles.singleCardWrapper,
      borderStyle,
      { borderWidth: 1, borderRadius: 8, backgroundColor: colors.darkText },
    ]}>
      <Text style={[typography.text, { color: colors.background }, typography.center]}>
        { name }
      </Text>
    </View>
  );
}

function LocationCardImage({ code, back, name, rotate, rotateLeft, width, height }: { width: number; height: number; code: string; back: boolean; rotate: boolean; rotateLeft: boolean; name?: string }) {
  const [card, loading] = useSingleCard(code, 'encounter');
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!card) {
    return (
      <TextCard name={name || code} />
    );
  }
  const uri = back ? card.backImageUri() : card.imageUri();
  if (!uri) {
    return (
      <TextCard name={(back && card.back_name) || card.name} />
    );
  }
  return (
    <ToolTip label={(back && card.back_name) || card.name} height={height} width={width}>
      <FastImage
        style={[styles.verticalCardImage, { width, height }, rotate ? { transform: [{ rotate: rotateLeft ? '-90deg' : '90deg' }] } : undefined]}
        source={{
          uri,
        }}
        resizeMode="contain"
      />
    </ToolTip>
   
  );
}

function annotationPosition(
  position: 'top' | 'left' | 'right' | 'bottom',
  { height, width, left, top, fontScale }: { height: number; width: number; left: number; top: number; fontScale: number },
): {
  top?: number;
  left?: number;
  right?: number;
} {
  const annotationLineHeight = fontScale * 24;
  switch (position) {
    case 'top':
      return {
        top: top - annotationLineHeight,
        left,
      };
    case 'bottom':
      return {
        top: top + height,
        left,
      };
    case 'left':
      return {
        top: top + (height - annotationLineHeight) / 2,
        right: left,
      };
    case 'right':
      return {
        top: top + (height - annotationLineHeight) / 2,
        left: left + width,
      };
  }
}

export default function LocationCard({ annotation, code, height, width, left, top, name, resource_dividers }: Props) {
  const { borderStyle, fontScale, colors, typography } = useContext(StyleContext);
  const rotate = code.indexOf('_rotate') !== -1;
  const mini = code.indexOf('_mini') !== -1;

  const [theWidth, theHeight] = mini ? [width * 0.75, height * 0.75] : [width, height];
  const image = useMemo(() => {
    switch (code) {
      case 'blank':
        return null;
      case 'placeholder':
        return (
          <View style={[
            styles.singleCardWrapper,
            borderStyle,
            {
              borderWidth: 2,
              borderStyle: 'dashed',
              backgroundColor: colors.L20,
            }]} />
        );
      case 'player_back':
        return (
          <FastImage
            style={styles.verticalCardImage}
            source={PLAYER_BACK}
            resizeMode="contain"
          />
        );
      case 'atlach':
        return (
          <FastImage
            style={styles.verticalCardImage}
            source={ATLACH}
            resizeMode="contain"
          />
        );
      default:
        return (
          <View style={mini ? { paddingTop: height * 0.1, paddingBottom: height * 0.1, paddingLeft: width * 0.1, paddingRight: width * 0.1 } : undefined}>
            <LocationCardImage
              name={name}
              code={code.replace('_back', '').replace('_rotate_left', '').replace('_rotate', '').replace('_mini', '')}
              back={code.indexOf('_back') !== -1}
              width={theWidth}
              height={theHeight}
              rotateLeft={code.indexOf('_rotate_left') !== -1}
              rotate={rotate}
            />
          </View>
        );
    }
  }, [colors, borderStyle, mini, theHeight, theWidth, code, name, height, rotate, width]);

  const resourceDividers = useMemo(() => {
    if (!resource_dividers) {
      return null;
    }
    return (
      <>
        { !!resource_dividers.right && (
          <View style={[styles.resourceColumn, { height, left: left + width + 6, top }]}>
            { map(range(0, resource_dividers.right), (idx) => (
              <View key={`code-${idx}`} style={styles.resource}>
                <AppIcon name="crate" size={24} color={colors.darkText} />
              </View>
            )) }
          </View>
        ) }
        { !!resource_dividers.bottom && (
          <View style={[styles.resourceRow, { width, left, top: top + height }]}>
            { map(range(0, resource_dividers.bottom), (idx) => (
              <View key={`code-${idx}`} style={styles.resource}>
                <AppIcon key={`code-${idx}`} name="crate" size={24} color={colors.darkText} />
              </View>
            )) }
          </View>
        ) }
      </>
    );
  }, [resource_dividers, width, height, left, top, colors]);
  const annotationLineHeight = fontScale * 24;
  let textAlignment: TextStyle;
  switch (annotation?.position) {
    case 'left':
      textAlignment = typography.right;
      break;
    case 'right':
      textAlignment = typography.left;
      break;
    default:
      textAlignment = typography.center;
      break;
  }
  return (
    <>
      <View style={[styles.card, { width: rotate ? height : width, height: rotate ? width : height, left, top }]}>
        { image }
      </View>
      { resourceDividers }
      { !!annotation && (
        <View style={[styles.annotation, {
          width,
          ...annotationPosition(annotation.position, { height, width, left, top, fontScale }),
        }]}>
          <Text numberOfLines={2} style={[
            typography.text,
            textAlignment,
            { lineHeight: annotationLineHeight, fontSize: fontScale * 22 },
            typography.bold,
          ]}>
            { annotation.text }
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
  },
  verticalCardImage: {
    width: '100%',
    height: '100%',
  },
  singleCardWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: s,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  resourceColumn: {
    position: 'absolute',
    width: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceRow: {
    position: 'absolute',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resource: {
    paddingBottom: s,
  },
  annotation: {
    position: 'absolute',
  },
});
