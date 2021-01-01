import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, View, Platform, useWindowDimensions } from 'react-native';

import SearchBox, { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { m, s, xs } from '@styles/space';
import { useThrottle } from '@react-hook/throttle';

export interface SearchOptions {
  controls: React.ReactNode;
  height: number;
}

interface Props {
  prompt: string;
  advancedOptions?: SearchOptions;
  searchTerm: string;
  onSearchChange: (text: string) => void;
  children: (
    handleScroll: (...args: any[]) => void,
    showHeader: () => void
  ) => React.ReactNode;
}

const SCROLL_DISTANCE_BUFFER = 50;

export default function CollapsibleSearchBox({ prompt, advancedOptions, searchTerm, onSearchChange, children }: Props) {
  const { backgroundStyle, borderStyle, colors, shadow } = useContext(StyleContext);
  const [visible, setVisible] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const scrollAnim = useRef(new Animated.Value(1));
  const advancedToggleAnim = useRef(new Animated.Value(0));
  const lastOffsetY = useRef(0);
  const scrollY = useRef(new Animated.Value(0));
  const [offsetY, setOffsetY] = useThrottle(0, 4);
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetY(event.nativeEvent.contentOffset.y);
  }, [setOffsetY]);
  const handleScroll = useMemo(() => Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
    {
      listener: onScroll,
      useNativeDriver: false,
    },
  ), [onScroll]);


  const animateScroll = useCallback((visible: boolean) => {
    if (!advancedOpen) {
      scrollAnim.current.stopAnimation(() => {
        Animated.timing(scrollAnim.current, {
          toValue: visible ? 1 : 0,
          duration: 350,
          useNativeDriver: false,
        }).start();
      });
      setVisible(visible);
    }
  }, [scrollAnim, setVisible, advancedOpen]);
  const showHeader = useCallback(() => {
    if (!visible) {
      animateScroll(true);
    }
  }, [visible, animateScroll]);
  const hideHeader = useCallback(() => {
    if (visible && searchTerm === '') {
      animateScroll(false);
    }
  }, [searchTerm, visible, animateScroll]);
  useEffect(() => {
    /**
     * This is the throttle scrollEvent, throttled so we check it slightly
     * less often and are able to make decisions about whether we update
     * the stored scrollY or not.
     */
    if (offsetY <= 0) {
      showHeader();
    } else {
      const delta = Math.abs(offsetY - lastOffsetY.current);
      if (delta < SCROLL_DISTANCE_BUFFER) {
        // Not a long enough scroll, don't update scrollY and don't take any
        // action at all.
        return;
      }

      // We have a decent sized scroll so we will make a direction based
      // show/hide decision UNLESS we are near the top/bottom of the content.
      const scrollingUp = offsetY < lastOffsetY.current;
      if (scrollingUp) {
        showHeader();
      } else {
        hideHeader();
      }
      lastOffsetY.current = offsetY;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetY]);


  const toggleAdvanced = useCallback(() => {
    advancedToggleAnim.current.stopAnimation(() => {
      Animated.timing(advancedToggleAnim.current, {
        toValue: !advancedOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
    setAdvancedOpen(!advancedOpen);
  }, [setAdvancedOpen, advancedToggleAnim, advancedOpen]);
  const { width } = useWindowDimensions();

  const advancedOptionsBlock = useMemo(() => {
    if (!advancedOptions) {
      return null;
    }
    const controlHeight = advancedToggleAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [-(SEARCH_BAR_HEIGHT + advancedOptions.height), SEARCH_BAR_HEIGHT],
    });
    return (
      <Animated.View style={[
        styles.advancedOptions,
        shadow.large,
        {
          backgroundColor: colors.L20,
          width,
          height: advancedOptions.height,
          transform: [{ translateY: controlHeight }],
        },
        Platform.select({
          default: {},
          android: {
            borderBottomWidth: 0.2,
            borderColor: colors.L20,
          },
        }),
      ]}>
        <View style={[styles.textSearchOptions, {
          height: advancedOptions.height,
        }]}>
          { advancedOptions.controls }
        </View>
      </Animated.View>
    );
  }, [advancedOptions, width, advancedToggleAnim, colors, shadow.large]);

  const translateY = advancedOpen ? 0 : scrollAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-SEARCH_BAR_HEIGHT, 0],
  });
  const shadowOpacity = Animated.multiply(
    advancedToggleAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0.25, 0],
    }),
    scrollAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  );
  const shadowElevation = Animated.multiply(
    advancedToggleAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 0],
    }),
    scrollAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  );
  const shadowBorder = Animated.multiply(
    advancedToggleAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0],
    }),
    scrollAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  );
  return (
    <View style={[styles.wrapper, backgroundStyle]}>
      <View style={[styles.container, backgroundStyle, borderStyle]}>
        { children(handleScroll, showHeader) }
      </View>
      { advancedOpen && !!advancedOptions && Platform.OS === 'android' && (
        <View style={[
          styles.slider,
          {
            top: 0,
            width,
            height: SEARCH_BAR_HEIGHT + advancedOptions.height,
            backgroundColor: 'transparent',
          },
        ]} />
      ) }
      <Animated.View style={[
        styles.slider,
        backgroundStyle,
        {
          width,
          transform: [{ translateY }],
          height: SEARCH_BAR_HEIGHT,
          zIndex: 2,
        },
      ]}>
        { advancedOptionsBlock }
        <Animated.View needsOffscreenAlphaCompositing style={[
          styles.fixed,
          shadow.large,
          { width },
          Platform.select({
            default: { shadowOpacity },
            android: { elevation: shadowElevation, borderBottomWidth: shadowBorder, borderColor: colors.L20 },
          }),
        ]}>
          <SearchBox
            onChangeText={onSearchChange}
            placeholder={prompt}
            advancedOpen={advancedOpen}
            toggleAdvanced={advancedOptions ? toggleAdvanced : undefined}
            value={searchTerm}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  textSearchOptions: {
    paddingLeft: xs,
    paddingRight: m + s,
    paddingBottom: xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wrapper: {
    position: 'relative',
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  advancedOptions: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
