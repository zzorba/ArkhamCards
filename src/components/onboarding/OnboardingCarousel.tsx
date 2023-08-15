import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { View } from 'react-native';

import SnapCarousel from 'react-native-snap-carousel';
import StyleContext from '@styles/StyleContext';
import { m } from '@styles/space';
import { useModal } from '@components/deck/dialogs';
import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';

interface Props {
  width: number;
  slides: React.ReactNode[];
  onEndReached?: () => void;
}

export function useOnboardingCarousel(slides: React.ReactNode[]): [React.ReactNode, () => void] {
  const { width } = useContext(StyleContext);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const onDismiss = useCallback(() => {
    setVisibleRef.current?.(false);
  }, []);
  const { dialog, showDialog, setVisible } = useModal({
    allowDismiss: true,
    alignment: 'center',
    content: <OnboardingCarousel slides={slides} width={width} onEndReached={onDismiss} />,
  });
  setVisibleRef.current = setVisible;
  return [dialog, showDialog];
}


export default function OnboardingCarousel({ width, slides, onEndReached }: Props) {
  const { height } = useContext(StyleContext);
  const renderItem = useCallback(({ item }: {
    index: number;
    item: React.ReactElement;
  }): React.ReactElement => {
    return item;
  }, []);
  const slidesWithDummy: React.ReactElement[] = useMemo(() => {
    if (slides.length) {
      return [
        ...slides,
        <View key="finale" />,
      ];
    }
    return slides;
  }, [slides]);
  const onScrollIndexChanged = useCallback((index: number) => {
    if (index === slides.length && onEndReached) {
      onEndReached();
    }
  }, [slides.length, onEndReached])
  return (
    <View style={{ width, height: height - m * 2 - NOTCH_BOTTOM_PADDING }}>
      <SnapCarousel
        vertical={false}
        data={slidesWithDummy}
        defaultIndex={0}
        windowSize={3}
        inactiveSlideOpacity={1}
        renderItem={renderItem}
        width={width}
        onSnapToItem={onScrollIndexChanged}
        snapEnabled
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 25,
          parallaxAdjacentItemScale: 0.9,
        }}
        scrollAnimationDuration={350}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />
    </View>
  );
}
