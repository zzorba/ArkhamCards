import { findIndex } from 'lodash';
import React, { useCallback, useContext, useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  Linking,
  View,
  ViewStyle,
} from 'react-native';
import { t } from 'ttag';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { TouchableOpacity } from '@components/core/Touchables';
import EncounterIcon from '@icons/EncounterIcon';
import { StyleContext } from '@styles/StyleContext';
import space, { m } from '@styles/space';
import { useAudioPlayerContext, useCurrentTrack, usePlaybackState, useProgress, useTrackPlayerEvents, Event, State, Track } from '@lib/audio/AudioPlayerContext';
import { useAudioAccess } from '@lib/audio/narrationHelpers';
import { usePressCallback } from '@components/core/hooks';
import { useDialog } from '@components/deck/dialogs';
import { useSelector } from 'react-redux';
import { getAudioLangPreference } from '@reducers/index';


function Divider() {
  const { colors } = useContext(StyleContext);
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.M }} />
}

// function artist(lang: string) {
//   switch (lang) {
//     case 'ru': return 'Несмолкающие голоса';
//     case 'es': 'Voces disonantes';
//     default: return 'Dissonant Voices';
//   }
// }

export interface NarrationTrack {
  id: string;
  name: string;
  campaignCode: string;
  campaignName: string;
  scenarioName: string;
  lang: string | undefined;
}

interface PlayerProps {
  style?: ViewStyle;
}

function ProgressView() {
  const { colors } = useContext(StyleContext);
  const { position, duration } = useProgress(1000);
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.divider,
      }}
    >
      <View style={{ flex: position, backgroundColor: colors.D30 }} />
      <View
        style={{
          flex: duration - position,
          backgroundColor: colors.L10,
        }}
      />
    </View>
  );
}

function showDeKofi() {
  Linking.openURL('https://ko-fi.com/simplainer');
}

function showRuDonate() {
  Linking.openURL('https://www.tinkoff.ru/cf/27GmNzxhhUk');
}

function PlayerView({ style }: PlayerProps) {
  const lang = useSelector(getAudioLangPreference);
  const { colors, typography } = useContext(StyleContext);
  const track = useCurrentTrack();
  const { queue, play, pause, jumpBack, restart, skipToPrevious, skipToNext } = useAudioPlayerContext();
  const firstTrack = useMemo(() => !!track && findIndex(queue, t => t.url === track.url) === 0, [queue, track]);
  const state = usePlaybackState();
  const jumpBack10 = useCallback(() => jumpBack(10), [jumpBack]);
  const onReplayPress = usePressCallback(jumpBack10, 250);

  const onPlay = useCallback(async() => {
    if (!track && !firstTrack) {
      return;
    }
    if (state.state === State.Playing) {
      pause();
    } else {
      play();
    }
  }, [track, firstTrack, state, play, pause]);
  const onPlayPress = usePressCallback(onPlay, 250);
  const previousTrackAction = useCallback(() => {
    if (firstTrack) {
      restart();
    } else {
      skipToPrevious();
    }
  }, [firstTrack, restart, skipToPrevious]);
  const onPreviousPress = usePressCallback(previousTrackAction, 250);
  const onNextPress = usePressCallback(skipToNext, 250);

  const infoContent = useMemo(() => {
    if (lang === 'de') {
      return (
        <View>
          <Text style={typography.text}>
            { 'Die deutsche Vertonung wird von "SIMPLAINER" produziert. Wenn du das Projekt unterstützen möchtest, spendiere einen Kaffee auf ' }
            <Text key="de_kofi" style={[typography.text, typography.underline, { color: colors.D20 }]} onPress={showDeKofi}>www.ko-fi.com/simplainer</Text>.
          </Text>
        </View>
      );
    }
    if (lang === 'ru') {
      return (
        <Text style={typography.text}>
          { 'Русская озвучка — фанатский проект, который существует на добровольные пожертвования. Ты тоже ' }
          <Text key="ru_donate" style={[typography.text, typography.underline, { color: colors.D20 }]} onPress={showRuDonate}>можешь помочь</Text>.
        </Text>
      );
    }
    return null;
  }, [lang, typography, colors])

  const { dialog, showDialog } = useDialog({
    title: t`What is this?`,
    content: infoContent,
    allowDismiss: true,
  });
  useTrackPlayerEvents([Event.PlaybackError], ({ message, code }) => {
    if (code === 'playback-source') {
      if (message === 'Response code: 403') {
        // login error
      } else if (message === 'Response code: 404') {
        // file doesn't exist
      } else if (message === 'Response code: 500') {
        // server error
      }
    }
  });
  if (!queue.length) {
    return null;
  }
  return (
    <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <Divider />
      <View
        style={{
          ...(style || {}),
          display: 'flex',
          flexDirection: 'row',
          height: m * 2 + 32,
          alignItems: 'center',
          padding: m,
          backgroundColor: colors.background,
          paddingRight: infoContent ? m + 8 : m,
        }}
      >
        <View style={styles.leftRow}>
          <ArtworkView track={track} />
          <TitleView track={track} />
          <View style={space.marginLeftM}>
            <ActivityIndicator
              size={40}
              color={colors.D30}
              // tslint:disable-next-line: strict-comparisons
              animating={state.state === State.Buffering}
            />
          </View>
        </View>
        <PreviousButton onPress={onPreviousPress} />
        <ReplayButton onPress={onReplayPress} />
        { state.state === State.Playing ? (
          <PauseButton onPress={onPlayPress} />
        ) : (
          <PlayButton onPress={onPlayPress} />
        ) }
        <NextButton
          onPress={onNextPress}
          disabled={!track || findIndex(queue, t => t.url === track?.url) + 1 >= queue.length}
        />
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          { !!infoContent && <InfoButton onPress={showDialog} />}
        </View>
      </View>
      <ProgressView />
      { dialog }
    </View>
  );
}

interface ArtworkProps {
  track: Track | undefined;
}

function ArtworkView({ track }: ArtworkProps) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={{ width: 48, height: 48, marginRight: 4 }}>
      { !!track?.artwork && (
        <View
          style={{
            marginRight: 4,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          { !!(typeof track?.artwork === 'string') && (
            <EncounterIcon
              encounter_code={track?.artwork ?? ''}
              size={48}
              color={colors.D30}
            />
          ) }
        </View>
      )}
    </View>
  );
}

interface TitleProps {
  style?: ViewStyle;
  track: Track | undefined;
}

function TitleView({ style, track }: TitleProps) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={style}>
      <Text style={typography.text} numberOfLines={1} ellipsizeMode="tail">
        {track?.title}
      </Text>
      <Text style={typography.text} numberOfLines={1} ellipsizeMode="tail">
        {track?.album}
      </Text>
    </View>
  );
}

interface PlaybackButtonProps {
  name: string;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
}

function PlaybackButton({ name, size = 30, onPress, disabled }: PlaybackButtonProps) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={{ padding: 2 }}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View>
          <MaterialIcons name={name} size={size} color={disabled ? colors.D10 : colors.D30} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

interface ButtonProps {
  onPress?: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  disabled?: boolean;
}
function PreviousButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="skip-previous" onPress={onPress} />;
}
function PlayButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="play-arrow" onPress={onPress} />;
}
function PauseButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="pause" onPress={onPress} />;
}
function NextButton({ onPress, disabled }: ButtonProps) {
  return <PlaybackButton name="skip-next" disabled={disabled} onPress={onPress} />;
}
function ReplayButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="replay" onPress={onPress} />;
}

function InfoButton({ onPress }: ButtonProps) {
  return <PlaybackButton size={24} name="info" onPress={onPress} />;
}

interface NarratorContainerProps {
  children: React.ReactNode,
}

export default function NarrationWrapper({ children }: NarratorContainerProps) {
  const [hasAudio] = useAudioAccess();
  return (
    <SafeAreaView style={styles.container}>
      { children }
      { !!hasAudio && <PlayerView /> }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  leftRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
});
