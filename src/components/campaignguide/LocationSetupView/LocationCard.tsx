import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { map, range } from 'lodash';
import FastImage from 'react-native-fast-image';

import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import useSingleCard from '@components/card/useSingleCard';
import LoadingSpinner from '@components/core/LoadingSpinner';

const PLAYER_BACK = require('../../../../assets/player-back.png');
const ATLACH = require('../../../../assets/atlach.jpg');

interface Props {
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

function LocationCardImage({ code, back, name }: { code: string; back: boolean; name?: string }) {
  const [card, loading] = useSingleCard(code, 'encounter');
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!card) {
    return (
      <TextCard name={name || code} />
    );
  }
  const image = back ? card.backimagesrc : card.imagesrc;
  if (!image) {
    return (
      <TextCard name={(back && card.back_name) || card.name} />
    );
  }
  return (
    <FastImage
      style={styles.verticalCardImage}
      source={{
        uri: `https://arkhamdb.com${image}`,
      }}
      resizeMode="contain"
    />
  );
}

export default function LocationCard({ code, height, width, left, top, name, resource_dividers }: Props) {
  const { borderStyle, colors } = useContext(StyleContext);
  const rotate = code.indexOf('_rotate') !== -1;
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
          <LocationCardImage
            name={name}
            code={code.replace('_back', '').replace('_rotate', '')}
            back={code.indexOf('_back') !== -1}
          />
        );
    }
  }, [colors, borderStyle, code, name]);

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
      <View style={[styles.card, { width: rotate ? height : width, height: rotate ? width : height, left, top }]}>
        { image }
      </View>
      { resourceDividers }
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
});
