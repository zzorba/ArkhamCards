import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { find } from 'lodash';

import { StyleContext } from '@styles/StyleContext';
import { State, usePlaybackState } from 'react-native-track-player';

import space from '@styles/space';
import { playNarrationTrack } from '@components/campaignguide/NarrationWrapper';
import { Narration } from '@data/scenario/types';
import { narrationPlayer, useAudioAccess, useCurrentTrack, useTrackDetails } from '@lib/audio/narrationPlayer';
import { usePressCallback } from '@components/core/hooks';

export function useNarration(narration?: Narration): Narration | undefined {
  const [hasDV, narrationLang] = useAudioAccess();
  if (!hasDV || !narration || !find(narration.lang, lang => lang === (narrationLang || 'dv'))) {
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
  const currentTrackIndex = useCurrentTrack();
  const currentTrack = useTrackDetails(currentTrackIndex);
  // tslint:disable-next-line: strict-comparisons
  const isPlaying = playerState === State.Playing && currentTrack && currentTrack.narrationId === narration.id;
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
