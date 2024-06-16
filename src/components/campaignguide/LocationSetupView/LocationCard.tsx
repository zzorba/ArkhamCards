import React, { useContext, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { withAnchorPoint } from 'react-native-anchor-point';
import { map, range, transform } from 'lodash';
import { FasterImageView as FastImage } from '@candlefinance/faster-image';

import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import useSingleCard from '@components/card/useSingleCard';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { LocationAnnotation } from '@data/scenario/types';
import ToolTip from '@components/core/ToolTip';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardTextComponent from '@components/card/CardTextComponent';

const PLAYER_BACK = require('../../../../assets/player-back.png');
const ATLACH = require('../../../../assets/atlach.jpg');
const RAIL_SIZE = 25;
interface Props {
  keyProp: string;
  annotations: LocationAnnotation[];
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
  rotate?: 'left' | 'right' | 'invert';
  rowWidth: number;
  rowHeight: number;
}

function TextCard({ name, placeholder }: { name: string; placeholder?: boolean; }) {
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

function LocationCardImage({ code, back, name, width, height, placeholder, toggle, setToggle }: {
  width: number;
  height: number;
  code: string;
  back: boolean;
  name?: string;
  placeholder?: boolean;
  toggle: boolean;
  setToggle: (value: boolean) => void;
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
  const url = back ? card.backImageUri() : card.imageUri();
  if (!url) {
    return (
      <TextCard
        name={(back && card.back_name) || card.name}
        placeholder={placeholder}
      />
    );
  }
  return (
    <ToolTip label={(back && card.back_name) || card.name} height={height} width={width} toggle={toggle} setToggle={setToggle}>
      <FastImage
        style={{ width, height }}
        source={{
          url,
          cachePolicy: 'discNoCacheControl',
          resizeMode: 'contain',
        }}
      />
    </ToolTip>
  );
}

function annotationPosition(
  annotation: LocationAnnotation,
  { height, width, left, top, fontScale, lines, rowWidth, hasResourceDividers,  }: {
    height: number; width: number; left: number; top: number; fontScale: number; lines: number;
    rowWidth: number; rowHeight: number;
    hasResourceDividers: boolean;
 },
): {
  top?: number;
  left?: number;
  right?: number;
} {
  const annotationLineHeight = fontScale * 24 * lines;
  switch (annotation.position) {
    case 'top': {
      const shift = (1 - (annotation.height ?? 1)) * height;
      return {
        top: top - annotationLineHeight + shift,
        left,
      };
    }
    case 'bottom':
      return {
        top: top + height,
        left,
      };
    case 'left':
      return {
        top: top + (height - annotationLineHeight) / 2,
        right: rowWidth - left,
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
    .replace('_invert', '')
    .replace(RAIL_REGEX, '');
}

export default function LocationCard({ keyProp, rowWidth, rowHeight, annotations, rotate, code, faded, random, height, width, left, top, name, resource_dividers, placeholder }: Props) {
  const { borderStyle, colors } = useContext(StyleContext);
  const mini = code.indexOf('_mini') !== -1;

  const transformStyle = useMemo(() => {
    switch (rotate) {
      case 'left':
        return withAnchorPoint({ transform: [{ rotate: '-90deg' }] }, { x: 0, y: 1 }, { width, height });
      case 'right':
        return withAnchorPoint({ transform: [{ rotate: '90deg' }] }, { x: 1, y: 0 }, { width, height });
      case 'invert':
        return { transform: [{ rotate: '-180deg' }] };
      default:
        return undefined;
    }
  }, [rotate, width, height]);

  const [theWidth, theHeight] = mini ? [width * 0.75, height * 0.75] : [width, height];
  const [toggle, setToggle] = useState(false);
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
              toggle={toggle}
              setToggle={setToggle}
              code={cleanLocationCode(code)}
              placeholder={placeholder}
              back={code.indexOf('_back') !== -1}
              width={theWidth}
              height={theHeight}
            />
          </View>
        );
    }
  }, [colors, toggle, setToggle, borderStyle, mini, theHeight, theWidth, code, name, height, rotate, width]);
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
  return (
    <>
      <View style={[
        styles.card,
        { top, left },
        faded || random ? { opacity: 0.40 } : undefined,
        toggle ? { zIndex: 10 } : undefined,
      ]}>
        <View style={[{ width, height }, transformStyle]}>
          { image }
        </View>
      </View>
      { resourceDividers }
      { rails }
      { !!(faded || random) && (
        <View style={{ position: 'absolute', top, left, height, width, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.M }}>
          { !!random && <ArkhamIcon name="wild" size={64} color="#6C0A1A" /> }
        </View>
      )}
      { map(annotations, (annotation, idx) => (
        <AnnotationComponent
          key={`${keyProp}_annotation_${idx}`}
          annotation={annotation}
          width={width}
          height={height}
          rowWidth={rowWidth}
          rowHeight={rowHeight}
          top={top}
          left={left}
          hasResourceDividers={!!resourceDividers}
        />
      ))}
    </>
  );
}

function AnnotationComponent({ annotation, width, height, left, top, rowWidth, rowHeight, hasResourceDividers }: {
  annotation: LocationAnnotation;
  width: number;
  height: number;
  rowWidth: number;
  rowHeight: number;
  left: number;
  top: number;
  hasResourceDividers: boolean;
}) {
  const { typography, fontScale } = useContext(StyleContext);
  let textAlignment: TextStyle;
  if (annotation.alignment || annotation.style === 'description') {
    switch (annotation.alignment ?? 'left') {
      case 'left':
        textAlignment = typography.left;
        break;
      case 'right':
        textAlignment = typography.right;
        break;
      case 'center':
        textAlignment = typography.center;
        break;
    }
  } else {
    switch (annotation.position) {
      case 'left':
        textAlignment = typography.right;
        break;
      case 'right':
        textAlignment = typography.left;
        break;
      case 'top':
      default:
        textAlignment = typography.center;
        break;
    }
  }

  return (
    <View style={[styles.annotation, {
      width: width * (annotation.width ?? 1),
      height: height * (annotation.height ?? 1),
      ...annotationPosition(annotation, {
        height, width, left, top, fontScale,
        rowWidth,
        rowHeight,
        lines: annotation.text.split('\n').length,
        hasResourceDividers,
      }),
    }]}>
      { annotation.style === 'description' ? (
        <CardTextComponent
          text={annotation.text}
          style={textAlignment}
        />
      ) : (
        <Text
          numberOfLines={2}
          style={[
            textAlignment,
            typography.text,
            [
              { lineHeight: fontScale * 24, fontSize: fontScale * 22 },
              typography.bold,
            ],
            { width: width * (annotation.width ?? 1) },
          ]}>
          { annotation.text }
        </Text>
      ) }
    </View>
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
