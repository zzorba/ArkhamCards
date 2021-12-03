import React, { useContext, useMemo } from 'react';
import LottieView from 'lottie-react-native';
import { random, set } from 'lodash';
import { t } from 'ttag';
import { Animated, StyleSheet, Text, View } from 'react-native';
import tinycolor from 'tinycolor2';
import { RefreshHeader, RefreshHeaderPropType, RefreshHeaderStateType } from 'react-native-spring-scrollview';
import StyleContext from '@styles/StyleContext';
import { SEARCH_BAR_HEIGHT } from './SearchBox';

const loadingAnimation = require('../../../assets/loading.json');

function colorizeLottie(json: any, colorByPath: Record<string, string>) {
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
  progress?: Animated.AnimatedInterpolation;
  autoPlay?: boolean;
  loop?: boolean;
  lottieRef?: React.Ref<LottieView> | React.LegacyRef<LottieView>;
  large?: boolean;
}

export default function ArkhamLoadingSpinner({
  progress,
  autoPlay,
  loop,
  lottieRef,
  large,
}: Props) {
  const { colors } = useContext(StyleContext);
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
  return (
    <LottieView
      key="playing"
      autoPlay={autoPlay}
      loop={loop}
      ref={lottieRef}
      progress={progress}
      source={colorizedSource}
      resizeMode="contain"
      style={{
        width: large ? SEARCH_BAR_HEIGHT * 2 : SEARCH_BAR_HEIGHT,
        height: large ? SEARCH_BAR_HEIGHT * 2 : SEARCH_BAR_HEIGHT,
        alignSelf: 'center',
      }}
    />
  );
}

function getRandomLoadingMessage() {
  const messages = [
    t`Investigating for clues`,
    t`Cursing at the tentacle token`,
    t`Drawing a mythos card with surge`,
    t`Placing doom on the agenda`,
    t`Reticulating spines`,
    t`Trying to make sense of the Time Warp FAQ`,
    t`Taking three damage and three horror`,
    t`Up by 5, hope I don't draw the tentacle`,
  ];
  return messages[random(0, messages.length - 1)];
}

export function useArkhamLottieHeader(noSearch?: boolean, noMessage?: boolean) {
  const { typography } = useContext(StyleContext);
  return useMemo(() => {
    return class ArkhamLottieHeader extends RefreshHeader {
      ref: React.RefObject<LottieView>;

      constructor(props: RefreshHeaderPropType) {
        super(props);

        this.ref = React.createRef<LottieView>();
        this.state = {
          ...this.state,
          message: getRandomLoadingMessage(),
        };
      }

      static height: number = SEARCH_BAR_HEIGHT;

      componentDidUpdate(prevProps: RefreshHeaderPropType, prevState: RefreshHeaderStateType) {
        if (this.state.status !== prevState.status) {
          if (this.state.status === 'refreshing') {
            this.setState({
              message: getRandomLoadingMessage(),
            });
            console.log({ play: !!this.ref.current });
            this.ref.current?.play();
          }
        }
      }
      componentDidMount() {
        if (this.state.status === 'refreshing') {
          console.log({ play: !!this.ref.current });
          this.ref.current?.play();
        }
      }
      render() {
        let progress: Animated.AnimatedInterpolation | undefined = this.props.offset.interpolate({
          inputRange: [-SEARCH_BAR_HEIGHT * 5, -SEARCH_BAR_HEIGHT * 4, -SEARCH_BAR_HEIGHT * 3, -SEARCH_BAR_HEIGHT * 2, -SEARCH_BAR_HEIGHT, 0],
          outputRange: [1, 0, 1, 0, 1, 0],
        });
        if (this.state.status === 'refreshing') {
          progress = undefined;
        }
        return (
          <View style={[styles.wrapper, { paddingTop: noSearch ? 0 : SEARCH_BAR_HEIGHT }]}>
            <ArkhamLoadingSpinner
              lottieRef={this.ref}
              progress={progress}
              autoPlay={this.state.status === 'refreshing'}
              loop={this.state.status === 'refreshing'}
            />
            { !noMessage && this.state.status === 'refreshing' && (
              <View style={{ height: SEARCH_BAR_HEIGHT }}>
                <Text style={[typography.text, typography.center]}>
                  { `${this.state.message}...` }
                </Text>
              </View>
            ) }
          </View>
        );
      }
    }
  }, [typography, noSearch, noMessage]);
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

