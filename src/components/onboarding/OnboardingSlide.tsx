import StyleContext from '@styles/StyleContext';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { m } from '@styles/space';
import { FactionCodeType } from '@app_constants';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';

interface Props {
  title: string;
  faction: FactionCodeType;
  body: string;
  img?: string;
}

export default function OnboardingSlide({ title, faction, body, img }: Props) {
  const { colors, shadow, width, height, typography } = useContext(StyleContext);
  const sizeW = width - m * 2;
  const sizeH = height - m * 2 - NOTCH_BOTTOM_PADDING;
  const color = colors.faction[faction].background;
  return (
    <View style={{ width: width, height: sizeH, flexDirection: 'column', justifyContent: 'center', padding: m }}>
      <View style={[shadow.large, { borderWidth: 4, borderColor: color, backgroundColor: color, borderRadius: 16, flexDirection: 'column', width: sizeW }]}>
        <View style={[styles.titleBar, { padding: m, height: sizeH / 2, backgroundColor: 'red' }]} />
        <View style={[styles.bodyBar, { backgroundColor: color }]}>
          <Text style={[typography.mediumGameFont, typography.center, typography.white]}>{title}</Text>
          <Text style={[typography.text, typography.white]}>{body}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleBar: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bodyBar: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: m,
    flexDirection: 'column',
  }
})