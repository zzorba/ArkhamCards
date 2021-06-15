import { isEqual } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import TrackPlayer, { EmitterSubscription, usePlaybackState, useTrackPlayerEvents, useTrackPlayerProgress } from 'react-native-track-player';

import EncounterIcon from '@icons/EncounterIcon';
import { getAccessToken } from '@lib/dissonantVoices';
import { hasDissonantVoices } from '@reducers';
import { StyleContext } from '@styles/StyleContext';
import space, { m } from '@styles/space';
import { SHOW_DISSONANT_VOICES, narrationPlayer, useCurrentTrackId, useTrackDetails, useTrackPlayerQueue } from '@lib/audio/narrationPlayer';
import { usePressCallback } from '@components/core/hooks';

export async function playNarrationTrack(trackId: string) {
  if (SHOW_DISSONANT_VOICES) {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.skip(trackId);
    await trackPlayer.play();
  }
}

export async function setNarrationQueue(queue: NarrationTrack[]) {
  const trackPlayer = await narrationPlayer();
  const accessToken = await getAccessToken();

  const oldTracks = await trackPlayer.getQueue();
  if (isEqual(queue, oldTracks)) {
    return;
  }

  const oldTrackIds = oldTracks.map((track) => track.id);
  const newTracks = queue.map((track) => {
    console.log(`https://north101.co.uk/api/scene/${track.id}/listen`)
    console.log({
      Authorization: `Bearer ${accessToken}`,
    })
    return {
      id: track.id,
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
  const newTrackIds = newTracks.map((track) => track.id);

  // if current track is in the new queue
  const currentTrackId = await trackPlayer.getCurrentTrack();
  const currentTrackOld = oldTracks.find(track => track.id === currentTrackId);
  const currentTrackNewIndex = newTrackIds.indexOf(currentTrackId);
  if (
    currentTrackNewIndex !== -1 &&
    isEqual(currentTrackOld, newTracks[currentTrackNewIndex])
  ) {
    const diffTrackIds = oldTrackIds.filter(trackId => !newTrackIds.includes(trackId));
    const commonTracks = oldTracks.filter(track => !diffTrackIds.includes(track.id));
    const commonTrackIds = commonTracks.map(track => track.id);
    const currentTrackCommonIndex = commonTrackIds.indexOf(currentTrackId);

    // find the number of tracks that are the same before our current track
    const tracksBefore = [...newTracks.slice(0, currentTrackNewIndex + 1).reverse(), null].findIndex((track, index) => {
      return !isEqual(track, commonTracks[currentTrackCommonIndex - index]);
    });

    // find the number of tracks that are the same after our current track
    const tracksAfter = [...newTracks.slice(currentTrackNewIndex), null].findIndex((track, index) => {
      return !isEqual(track, commonTracks[currentTrackCommonIndex + index]);
    });

    // Remove tracks that don't match our new queue
    const removeTrackIds = [
      ...diffTrackIds,
      ...commonTrackIds.filter(
        (_, index) =>
          index <= currentTrackCommonIndex - tracksBefore ||
          index >= currentTrackCommonIndex + tracksAfter
      ),
    ];
    if (removeTrackIds.length > 0) {
      await trackPlayer.remove(removeTrackIds);
    }

    // add all the new tracks before the current track
    const addTracksBefore = newTracks.slice(0, currentTrackNewIndex - tracksBefore + 1);
    if (addTracksBefore.length > 0) {
      await trackPlayer.add(addTracksBefore, newTrackIds[currentTrackNewIndex - tracksBefore]);
    }

    // add all the new tracks after the current track
    const addTracksAfter = newTracks.slice(currentTrackNewIndex + tracksAfter);
    if (addTracksAfter.length > 0) {
      await trackPlayer.add(addTracksAfter);
    }
  } else {
    // otherwise reset and add all the new tracks
    await trackPlayer.reset();
    await trackPlayer.add(newTracks);
  }
}

export interface NarrationTrack {
  id: string;
  name: string;
  campaignCode: string;
  campaignName: string;
  scenarioName: string;
}

interface PlayerProps {
  style?: ViewStyle;
}

interface PlayerState {
  track: TrackPlayer.Track | null;
  state: TrackPlayer.State | null;
}


function ProgressView() {
  const { colors } = useContext(StyleContext);
  const { position, duration } = useTrackPlayerProgress(1000);
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

async function replay() {
  try {
    const trackPlayer = await narrationPlayer();
    await trackPlayer.seekTo((await trackPlayer.getPosition()) - 30);
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

function PlayerView({ style }: PlayerProps) {
  const { colors } = useContext(StyleContext);
  const trackId = useCurrentTrackId();
  const track = useTrackDetails(trackId);
  const queue = useTrackPlayerQueue();
  const state = usePlaybackState();
  const onReplayPress = usePressCallback(replay, 250);

  const onPlay = useCallback(async() => {
    if (!track) {
      return;
    }
    const trackPlayer = await narrationPlayer();
    if (state === TrackPlayer.STATE_PLAYING) {
      await trackPlayer.pause();
    } else {
      await trackPlayer.play();
    }
  }, [track, state]);
  const onPlayPress = usePressCallback(onPlay, 250);
  const onPreviousPress = usePressCallback(previousTrack, 250);
  const onNextPress = usePressCallback(nextTrack, 250);
  useTrackPlayerEvents(['playback-error'], (event: any) => {
    if (event.code === 'playback-source') {
      if (event.message === 'Response code: 403') {
        // login error
      } else if (event.message === 'Response code: 404') {
        // file doesn't exist
      } else if (event.message === 'Response code: 500') {
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
        }}
      >
        <View style={styles.leftRow}>
          <ArtworkView track={track} />
          <TitleView track={track} />
          <View style={space.marginLeftM}>
            <ActivityIndicator
              size={40}
              color={colors.D30}
              animating={state === TrackPlayer.STATE_BUFFERING}
            />
          </View>
        </View>
        <PreviousButton onPress={onPreviousPress} />
        <ReplayButton onPress={onReplayPress} />
        { state === TrackPlayer.STATE_PLAYING ? (
          <PauseButton onPress={onPlayPress} />
        ) : (
          <PlayButton onPress={onPlayPress} />
        ) }
        <NextButton onPress={onNextPress} />
      </View>
      <ProgressView />
    </View>
  );
}

interface ArtworkProps {
  track: TrackPlayer.Track | null;
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
          <EncounterIcon
            encounter_code={track?.artwork ?? ''}
            size={48}
            color={colors.D30}
          />
        </View>
      )}
    </View>
  );
}

interface TitleProps {
  style?: ViewStyle;
  track: TrackPlayer.Track | null;
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
  type?: string;
  size?: number;
  onPress?: () => void;
}

function PlaybackButton({ name, type = 'material', size = 30, onPress }: PlaybackButtonProps) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={{ padding: 2 }}>
      <Icon name={name} type={type} size={size} onPress={onPress} color={colors.D30} />
    </View>
  );
}

interface ButtonProps {
  onPress?: () => void;
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
function NextButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="skip-next" onPress={onPress} />;
}
function ReplayButton({ onPress }: ButtonProps) {
  return <PlaybackButton name="replay" onPress={onPress} />;
}

interface TrackProps {
  track: TrackPlayer.Track;
  isCurrentTrack: boolean;
}

function TrackView({ track, isCurrentTrack }: TrackProps) {
  const playNarration = useCallback(() => {
    playNarrationTrack(track.id);
  }, [track.id]);
  return (
    <TouchableHighlight onPress={playNarration}>
      <>
        <Divider />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: m * 2 + 32,
            width: '100%',
            alignItems: 'center',
            padding: m,
            backgroundColor: isCurrentTrack ? 'grey' : 'transparent',
          }}
        >
          <ArtworkView track={track} />
          <TitleView style={{ flex: 1 }} track={track} />
        </View>
      </>
    </TouchableHighlight>
  );
}

interface PlaylistProps {
  style?: ViewStyle;
  queue: TrackPlayer.Track[];
}

function PlaylistView({ style, queue }: PlaylistProps) {
  const [currentTrackId, setCurrenTrackId] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    let listener: EmitterSubscription | undefined = undefined;
    narrationPlayer().then(trackPlayer => {
      listener = trackPlayer.addEventListener(
        'playback-track-changed',
        (data) => {
          if (!canceled) {
            setCurrenTrackId(data.nextTrack);
          }
        }
      );
      trackPlayer.getCurrentTrack().then(currentTrackId => {
        if (!canceled) {
          setCurrenTrackId(currentTrackId);
        }
      });
    });
    return () => {
      canceled = true;
      if (listener) {
        listener.remove();
      }
    };
  }, []);
  return (
    <View style={style}>
      { queue.map((track) => (
        <TrackView
          key={track.id}
          track={track}
          isCurrentTrack={currentTrackId === track.id}
        />
      ))}
      <Divider />
    </View>
  );
}

interface NarratorContainerProps {
  children: JSX.Element,
}

export default function NarrationWrapper({ children }: NarratorContainerProps) {
  const hasDV = useSelector(hasDissonantVoices);
  return (
    <SafeAreaView style={styles.container}>
      { children }
      { !!(SHOW_DISSONANT_VOICES && hasDV) && <PlayerView /> }
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
