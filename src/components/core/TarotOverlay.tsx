import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import { m } from '@styles/space';
import TarotCardComponent from '@components/card/TarotCardComponent';
import { TarotCard } from '@app_constants';
import { TAROT_CARD_RATIO } from '@styles/sizes';

export interface TarotProps {
  tarot: TarotCard;
  flipped: boolean;
  inverted: boolean;
  onFlip?: (id: string) => void;
  onInvert?: (id: string, inverted: boolean) => void;
}

export default function TarotOverlay({ componentId, tarot, inverted, flipped, onFlip, onInvert }: TarotProps & NavigationProps) {
  const [localFlipped, setLocalFlipped] = useState(flipped);
  const [localInverted, setLocalInverted] = useState(inverted);
  const handleInvert = useCallback((id: string, inverted: boolean) => {
    setLocalInverted(inverted);
    onInvert?.(id, inverted);
  }, [setLocalInverted, onInvert]);

  const handleFlip = useCallback((id: string) => {
    setLocalFlipped(true);
    onFlip?.(id);
  }, [setLocalFlipped, onFlip]);

  const { width, height } = useContext(StyleContext);
  const onDismiss = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, [componentId]);
  const cardWidth = useMemo(() => {
    if ((width - m * 2) * TAROT_CARD_RATIO < (height - m * 2)) {
      const effectiveHeight = Math.min(height - m * 2, 500);
      return effectiveHeight / TAROT_CARD_RATIO;
    }
    const effectiveWidth = Math.min(width - m * 2, 400);
    return effectiveWidth;
  }, [width, height]);
  return (
    <View style={[styles.root, { width, height }]}>
      <TouchableWithoutFeedback
        onPress={onDismiss}
      >
        <View style={[{ width, height }, styles.background]}>
          <TarotCardComponent
            suffix="_MODAL"
            width={cardWidth}
            card={tarot}
            flipped={localFlipped}
            onFlip={onFlip ? handleFlip : undefined}
            inverted={localInverted}
            onInvert={onInvert ? handleInvert : undefined}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    backgroundColor: 'rgba(0.0,0.0,0.0,0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
