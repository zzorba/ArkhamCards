import React, { useContext, useMemo } from 'react';
import { Image, StyleSheet, Text, TextStyle, View } from 'react-native';
import { map, range } from 'lodash';
import FastImage from 'react-native-blasted-image';

import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import useSingleCard from '@components/card/useSingleCard';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { LocationAnnotation } from '@data/scenario/types';
import ToolTip from '@components/core/ToolTip';
import ArkhamIcon from '@icons/ArkhamIcon';

const PLAYER_BACK = require('../../../../assets/player-back.png');
const ATLACH = require('../../../../assets/atlach.jpg');
const RAIL_SIZE = 25;
interface Props {
  annotation?: LocationAnnotation;
  code: string;
  height: number;
  width: number;
  left: number;
  top: number;
  name?: string;
  random?: boolean;
  faded?: boolean;
  placeholder?: boolean;
  resource_dividers?: {
    right?: number;
    bottom?: number;
  };
}

function TextCard({ name, placeholder }: { name: string; placeholder?: boolean }) {
  const { colors, borderStyle, typography } = useContext(StyleContext);
  return (
    <View style={[
      styles.singleCardWrapper,
      placeholder ? undefined : borderStyle,
      placeholder ? undefined : { borderWidth: 1, borderRadius: 8, backgroundColor: colors.darkText },
    ]}>
      <Text style={[typography.text, { color: placeholder ? colors.darkText : colors.background }, typography.center]}>
        { name }
      </Text>
    </View>
  );
}

const RAIL_REGEX = /_RAIL_([NSEW]+)$/;

function LocationCardImage({ code, back, name, rotate, rotateLeft, width, height, placeholder }: {
  width: number;
  height: number;
  code: string;
  back: boolean;
  rotate: boolean;
  rotateLeft: boolean;
  name?: string;
  placeholder?: boolean;
}) {
  const [card, loading] = useSingleCard(code, 'encounter');
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!card) {
    return (
      <TextCard name={name || code} placeholder={placeholder} />
    );
  }
  const uri = back ? card.backImageUri() : card.imageUri();
  if (!uri) {
    return (
      <TextCard name={(back && card.back_name) || card.name} placeholder={placeholder} />
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
  { height, width, left, top, fontScale, lines }: { height: number; width: number; left: number; top: number; fontScale: number; lines: number },
): {
  top?: number;
  left?: number;
  right?: number;
} {
  const annotationLineHeight = fontScale * 24 * lines;
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

export function cleanLocationCode(code: string): string {
  return code.replace('_back', '')
    .replace('_rotate_left', '')
    .replace('_rotate', '')
    .replace('_mini', '')
    .replace(RAIL_REGEX, '');
}

export default function LocationCard({ annotation, code, faded, random, height, width, left, top, name, resource_dividers, placeholder }: Props) {
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
          <Image
            style={styles.verticalCardImage}
            source={PLAYER_BACK}
            resizeMode="contain"
          />
        );
      case 'atlach':
        return (
          <Image
            style={styles.verticalCardImage}
            source={ATLACH}
            resizeMode="contain"
          />
        );
      default:
        return (
          <View style={mini ? {
              paddingTop: height * 0.1,
              paddingBottom: height * 0.1,
              paddingLeft: width * 0.1,
              paddingRight: width * 0.1,
            } : undefined
          }>
            <LocationCardImage
              name={name}
              code={cleanLocationCode(code)}
              placeholder={placeholder}
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
  const rails = useMemo(() => {
    const match = RAIL_REGEX.exec(code)?.[1];
    if (!match) {
      return null;
    }
    return (
      <>
        { match.indexOf('N') !== -1 && (
          <View key="N" style={[styles.rail, { top: top, left: left + width - RAIL_SIZE * 2 }]}>
            <AppIcon name='rail' size={RAIL_SIZE} color={colors.M} />
          </View>
        ) }
        { match.indexOf('S') !== -1 && (
          <View key="S" style={[styles.rail, { top: top + height - RAIL_SIZE, left: left + width - RAIL_SIZE * 2}]}>
            <AppIcon name='rail' size={RAIL_SIZE} color={colors.M} />
          </View>
        ) }
        { match.indexOf('E') !== -1 && (
          <View key="E" style={[styles.rail, { top: top + height - RAIL_SIZE * 2, left: left + width - RAIL_SIZE }]}>
            <View style={{transform: [{ rotate: "90deg"}] }}>
              <AppIcon name='rail' size={RAIL_SIZE} color={colors.M} />
            </View>
          </View>
        ) }
        { match.indexOf('W') !== -1 && (
          <View key="W" style={[styles.rail, { top: top + height - RAIL_SIZE * 2, left: left }]}>
            <View style={{transform: [{ rotate: "90deg"}] }}>
              <AppIcon name='rail' size={RAIL_SIZE} color={colors.M} />
            </View>
          </View>
        ) }
      </>
    );
  }, [code]);
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
      <View style={[styles.card, { width: rotate ? height : width, height: rotate ? width : height, left, top }, faded || random ? { opacity: 0.40 } : undefined]}>
        { image }
      </View>
      { resourceDividers }
      { rails }
      { !!(faded || random) && (
        <View style={{ position: 'absolute', top, left, height, width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.M }}>
          { !!random && <ArkhamIcon name="wild" size={64} color="#6C0A1A" /> }
        </View>
      )}
      { !!annotation && (
        <View style={[styles.annotation, {
          width,
          ...annotationPosition(annotation.position, { height, width, left, top, fontScale, lines: annotation.text.split('\n').length }),
        }]}>
          <Text
            numberOfLines={2}
            style={[
              typography.text,
              textAlignment,
              { lineHeight: annotationLineHeight, fontSize: fontScale * 22, width },
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
    padding: s,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  rail: {
    position: 'absolute',
    width: RAIL_SIZE,
    height: RAIL_SIZE,
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
