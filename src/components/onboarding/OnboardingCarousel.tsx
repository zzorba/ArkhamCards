import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { Text, View, Platform } from 'react-native';
import { range } from 'lodash';

import Carousel from 'react-native-snap-carousel';
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
    content: <OnboardingCarousel slides={slides} width={width} onEndReached={onDismiss} />
  });
  setVisibleRef.current = setVisible;
  return [dialog, showDialog];
}


export default function OnboardingCarousel({ width, slides, onEndReached }: Props) {
  const { height } = useContext(StyleContext);
  const renderItem = useCallback(({ item }: {
    index: number;
    dataIndex: number;
    item: React.ReactNode;
  }) => {
    return item;
  }, [width, height, slides]);
  const slidesWithDummy = useMemo(() => {
    if (slides.length) {
      return [
        ...slides,
        <View key="finale" />
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
      <Carousel
        vertical={false}
        data={slidesWithDummy}
        firstItem={0}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        shouldOptimizeUpdates
        onScrollIndexChanged={onScrollIndexChanged}
        layout="tinder"
        layoutCardOffset={24}
        apparitionDelay={Platform.OS === 'ios' ? 50 : undefined}
      />
    </View>
  );
}
