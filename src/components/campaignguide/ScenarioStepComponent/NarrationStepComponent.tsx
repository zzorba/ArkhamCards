import React, { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-elements";
import { useSelector } from "react-redux";

import { StyleContext } from "@styles/StyleContext";
import TrackPlayer, {
  STATE_PLAYING,
  useTrackPlayerEvents,
} from "react-native-track-player";

import space, { s } from "@styles/space";
import { hasDissonantVoices } from "@reducers";
import { playNarration } from "@components/campaignguide/Narrator";
import { Narration } from "@data/scenario/types";
import { SHOW_DISSONANT_VOICES } from "@app_constants";

interface CheckProps {
  narration?: Narration;
  children: JSX.Element;
}

export function CheckDissonantVoicesComponent(props: CheckProps) {
  const { children, narration } = props;
  if (!SHOW_DISSONANT_VOICES || narration === undefined) return <></>;

  const hasDS = useSelector(hasDissonantVoices);
  return (hasDS ? children : <></>);
}

interface IconProps {
  narration: Narration;
}

export function NarrationStatusButton(props: IconProps) {
  const { narration } = props;

  const [playerState, setPlayerState] = useState<string | number | null>(null);
  const [currentTrackState, setCurrentTrackState] = useState<string | null>(null);
  
  TrackPlayer.getState().then(state => setPlayerState(state));
  TrackPlayer.getCurrentTrack().then(currentTrack => setCurrentTrackState(currentTrack));

  useTrackPlayerEvents(
    ["playback-track-changed", "playback-state"],
    (event: any) => {
      if (event.type === "playback-state") {
        setPlayerState(event.state);
      } else if (event.type === "playback-track-changed") {
        setCurrentTrackState(event.nextTrack);
      }
    }
  );
  const isPlaying = playerState === STATE_PLAYING && currentTrackState === narration.id;

  const onPressNarration = useCallback(() => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      playNarration(narration.id);
    }
  }, [narration, isPlaying]);

  return (
    <Icon
      name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
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
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
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
  children: JSX.Element;
}

export default function NarrationStepComponent(props: ComponentProps) {
  const { children, narration } = props;

  return (
    <>
      <CheckDissonantVoicesComponent narration={narration}>
        <NarrationTitle narration={narration!}/>
      </CheckDissonantVoicesComponent>
      {children}
    </>
  );
}
