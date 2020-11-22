import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

import { StyleContext } from '@styles/StyleContext';
import TrackPlayer, {
  STATE_PLAYING,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import space, { s } from '@styles/space';
import { playNarrationTrack } from '@components/campaignguide/Narrator';
import { Narration } from '@data/scenario/types';
import { SHOW_DISSONANT_VOICES } from '@app_constants';
import { useSelector } from 'react-redux';
import { hasDissonantVoices } from '@reducers';

export function useNarration(narration?: Narration) {
  const hasDS = useSelector(hasDissonantVoices);

  if (!SHOW_DISSONANT_VOICES || !hasDS || narration === undefined) {
    return;
  }
  return narration;
}

interface IconProps {
  narration: Narration;
}

export function NarrationStatusButton(props: IconProps) {
  const { narration } = props;

  const [playerState, setPlayerState] = useState<string | number | null>(null);
  const [currentTrackState, setCurrentTrackState] = useState<string | null>(null);

  useEffect(() => {
    TrackPlayer.getState().then(state => setPlayerState(state));
    TrackPlayer.getCurrentTrack().then(currentTrack => setCurrentTrackState(currentTrack));
  }, []);

  useTrackPlayerEvents(
    ['playback-track-changed', 'playback-state'],
    (event: any) => {
      if (event.type === 'playback-state') {
        setPlayerState(event.state);
      } else if (event.type === 'playback-track-changed') {
        setCurrentTrackState(event.nextTrack);
      }
    }
  );
  const isPlaying = playerState === STATE_PLAYING && currentTrackState === narration.id;

  const onPressNarration = useCallback(() => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      playNarrationTrack(narration.id);
    }
  }, [narration, isPlaying]);

  return (
    <Icon
      name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
      type="material"
      onPress={onPressNarration}
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
        style={{
          ...space.marginSideM,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <NarrationStatusButton narration={narration} />
        <Text style={{ ...typography.mediumGameFont, flex: 1, paddingLeft: s }}>
          {narration.name}
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
      {narration && <NarrationTitle narration={narration} />}
      {children}
    </>
  );
}
