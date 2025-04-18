import { isEqual, findIndex, filter, map, forEach } from 'lodash';
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
import { Event, Track, State, usePlaybackState, useTrackPlayerEvents, useProgress } from 'react-native-track-player';

import { TouchableOpacity } from '@components/core/Touchables';
import EncounterIcon from '@icons/EncounterIcon';
import { getAccessToken } from '@lib/dissonantVoices';
import { StyleContext } from '@styles/StyleContext';
import space, { m } from '@styles/space';
import { narrationPlayer, useAudioAccess, useCurrentTrackDetails, useTrackPlayerQueue } from '@lib/audio/narrationPlayer';
import { usePressCallback } from '@components/core/hooks';
import { useDialog } from '@components/deck/dialogs';
import { useSelector } from 'react-redux';
import { getAudioLangPreference } from '@reducers/index';


function Divider() {
  const { colors } = useContext(StyleContext);
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.M }} />
}

export async function playNarrationTrack(narrationId: string) {
  const trackPlayer = await narrationPlayer();
  const tracks = await trackPlayer.getQueue();
  const trackIndex = findIndex(tracks, t => t.narrationId === narrationId);
  if (trackIndex !== -1) {
    await trackPlayer.skip(trackIndex);
    await trackPlayer.play();
  }
}

function artist(lang: string) {
  switch (lang) {
    case 'ru': return 'Несмолкающие голоса';
    case 'es': 'Voces disonantes';
    default: return 'Dissonant Voices';
  }
}

// Returns true if the current index was not preserved (a reset has occurred)
export async function setNarrationQueue(queue: NarrationTrack[]): Promise<void> {
  const trackPlayer = await narrationPlayer();
  const accessToken = await getAccessToken();

  const oldTracks = await trackPlayer.getQueue();
  if (isEqual(queue, oldTracks)) {
    return;
  }

  const oldTrackIds: string[] = map(oldTracks, (track) => track.narrationId);
  const newTracks: Track[] = map(queue, (track: NarrationTrack): Track => {
    if (track.lang && track.lang !== 'dv') {
      return {
        narrationId: track.id,
        title: track.name,
        artist: artist(track.lang),
        album: track.scenarioName,
        artwork: track.campaignCode,
        url: `https://static.arkhamcards.com/audio/${track.lang}/${track.id}.mp3`,
      };
    }
    return {
      narrationId: track.id,
      title: track.name,
      artist: 'Dissonant Voices',
      album: track.scenarioName,
      artwork: track.campaignCode,
      url: `https://north101.co.uk/api/scene/${track.id}/listen`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  });
  const newTrackIds: string[] = map(newTracks, (track) => track.narrationId);

  // if current track is in the new queue
  const currentTrackIndex = await trackPlayer.getCurrentTrack();
  const currentTrackOld = currentTrackIndex !== undefined && currentTrackIndex > -1 ? oldTracks[currentTrackIndex] : undefined;
  const currentTrackNewIndex = currentTrackOld ? newTrackIds.indexOf(currentTrackOld.narrationId) : -1;
  if (
    currentTrackNewIndex !== -1 &&
    isEqual(currentTrackOld, newTracks[currentTrackNewIndex])
  ) {
    const diffTrackIds = filter(oldTrackIds, trackId => !newTrackIds.includes(trackId));
    const commonTracks = filter(oldTracks, track => !diffTrackIds.includes(track.narrationId));
    const commonTrackIds: Set<string> = new Set(map(commonTracks, track => track.narrationId));

    const removeIndexes: number[] = [];
    forEach(oldTracks, (oldTrack, idx) => {
      if (!commonTrackIds.has(oldTrack.narrationId)) {
        removeIndexes.push(idx);
      }
    });
    if (removeIndexes.length) {
      await trackPlayer.remove(removeIndexes);
    }

    let i = 0;
    while (i < newTracks.length) {
      const tracksToInsert: Track[] = [];
      let j = i;
      while (j < newTracks.length && !commonTrackIds.has(newTracks[j].narrationId)) {
        tracksToInsert.push(newTracks[j]);
        j++;
      }
      if (tracksToInsert.length) {
        if (j >= newTracks.length) {
          // We fell off without finding an old 'common' track, so just append at the end..
          await trackPlayer.add(tracksToInsert, oldTrackIds.length);
        } else {
          // This means we found a common track to stop at, which would put it currently at position 'i' in the queue.
          await trackPlayer.add(tracksToInsert, j)
        }
        i = j;
      } else {
        i++;
      }
    }
    return;
  }

  // otherwise reset and add all the new tracks
  if (oldTracks.length) {
    await trackPlayer.reset();
  }
  await trackPlayer.add(newTracks);
}

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


async function restart() {
  try {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.seekTo(0);
  } catch (e) {
    console.log(e);
  }
}

async function replay() {
  try {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.seekTo((await trackPlayer.getPosition()) - 10);
  } catch (e) {
    console.log(e);
  }
}

async function previousTrack() {
  try {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.skipToPrevious();
  } catch (e) {
    console.log(e);
  }
}
async function nextTrack() {
  try {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.skipToNext();
  } catch (e) {
    console.log(e);
  }
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
  const track = useCurrentTrackDetails();
  const queue = useTrackPlayerQueue();
  const firstTrack = useMemo(() => !!track && findIndex(queue, t => t.url === track.url) === 0, [queue, track]);
  const state = usePlaybackState();
  const onReplayPress = usePressCallback(replay, 250);

  const onPlay = useCallback(async() => {
    if (!track && !firstTrack) {
      return;
    }
    const trackPlayer = await narrationPlayer();
    const state = await trackPlayer.getState();
    if (state === State.Playing) {
      await trackPlayer.pause();
    } else {
      await trackPlayer.play();
    }
  }, [track, firstTrack]);
  const onPlayPress = usePressCallback(onPlay, 250);
  const previousTrackAction = useCallback(() => {
    if (firstTrack) {
      restart();
    } else {
      previousTrack();
    }
  }, [firstTrack]);
  const onPreviousPress = usePressCallback(previousTrackAction, 250);
  const onNextPress = usePressCallback(nextTrack, 250);

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
    <View>
      <Divider />
      <View
        style={{
          ...(style || {}),
          display: 'flex',
          flexDirection: 'row',
          height: m * 2 + 32,
          alignItems: 'center',
          padding: m,
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
  },
  leftRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
});
