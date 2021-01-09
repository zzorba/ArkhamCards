import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { StyleContext } from '@styles/StyleContext';
import { STATE_PLAYING, usePlaybackState } from 'react-native-track-player';

import space from '@styles/space';
import { playNarrationTrack } from '@components/campaignguide/NarrationWrapper';
import { Narration } from '@data/scenario/types';
import { useSelector } from 'react-redux';
import { hasDissonantVoices } from '@reducers';
import { SHOW_DISSONANT_VOICES, narrationPlayer, useCurrentTrackId } from '@lib/audio/narrationPlayer';
import { usePressCallback } from '@components/core/hooks';

export function useNarration(narration?: Narration): Narration | undefined {
  const hasDS = useSelector(hasDissonantVoices);
  if (!SHOW_DISSONANT_VOICES || !hasDS || narration === undefined) {
    return undefined;
  }
  return narration;
}

interface IconProps {
  narration: Narration;
}

export function NarrationButton({ narration }: IconProps) {
  const { colors } = useContext(StyleContext);
  const playerState = usePlaybackState();
  const currentTrackId = useCurrentTrackId();
  const isPlaying = playerState === STATE_PLAYING && currentTrackId === narration.id;
  const onPressNarration = useCallback(() => {
    if (isPlaying) {
      narrationPlayer().then(trackPlayer => trackPlayer.pause());
    } else {
      playNarrationTrack(narration.id);
    }
  }, [narration, isPlaying]);
  const onPress = usePressCallback(onPressNarration);
  return (
    <Icon
      name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
      type="material"
      onPress={onPress}
      color={colors.D30}
    />
  );
}

interface TitleProps {
  narration: Narration;
}

export function NarrationTitle(props: TitleProps) {
  const { narration } = props;
  const { typography } = useContext(StyleContext);
  return (
    <View style={space.marginTopM}>
      <View
        style={[space.marginSideM, styles.rowLeft]}
      >
        <NarrationButton narration={narration} />
        <Text style={[typography.mediumGameFont, space.paddingLeftS]}>
          { narration.name }
        </Text>
      </View>
    </View>
  );
}

interface ComponentProps {
  narration?: Narration;
  children: React.ReactNode | React.ReactNode[];
}

export default function NarrationStepComponent(props: ComponentProps) {
  const { children } = props;
  const narration = useNarration(props.narration);
  return (
    <>
      { narration && <NarrationTitle narration={narration} /> }
      { children }
    </>
  );
}

const styles = StyleSheet.create({
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
