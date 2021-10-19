import { useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { EmitterSubscription } from 'react-native';
import TrackPlayer, { Capability, IOSCategory, Event, Track, State, useTrackPlayerEvents, IOSCategoryMode } from 'react-native-track-player';

import { useInterval } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';

export function useAudioAccess(): [boolean, string | undefined] {
  const { audioLang } = useContext(LanguageContext);
  return [!!audioLang, audioLang];
}

interface TrackPlayerFunctions {
  getQueue: () => Promise<Track[]>;
  getTrack: (id: number) => Promise<Track>;
  getState: () => Promise<State>;
  addEventListener: (type: Event, listener: (data: any) => void) => EmitterSubscription;
  getCurrentTrack: () => Promise<number>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skip: (trackId: number) => Promise<void>;
  add: (tracks: Track | Track[], insertBeforeId?: number) => Promise<void>;
  remove: (trackIds: number | number[]) => Promise<void>;
  reset: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  skipToPrevious: () => Promise<void>;
  getPosition: () => Promise<number>;
  removeUpcomingTracks: () => Promise<void>;
}

let _narrationPromise: Promise<TrackPlayerFunctions> | null = null;
export function narrationPlayer(): Promise<TrackPlayerFunctions> {
  if (_narrationPromise === null) {
    _narrationPromise = new Promise<TrackPlayerFunctions>((resolve, reject) => {
      try {
        TrackPlayer.setupPlayer({
          iosCategory: IOSCategory.Playback,
          iosCategoryMode: IOSCategoryMode.SpokenAudio,
        }).then(() => {
          TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              Capability.JumpBackward,
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
            ],
          });
          TrackPlayer.registerPlaybackService(() => async() => {
            TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);
            TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);
            TrackPlayer.addEventListener(Event.RemoteNext, TrackPlayer.skipToNext);
            TrackPlayer.addEventListener(Event.RemotePrevious, TrackPlayer.skipToPrevious);
          });
          resolve({
            getQueue: TrackPlayer.getQueue,
            getCurrentTrack: TrackPlayer.getCurrentTrack,
            getTrack: TrackPlayer.getTrack,
            addEventListener: TrackPlayer.addEventListener,
            play: TrackPlayer.play,
            pause: TrackPlayer.pause,
            stop: TrackPlayer.stop,
            skipToNext: TrackPlayer.skipToNext,
            getState: TrackPlayer.getState,
            skip: TrackPlayer.skip,
            add: TrackPlayer.add,
            remove: TrackPlayer.remove,
            reset: TrackPlayer.reset,
            seekTo: TrackPlayer.seekTo,
            skipToPrevious: TrackPlayer.skipToPrevious,
            getPosition: TrackPlayer.getPosition,
            removeUpcomingTracks: TrackPlayer.removeUpcomingTracks,
          });
        }, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
  return _narrationPromise;
}

export function useTrackPlayerQueue(interval: number = 100) {
  const [state, setState] = useState<Track[]>([]);
  const getProgress = async() => {
    const trackPlayer = await narrationPlayer();
    const newQueue = await trackPlayer.getQueue();
    if (!isEqual(newQueue, state)) {
      setState(newQueue);
    }
  };

  useInterval(getProgress, interval);
  return state;
}

export function useCurrentTrack(): number | null {
  const [state, setState] = useState<number | null>(null);
  useEffect(() => {
    let canceled = false;
    narrationPlayer().then(trackPlayer => {
      trackPlayer.getCurrentTrack().then(currentTrack => {
        if (!canceled) {
          setState(currentTrack);
        }
      });
    });
    return () => {
      canceled = true;
    };
  }, []);
  useTrackPlayerEvents([Event.PlaybackTrackChanged],
    ({ type, nextTrack }) => {
      if (type === Event.PlaybackTrackChanged) {
        setState(nextTrack);
      }
    }
  );
  return state;
}

export function useTrackDetails(index: number | null) {
  const [track, setTrack] = useState<Track | null>(null);
  useEffect(() => {
    let canceled = false;
    narrationPlayer().then(trackPlayer => {
      if (index !== null && index >= 0) {
        trackPlayer.getTrack(index).then(track => {
          if (!canceled) {
            setTrack(track);
          }
        });
      }
      return function cancel() {
        canceled = true;
      };
    });
  }, [index]);
  return track;
}

export function useStopAudioOnUnmount() {
  const [hasAudio] = useAudioAccess();
  useEffect(() => {
    if (hasAudio) {
      return function() {
        narrationPlayer().then(trackPlayer => {
          trackPlayer.stop().then(() => trackPlayer.removeUpcomingTracks());
        });
      };
    }
  }, [hasAudio]);
}