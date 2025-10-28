import { findIndex, map, filter, forEach, isEqual } from 'lodash';
import { useCallback, useContext, useEffect } from 'react';
import { useAudioPlayerContext, Track } from './AudioPlayerContext';
import { getAccessToken } from '@lib/dissonantVoices';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface NarrationTrack {
  id: string;
  name: string;
  campaignCode: string;
  campaignName: string;
  scenarioName: string;
  lang: string | undefined;
}

function artist(lang: string) {
  switch (lang) {
    case 'ru': return 'Несмолкающие голоса';
    case 'es': return 'Voces disonantes';
    default: return 'Dissonant Voices';
  }
}

// Convert NarrationTrack to audio Track format
async function convertNarrationTrack(track: NarrationTrack): Promise<Track> {
  if (track.lang && track.lang !== 'dv') {
    const root = track.lang === 'ru' ? 'https://owl-dev.ru/arkham/mp3' : `https://static.arkhamcards.com/audio/${track.lang}`
    return {
      narrationId: track.id,
      title: track.name,
      artist: artist(track.lang),
      album: track.scenarioName,
      artwork: track.campaignCode,
      url: `${root}/${track.id}.mp3`,
    };
  }

  const accessToken = await getAccessToken();
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
}

// Set the narration queue with smart diffing
async function setNarrationQueue(queue: NarrationTrack[], context: ReturnType<typeof useAudioPlayerContext>): Promise<void> {
  const { queue: currentQueue, currentIndex, addTracks, removeTracks, setQueue } = context;

  const newTracks: Track[] = await Promise.all(queue.map(convertNarrationTrack));
  const newTrackIds: string[] = map(newTracks, track => track.narrationId);
  const oldTrackIds: string[] = map(currentQueue, track => track.narrationId);

  // Check if queues are identical
  if (isEqual(newTrackIds, oldTrackIds)) {
    return;
  }

  // Check if current track is in the new queue
  const currentTrack = currentIndex >= 0 && currentIndex < currentQueue.length ? currentQueue[currentIndex] : undefined;
  const currentTrackNewIndex = currentTrack ? newTrackIds.indexOf(currentTrack.narrationId) : -1;

  if (currentTrackNewIndex !== -1 && currentTrack && isEqual(currentTrack, newTracks[currentTrackNewIndex])) {
    // Current track is preserved - do smart diffing
    const diffTrackIds = filter(oldTrackIds, trackId => !newTrackIds.includes(trackId));
    const commonTracks = filter(currentQueue, track => !diffTrackIds.includes(track.narrationId));
    const commonTrackIds: Set<string> = new Set(map(commonTracks, track => track.narrationId));

    // Remove tracks not in new queue
    const removeIndexes: number[] = [];
    forEach(currentQueue, (oldTrack, idx) => {
      if (!commonTrackIds.has(oldTrack.narrationId)) {
        removeIndexes.push(idx);
      }
    });
    if (removeIndexes.length) {
      removeTracks(removeIndexes);
    }

    // Add new tracks in the right positions
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
          addTracks(tracksToInsert, oldTrackIds.length);
        } else {
          addTracks(tracksToInsert, j);
        }
        i = j;
      } else {
        i++;
      }
    }
    return;
  }

  // Otherwise reset and add all new tracks
  setQueue(newTracks);
}

export function useSetNarratinQueue(): (queue: NarrationTrack[]) => Promise<void> {
  const context = useAudioPlayerContext();
  return useCallback(async(queue: NarrationTrack[]) => {
    return await setNarrationQueue(queue, context);
  }, [context]);
}


// Play a specific narration track by ID
export function usePlayNarrationTrack(): (narrationId: string) => void {
  const { queue, skip, play } = useAudioPlayerContext();
  return useCallback((narrationId: string) => {
    const trackIndex = findIndex(queue, t => t.narrationId === narrationId);
    if (trackIndex !== -1) {
      skip(trackIndex);
      play();
    }
  }, [queue, skip, play]);
}

// Hook to check if audio is available
export function useAudioAccess(): [boolean, string[]] {
  const { audioLangs } = useContext(LanguageContext);
  return [audioLangs.length > 0, audioLangs];
}

export function useStopAudioOnUnmount() {
  const [hasAudio] = useAudioAccess();
  const { reset } = useAudioPlayerContext();
  useEffect(() => {
    if (hasAudio) {
      return () => {
        reset();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAudio]);
}
