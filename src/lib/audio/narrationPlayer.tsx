import { useContext, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { EmitterSubscription } from 'react-native';
import TrackPlayer, { Capability, IOSCategory, Event, Track, State, useTrackPlayerEvents, IOSCategoryMode, AddTrack, AppKilledPlaybackBehavior } from 'react-native-track-player';

import { useInterval } from '@components/core/hooks';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers';

export function useAudioAccess(): [boolean, string[]] {
  const { audioLangs } = useContext(LanguageContext);
  return [audioLangs.length > 0, audioLangs];
}

interface TrackPlayerFunctions {
  getQueue: () => Promise<Track[]>;
  getTrack: (id: number) => Promise<Track | undefined>;
  getState: () => Promise<State>;
  addEventListener: (type: Event, listener: (data: any) => void) => EmitterSubscription;
  getCurrentTrack: () => Promise<number | undefined>;
  getRate: () => Promise<number>;
  setRate: (rate: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skip: (trackId: number) => Promise<void>;
  add: (tracks: AddTrack[], insertBeforeId?: number) => Promise<void | number>;
  remove: (trackIds: number[]) => Promise<void>;
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
            android: {
              appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
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
            progressUpdateEventInterval: 2,
          });
          resolve({
            getQueue: TrackPlayer.getQueue,
            getCurrentTrack: TrackPlayer.getActiveTrackIndex,
            getTrack: TrackPlayer.getTrack,
            getRate: TrackPlayer.getRate,
            setRate: TrackPlayer.setRate,
            addEventListener: TrackPlayer.addEventListener,
            play: TrackPlayer.play,
            pause: TrackPlayer.pause,
            skipToNext: TrackPlayer.skipToNext,
            getState: async() => (await TrackPlayer.getPlaybackState()).state,
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
        console.log(e);
        reject(e);
      }
    });
  }
  return _narrationPromise;
}

async function getCurrentTrackDetails(nextTrack?: number): Promise<Track | undefined> {
  const trackPlayer = await narrationPlayer();
  const currentTrack = (nextTrack === undefined) ? await trackPlayer.getCurrentTrack() : nextTrack;
  const queue = await trackPlayer.getQueue();
  if (currentTrack === -1 || currentTrack === undefined || currentTrack >= queue.length) {
    return undefined;
  }
  return queue[currentTrack];
}

export function useCurrentTrackDetails() {
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>();
  useEffect(() => {
    let canceled = false;
    getCurrentTrackDetails().then(currentTrack => {
      if (!canceled) {
        setCurrentTrack(currentTrack);
      }
    });
    return () => {
      canceled = true;
    };
  }, []);
  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState],
    (event) => {
      switch (event.type) {
        case Event.PlaybackTrackChanged: {
          getCurrentTrackDetails(event.nextTrack).then(setCurrentTrack);
          break;
        }
        case Event.PlaybackState: {
          getCurrentTrackDetails().then(setCurrentTrack);
          break;
        }
      }
    }
  );
  return currentTrack;
}

export function usePlaybackRate(): number {
  const rate = useSelector((state: AppState) => state.settings.playbackRate || 1);
  useEffect(() => {
    narrationPlayer().then(trackPlayer => {
      trackPlayer.getRate().then(systemRate => {
        if (systemRate !== rate) {
          trackPlayer.setRate(rate);
        }
      });
    });
  }, [rate]);
  return rate;
}

export function useStopAudioOnUnmount() {
  const [hasAudio] = useAudioAccess();
  useEffect(() => {
    if (hasAudio) {
      return () => {
        narrationPlayer().then((trackPlayer) => trackPlayer.reset());
      };
    }
  }, [hasAudio]);
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
