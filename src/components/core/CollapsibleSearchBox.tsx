import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, StyleSheet, View, Platform } from 'react-native';
import Animated, { useDerivedValue, interpolate, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

import SearchBox, { SearchBoxHandles, searchBoxHeight } from '@components/core/SearchBox';
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
  onSearchChange: (text: string, submit: boolean) => void;
  children: (
    handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
    showHeader: () => void,
    focus: () => void
  ) => React.ReactNode;
  banner?: React.ReactNode;
}

const SCROLL_DISTANCE_BUFFER = 50;

export default function CollapsibleSearchBox({ banner, prompt, advancedOptions, searchTerm, onSearchChange, children }: Props) {
  const { backgroundStyle, borderStyle, colors, fontScale, shadow, width } = useContext(StyleContext);
  const searchBoxRef = useRef<SearchBoxHandles>(null);
  const focus = useCallback(() => {
    searchBoxRef.current?.focus();
  }, [searchBoxRef]);
  const [visible, setVisible] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const scrollAnimPos = useSharedValue(1);
  const scrollAnim = useSharedValue(1);
  const advancedToggleAnim = useSharedValue(0);
  const lastOffsetY = useRef(0);
  const [offsetY, setOffsetY] = useThrottle(0, 4);

  const scrollY = useRef(0);
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
    setOffsetY(event.nativeEvent.contentOffset.y);
  }, [setOffsetY]);
  const animateScroll = useCallback((visible: boolean) => {
    if (!advancedOpen) {
      scrollAnim.value = withTiming(visible ? 1 : 0, { duration: 350 });
      scrollAnimPos.value = withTiming(visible ? 1 : 0, { duration: 350 });
      setVisible(visible);
    }
  }, [scrollAnim, scrollAnimPos, setVisible, advancedOpen]);
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
  const searchBarHeight = searchBoxHeight(fontScale);
  useEffect(() => {
    /**
     * This is the throttle scrollEvent, throttled so we check it slightly
     * less often and are able to make decisions about whether we update
     * the stored scrollY or not.
     */
    if (offsetY <= searchBarHeight * 2) {
      showHeader();
      return;
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetY]);


  const toggleAdvanced = useCallback(() => {
    advancedToggleAnim.value = withTiming(!advancedOpen ? 1 : 0, { duration: 250 });
    setAdvancedOpen(!advancedOpen);
  }, [setAdvancedOpen, advancedToggleAnim, advancedOpen]);
  const advancedOptionsHeight = advancedOptions?.height || 0;
  const advancedBlockAnimation = useAnimatedStyle(() => {
    const translateY = interpolate(
      advancedToggleAnim.value,
      [0, 1],
      [-(searchBarHeight + advancedOptionsHeight), searchBarHeight],
    );
    return {
      transform: [{ translateY }],
    };
  }, [advancedToggleAnim, advancedOptionsHeight, searchBarHeight]);

  const advancedOptionsBlock = useMemo(() => {
    if (!advancedOptions) {
      return null;
    }
    return (
      <Animated.View
        needsOffscreenAlphaCompositing
        style={[
          styles.advancedOptions,
          shadow.medium,
          {
            backgroundColor: colors.L20,
            width,
            height: advancedOptionsHeight,
          },
          advancedBlockAnimation,
          Platform.select({
            default: {},
            android: {
              borderBottomWidth: 0.2,
              borderColor: colors.L20,
            },
          }),
        ]}
      >
        <View style={[styles.textSearchOptions, {
          height: advancedOptionsHeight,
        }]}>
          { advancedOptions.controls }
        </View>
      </Animated.View>
    );
  }, [advancedOptions, advancedOptionsHeight, advancedBlockAnimation, width, colors, shadow.medium]);
  const wrapperStyle = useAnimatedStyle(() => {
    const translateY = advancedOpen ? 0 : interpolate(
      scrollAnimPos.value,
      [0, 1],
      [-searchBarHeight, 0],
    );
    return {
      transform: [{ translateY }],
    }
  }, [searchBarHeight, advancedOpen]);
  const isAndroid = Platform.OS === 'android';
  const shadowColor = useDerivedValue(() => colors.L20, [colors.L20]);
  const shadowStyle = useAnimatedStyle(() => {
    if (isAndroid) {
      const shadowElevation = (
        interpolate(advancedToggleAnim.value, [0, 1], [6, 0]) *
        interpolate(scrollAnim.value, [0, 1], [0, 1])
      );
      const shadowBorder = (
        interpolate(advancedToggleAnim.value, [0, 1], [0.2, 0]) *
        interpolate(scrollAnim.value, [0, 1], [0, 1])
      );
      return {
        elevation: shadowElevation,
        borderBottomWidth: shadowBorder,
        borderColor: shadowColor.value,
      };
    }
    const shadowOpacity = interpolate(advancedToggleAnim.value, [0, 1], [0.25, 0]) *
      interpolate(scrollAnim.value, [0, 1], [0, 1]);
    return { shadowOpacity: shadowOpacity };
  }, [isAndroid, shadowColor, advancedToggleAnim]);
  return (

    <View style={[styles.wrapper, backgroundStyle]}>
      <View style={[styles.container, backgroundStyle, borderStyle]}>
        { children(handleScroll, showHeader, focus) }
      </View>
      { advancedOpen && !!advancedOptions && Platform.OS === 'android' && (
        <View style={[
          styles.slider,
          {
            top: 0,
            width,
            height: searchBoxHeight(fontScale) + advancedOptions.height,
            backgroundColor: 'transparent',
          },
        ]} />
      ) }
      <Animated.View style={[
        styles.slider,
        backgroundStyle,
        {
          width,
          height: searchBoxHeight(fontScale),
          zIndex: 2,
        },
        wrapperStyle,
      ]}>
        { advancedOptionsBlock }
        <Animated.View
          needsOffscreenAlphaCompositing
          style={[
            styles.fixed,
            shadow.small,
            { width },
            shadowStyle,
          ]}
        >
          { !advancedOpen && !!banner && (
            <View style={[styles.banner, { top: searchBoxHeight(fontScale) }]}>
              { banner }
            </View>
          ) }
          <SearchBox
            ref={searchBoxRef}
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
  banner: {
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
