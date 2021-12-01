import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { find } from 'lodash';
import Scrubber from 'react-native-scrubber'
import { c, t } from 'ttag';

import { StyleContext } from '@styles/StyleContext';
import { State, usePlaybackState, useProgress } from 'react-native-track-player';

import space from '@styles/space';
import AppIcon from '@icons/AppIcon';
import { playNarrationTrack } from '@components/campaignguide/NarrationWrapper';
import { Narration } from '@data/scenario/types';
import { narrationPlayer, useAudioAccess, useCurrentTrack, useTrackDetails } from '@lib/audio/narrationPlayer';
import { usePressCallback } from '@components/core/hooks';

export function useNarration(narration?: Narration): Narration | undefined {
  const [hasAudio, narrationLang] = useAudioAccess();
  if (!hasAudio || !narration || !narrationLang || !find(narration.lang, lang => lang === narrationLang)) {
    return undefined;
  }
  return narration;
}

interface IconProps {
  narration: Narration;
}

function padZero(x: number): string {
  return x < 10 ? `0${x}` : `${x}`;
}

function parseTime(time: number): string {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time - mins * 60);
  return `${padZero(mins)}:${padZero(secs)}`
}

export function NarrationInlineControls({ narration }: IconProps) {
  const { colors, typography } = useContext(StyleContext);
  const playerState = usePlaybackState();
  const currentTrackIndex = useCurrentTrack();
  const currentTrack = useTrackDetails(currentTrackIndex);
  const { position, buffered, duration } = useProgress(1000);
  const posTime = parseTime(position);
  const durTime = parseTime(duration);

  const isCurrentTrack = currentTrack && currentTrack.narrationId === narration.id;
  // tslint:disable-next-line: strict-comparisons
  const isPlaying = playerState === State.Playing && isCurrentTrack;
  const onJumpBackPress = useCallback(async() => {
    try {
      const trackPlayer = await narrationPlayer();
      await trackPlayer.seekTo(Math.max(0, (await trackPlayer.getPosition()) - 10));
    } catch (e) {
      console.log(e);
    }
  }, []);
  const [seekPos, setSeekPos] = useState<number>();
  const onScrub = useCallback(async(pos: number) => {
    try {
      setSeekPos(pos);
      const trackPlayer = await narrationPlayer();
      await trackPlayer.seekTo(pos);
      setSeekPos(undefined);
    } catch (e) {
      console.log(e);
    }
  }, []);
  const onPressNarration = useCallback(() => {
    if (isPlaying) {
      narrationPlayer().then(trackPlayer => trackPlayer.pause());
    } else {
      playNarrationTrack(narration.id);
    }
  }, [narration, isPlaying]);
  const onPlayPausePress = usePressCallback(onPressNarration);
  return (
    <View style={[space.marginSideM, space.marginTopS]}>
      <View style={styles.narrationControls}>
        <View style={styles.leftControls}>
          <TouchableOpacity onPress={onPlayPausePress} accessibilityLabel={isPlaying ? c('narration').t`Pause` : c('narration').t`Play`}>
            <View style={[styles.button, { backgroundColor: colors.L20 }]}>
              <AppIcon
                name={isPlaying ? 'pause' : 'play'}
                size={40}
                color={colors.M}
              />
            </View>
          </TouchableOpacity>
          { isCurrentTrack ? (
            <>
              <View style={space.marginLeftXs}>
                <TouchableOpacity onPress={onJumpBackPress} accessibilityLabel={c('narration').t`Jump back`}>
                  <View style={[styles.button, { backgroundColor: colors.L20 }]}>
                    <AppIcon name="repeat" size={40} color={colors.M} />
                  </View>
                </TouchableOpacity>
              </View>
              { isPlaying && (
                <View style={space.marginLeftXs}>
                  <AppIcon name="voiceover" size={40} color={colors.M} accessibilityLabel={c('narration').t`Playing audio`} />
                </View>
              )}
            </>
          ) : (
            <Text style={[space.marginLeftS, typography.small, { color: colors.D20 }]}>{t`Narrate`}</Text>
          )}
        </View>
        <View style={styles.rightControls}>
          { (isCurrentTrack && duration > 0) && (
            <Text style={[typography.small, { color: colors.D20, textAlign: 'right', fontVariant: ['tabular-nums'] }]}>{posTime} · {durTime}</Text>
          ) }
        </View>
      </View>
      <View
        style={space.paddingTopS}
      >
        { isCurrentTrack ? (
          <Scrubber
            onSlidingComplete={onScrub}
            displayValues={false}
            value={seekPos !== undefined ? seekPos : position}
            totalDuration={duration}
            bufferedValue={buffered}
            bufferedTrackColor={colors.L10}
            trackBackgroundColor={colors.L20}
            trackColor={colors.D20}
            scrubbedColor={colors.D20}
          />
        ) : (
          <View style={{
            height: 3,
            borderRadius: 1,
            width: '100%',
            flexDirection: 'row',
            backgroundColor: colors.L10,
          }} />
        ) }
      </View>
    </View>
  );
}

interface TitleProps {
  narration: Narration;
  hideTitle: boolean;
}

function NarrationLine({ narration, hideTitle }: TitleProps) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View>
      { !hideTitle && (
        <View
          style={[space.marginSideM, space.marginTopM, styles.rowCenter]}
        >
          <Text style={[typography.header, typography.center, { color: colors.D20 }, space.paddingLeftS]}>
            { narration.name }
          </Text>
        </View>
      ) }
      <NarrationInlineControls narration={narration} />
    </View>
  );
}

interface ComponentProps {
  narration?: Narration;
  hideTitle: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export default function NarrationStepComponent(props: ComponentProps) {
  const { children, hideTitle } = props;
  const narration = useNarration(props.narration);
  return (
    <>
      { narration && <NarrationLine narration={narration} hideTitle={hideTitle} /> }
      { children }
    </>
  );
}

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  narrationControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
});
