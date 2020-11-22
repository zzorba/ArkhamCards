import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import TrackPlayer, { EmitterSubscription, EventType, Track, State, useTrackPlayerEvents } from 'react-native-track-player';
import { useInterval } from '@components/core/hooks';

interface TrackPlayerFunctions {
  getQueue: () => Promise<Track[]>;
  getTrack: (id: string) => Promise<Track>;
 // getCurrentTrack: () => Promise<string>;
 // getVolume: () => Promise<number>;
 // getDuration: () => Promise<number>;
//  getPosition: () => Promise<number>;
//  getBufferedPosition: () => Promise<number>;
  getState: () => Promise<State>;
//  getRate: () => Promise<number>;
  addEventListener: (type: EventType, listener: (data: any) => void) => EmitterSubscription;
  getCurrentTrack: () => Promise<string>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skip: (trackId: string) => Promise<void>;
  add: (tracks: Track | Track[], insertBeforeId?: string) => Promise<void>;
  remove: (trackIds: string | string[]) => Promise<void>;
  reset: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  skipToPrevious: () => Promise<void>;
  getPosition: () => Promise<number>;
}

let _narrationPromise: Promise<TrackPlayerFunctions> | null = null;
export function narrationPlayer(): Promise<TrackPlayerFunctions> {
  if (_narrationPromise === null) {
    _narrationPromise = new Promise<TrackPlayerFunctions>((resolve, reject) => {
      TrackPlayer.registerPlaybackService(() => async() => {
        TrackPlayer.addEventListener('remote-play', TrackPlayer.play);
        TrackPlayer.addEventListener('remote-pause', TrackPlayer.pause);
        TrackPlayer.addEventListener('remote-next', TrackPlayer.skipToNext);
        TrackPlayer.addEventListener('remote-previous', TrackPlayer.skipToPrevious);

        await TrackPlayer.setupPlayer({});
        TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_JUMP_BACKWARD,
          ],
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
          ],
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
        });
      });
    });
  }
  return _narrationPromise;
}

export function useTrackPlayerQueue(interval: number = 100) {
  const [state, setState] = useState<TrackPlayer.Track[]>([]);
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

export function useCurrentTrackId(): string | null {
  const [state, setState] = useState<string | null>(null);
  useEffect(() => {
    narrationPlayer().then(trackPlayer => {
      trackPlayer.getCurrentTrack().then(currentTrack => setState(currentTrack));
    });
  }, []);
  useTrackPlayerEvents(['playback-track-changed'],
    (event: any) => {
      if (event.type === 'playback-track-changed') {
        setState(event.nextTrack);
      }
    }
  );
  return state;
}

export function useTrackDetails(id: string | null) {
  const [track, setTrack] = useState<TrackPlayer.Track | null>(null);
  useEffect(() => {
    let canceled = false;
    narrationPlayer().then(trackPlayer => {
      if (id) {
        trackPlayer.getTrack(id).then(track => {
          if (!canceled) {
            setTrack(track);
          }
        });
      }
      return function cancel() {
        canceled = true;
      };
    });
  }, [id]);
  return track;
}