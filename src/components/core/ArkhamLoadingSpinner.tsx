import React, { useContext, useMemo } from 'react';
import LottieView from 'lottie-react-native';
import { set } from 'lodash';
import { Animated, View } from 'react-native';
import tinycolor from 'tinycolor2';

import StyleContext from '@styles/StyleContext';
import { searchBoxHeight } from './SearchBox';

const loadingAnimation = require('../../../assets/loading.json');

export function colorizeLottie(json: any, colorByPath: Record<string, string>) {
  const nextJson = JSON.parse(JSON.stringify(json));

  Object.entries(colorByPath).forEach(([path, color]) => {
    // incase undefined/null/falsy is passed to color
    if (!color) {
      return;
    }
    const rgbPercentages = tinycolor(color).toPercentageRgb();
    const rFraction = parseInt(rgbPercentages.r, 10) / 100;
    const gFraction = parseInt(rgbPercentages.g, 10) / 100;
    const bFraction = parseInt(rgbPercentages.b, 10) / 100;

    const pathParts = path.split('.');
    set(nextJson, [...pathParts, 0], rFraction);
    set(nextJson, [...pathParts, 1], gFraction);
    set(nextJson, [...pathParts, 2], bFraction);
  });

  return nextJson;
}

interface Props {
  progress?: Animated.AnimatedInterpolation<number>;
  autoPlay?: boolean;
  loop?: boolean;
  lottieRef?: React.Ref<LottieView> | React.LegacyRef<LottieView>;
  size?: 'large' | 'tiny' | 'default';
}

const SIZE_SCALE = {
  large: 2,
  default: 1,
  tiny: 0.75,
}
export default function ArkhamLoadingSpinner({
  progress,
  autoPlay,
  loop,
  lottieRef,
  size = 'default',
}: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  const colorizedSource = useMemo(() => colorizeLottie(
    loadingAnimation,
    {
      // Shape Layer 1.Shape 1.Stroke 1
      'assets.0.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 1.Shape 1.Fill 1
      'assets.0.layers.0.shapes.0.it.2.c.k': colors.D30,
      // Shape Layer 1.Shape 1.Stroke 1
      'assets.1.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 1.Shape 1.Fill 1
      'assets.1.layers.0.shapes.0.it.2.c.k': colors.D30,
      // Shape Layer 1.Shape 1.Stroke 1
      'assets.2.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 1.Shape 1.Fill 1
      'assets.2.layers.0.shapes.0.it.2.c.k': colors.D30,
      // Shape Layer 1.Shape 1.Stroke 1
      'assets.3.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 1.Fill 1
      'assets.3.layers.0.shapes.1.c.k': colors.D30,
      // Shape Layer 1.Shape 1.Stroke 1
      'assets.4.layers.0.shapes.0.it.1.c.k': '#ffffff',
      // Shape Layer 1.Shape 1.Fill 1
      'assets.4.layers.0.shapes.0.it.2.c.k': colors.D30,
      // Ball.Ellipse 1.Stroke 1
      'layers.4.shapes.0.it.1.c.k': '#ffffff',
      // Ball.Ellipse 1.Fill 1
      'layers.4.shapes.0.it.2.c.k': colors.D30,
    }
  ), [colors.D30]);
  const searchHeight = searchBoxHeight(fontScale);
  const scale = SIZE_SCALE[size];
  return (
    <View style={{ paddingTop: -searchHeight * scale }}>
      <LottieView
        key="playing"
        autoPlay={autoPlay}
        loop={loop}
        ref={lottieRef}
        progress={progress}
        source={colorizedSource}
        resizeMode="contain"
        cacheStrategy="strong"
        style={{
          width: searchHeight * scale,
          height: searchHeight * scale,
          alignSelf: 'center',
        }}
      />
    </View>
  );
}
