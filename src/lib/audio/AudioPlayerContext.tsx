import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, AudioSource } from 'expo-audio';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers';

// ===== Types =====
export interface Track {
  narrationId: string;
  title: string;
  artist: string;
  album: string;
  artwork?: string;
  url: string;
  headers?: Record<string, string>;
}

export enum PlayerState {
  None = 'none',
  Ready = 'ready',
  Playing = 'playing',
  Paused = 'paused',
  Buffering = 'buffering',
  Ended = 'ended',
  Error = 'error',
}

export const Event = {
  PlaybackTrackChanged: 'PlaybackTrackChanged',
  PlaybackState: 'PlaybackState',
  PlaybackError: 'PlaybackError',
};

export const State = PlayerState;

interface AudioPlayerContextValue {
  queue: Track[];
  currentIndex: number;
  playbackRate: number;
  playing: boolean;
  currentTime: number;
  duration: number;

  // Player controls
  play: () => void;
  pause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  skip: (trackId: number) => void;
  seekTo: (seconds: number) => void;
  setRate: (rate: number) => void;
  jumpBack: (seconds: number) => void;
  restart: () => void;

  // Queue management
  setQueue: (tracks: Track[]) => void;
  addTracks: (tracks: Track[], insertBeforeId?: number) => void;
  removeTracks: (trackIds: number[]) => void;
  reset: () => void;
  removeUpcomingTracks: () => void;

  // Event system
  addEventListener: (event: string, listener: (data: any) => void) => { remove: () => void };
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

// ===== Provider =====

interface AudioPlayerProviderProps {
  children: ReactNode;
  initialPlaybackRate?: number;
}

export function AudioPlayerProvider({ children, initialPlaybackRate = 1.0 }: AudioPlayerProviderProps) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const reduxPlaybackRate = useSelector((state: AppState) => state.settings.playbackRate);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [playbackRate, setPlaybackRate] = useState<number>(reduxPlaybackRate ?? initialPlaybackRate);

  const previousDidJustFinish = useRef(false);
  const eventListeners = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  // Event emitter
  const emitEvent = useCallback((event: string, data?: any) => {
    const listeners = eventListeners.current.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (e) {
          console.error('Error in event listener:', e);
        }
      });
    }
  }, []);

  const addEventListener = useCallback((event: string, listener: (data: any) => void) => {
    if (!eventListeners.current.has(event)) {
      eventListeners.current.set(event, new Set());
    }
    eventListeners.current.get(event)!.add(listener);

    return {
      remove: () => {
        const listeners = eventListeners.current.get(event);
        if (listeners) {
          listeners.delete(listener);
        }
      },
    };
  }, []);

  // Load track at index
  const loadTrackAtIndex = useCallback((index: number, autoPlay: boolean = false) => {
    if (index < 0 || index >= queue.length) {
      return;
    }

    const track = queue[index];
    const previousIndex = currentIndex;

    try {
      const source: AudioSource = track.headers
        ? { uri: track.url, headers: track.headers }
        : { uri: track.url };

      player.replace(source);
      setCurrentIndex(index);

      // Apply playback rate
      if (playbackRate !== 1.0) {
        player.setPlaybackRate(playbackRate);
      }

      // Emit track changed event
      if (previousIndex !== index) {
        emitEvent(Event.PlaybackTrackChanged, {
          previousTrack: previousIndex,
          nextTrack: index,
          track,
        });
      }

      if (autoPlay) {
        setTimeout(() => player.play(), 50);
      }
    } catch (error) {
      console.error('Error loading track:', error);
      emitEvent(Event.PlaybackError, {
        message: String(error),
        code: 'playback-source',
      });
    }
  }, [queue, currentIndex, player, playbackRate, emitEvent]);

  // Auto-advance on track completion
  useEffect(() => {
    if (status.didJustFinish && !previousDidJustFinish.current) {
      previousDidJustFinish.current = true;

      if (currentIndex < queue.length - 1) {
        loadTrackAtIndex(currentIndex + 1, true);
      } else {
        emitEvent(Event.PlaybackState, { state: PlayerState.Ended });
      }
    } else if (!status.didJustFinish) {
      previousDidJustFinish.current = false;
    }
  }, [status.didJustFinish, currentIndex, queue.length, loadTrackAtIndex, emitEvent]);

  // Emit playing state changes
  useEffect(() => {
    if (status.playing !== undefined) {
      emitEvent(Event.PlaybackState, {
        state: status.playing ? PlayerState.Playing : PlayerState.Paused,
      });
    }
  }, [status.playing, emitEvent]);

  // Player controls
  const play = useCallback(() => {
    if (currentIndex === -1 && queue.length > 0) {
      loadTrackAtIndex(0, true);
    } else {
      player.play();
    }
  }, [currentIndex, queue.length, loadTrackAtIndex, player]);

  const pause = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      // Player may have been released - log the error
      console.log('Error pausing player:', error);
    }
  }, [player]);

  const skipToNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      loadTrackAtIndex(currentIndex + 1, true);
    }
  }, [currentIndex, queue.length, loadTrackAtIndex]);

  const skipToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      loadTrackAtIndex(currentIndex - 1, true);
    }
  }, [currentIndex, loadTrackAtIndex]);

  const skip = useCallback((trackId: number) => {
    loadTrackAtIndex(trackId, false);
  }, [loadTrackAtIndex]);

  const seekTo = useCallback((seconds: number) => {
    player.seekTo(seconds);
  }, [player]);

  const setRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    player.setPlaybackRate(rate);
  }, [player]);

  // Queue management
  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks);
    setCurrentIndex(-1);
  }, []);

  const addTracks = useCallback((tracks: Track[], insertBeforeId?: number) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      if (insertBeforeId !== undefined) {
        newQueue.splice(insertBeforeId, 0, ...tracks);
      } else {
        newQueue.push(...tracks);
      }
      return newQueue;
    });
  }, []);

  const removeTracks = useCallback((trackIds: number[]) => {
    const sortedIds = [...trackIds].sort((a, b) => b - a);
    setQueueState(prev => {
      const newQueue = [...prev];
      let newIndex = currentIndex;

      for (const id of sortedIds) {
        if (id >= 0 && id < newQueue.length) {
          newQueue.splice(id, 1);
          if (id < newIndex) {
            newIndex--;
          } else if (id === newIndex) {
            newIndex = -1;
          }
        }
      }

      setCurrentIndex(newIndex);
      return newQueue;
    });
  }, [currentIndex]);

  const reset = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      // Player may have already been released - ignore the error
      console.log('Error pausing player during reset:', error);
    }
    try {
      player.remove();
    } catch (error) {
      // Player may have already been released - ignore the error
      console.log('Error removing player during reset:', error);
    }
    setQueueState([]);
    setCurrentIndex(-1);
  }, [player]);

  const removeUpcomingTracks = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      setQueueState(prev => prev.slice(0, currentIndex + 1));
    }
  }, [currentIndex, queue.length]);

  const jumpBack = useCallback((seconds: number) => {
    seekTo(Math.max(0, statusRef.current.currentTime - seconds));
  }, [seekTo, statusRef]);
  const restart = useCallback(() => {
    seekTo(0);
  }, [seekTo]);

  const value: AudioPlayerContextValue = {
    queue,
    currentIndex,
    playbackRate,
    playing: status.playing || false,
    currentTime: status.currentTime || 0,
    duration: status.duration || 0,

    play,
    pause,
    skipToNext,
    skipToPrevious,
    skip,
    seekTo,
    setRate,
    jumpBack,
    restart,

    setQueue,
    addTracks,
    removeTracks,
    reset,
    removeUpcomingTracks,

    addEventListener,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

// ===== Hooks =====

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
}

export function useCurrentTrack(): Track | undefined {
  const { queue, currentIndex } = useAudioPlayerContext();
  if (currentIndex >= 0 && currentIndex < queue.length) {
    return queue[currentIndex];
  }
  if (currentIndex === -1 && queue.length) {
    return queue[0];
  }
  return undefined;
}

export function usePlaybackState(): { state: PlayerState } {
  const { playing, currentTime, duration, currentIndex } = useAudioPlayerContext();

  if (currentIndex === -1) {
    return { state: PlayerState.None };
  }

  if (playing) {
    return { state: PlayerState.Playing };
  }

  if (currentTime >= duration && duration > 0) {
    return { state: PlayerState.Ended };
  }

  return { state: PlayerState.Paused };
}

export function useProgress(): { position: number; duration: number } {
  const { currentTime, duration } = useAudioPlayerContext();
  return { position: currentTime, duration };
}

export function useTrackQueue(): Track[] {
  const { queue } = useAudioPlayerContext();
  return queue;
}

export function useTrackPlayerEvents(events: string[], handler: (event: any) => void) {
  const { addEventListener } = useAudioPlayerContext();

  useEffect(() => {
    const subscriptions = events.map(event =>
      addEventListener(event, data => {
        handler({ type: event, ...data });
      })
    );

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, [events, handler, addEventListener]);
}
