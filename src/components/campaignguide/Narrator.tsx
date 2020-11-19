import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import EncounterIcon from '@icons/EncounterIcon';
import { getAccessToken } from '@lib/dissonantVoices';
import { AppState, hasDissonantVoices } from '@reducers';
import { StyleContext, StyleContextType } from '@styles/StyleContext';
import { m } from '@styles/space';
import { SHOW_DISSONANT_VOICES } from '@app/App';

export async function playNarration(trackId: string) {
  if (SHOW_DISSONANT_VOICES) {
    await TrackPlayer.skip(trackId);
    await TrackPlayer.play();
  }
}

export async function queueNarration(queue: NarrationTrack[]) {
  const accessToken = await getAccessToken();

  const oldTracks = await TrackPlayer.getQueue();
  const oldTrackIds = oldTracks.map((track) => track.id);
  const newTracks = queue.map((track) => {
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
  const currentTrackId = await TrackPlayer.getCurrentTrack();
  const currentTrack = currentTrackId && await TrackPlayer.getTrack(currentTrackId);
  const currentTrackIndex = newTrackIds.indexOf(currentTrackId);
  if (
    currentTrackIndex !== -1 &&
    _.isEqual(currentTrack, newTracks[currentTrackIndex])
  ) {
    // remove anything in the queue that isn't the current track
    await TrackPlayer.remove(
      oldTrackIds.filter((trackId) => trackId !== currentTrackId)
    );

    // add all the new tracks before the current track
    const tracksBeforeCurrent = newTracks.slice(0, currentTrackIndex);
    await TrackPlayer.add(tracksBeforeCurrent, currentTrackId);

    // add all the new tracks after the current track
    const tracksAfterCurrent = newTracks.slice(currentTrackIndex + 1);
    await TrackPlayer.add(tracksAfterCurrent);
  } else {
    // otherwise reset and add all the new tracks
    await TrackPlayer.reset();
    await TrackPlayer.add(newTracks);
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

class PlayerView extends React.Component<PlayerProps, PlayerState> {
  static contextType = StyleContext;
  context!: StyleContextType;
  onPlaybackTrackChange?: TrackPlayer.EmitterSubscription;
  onPlaybackState?: TrackPlayer.EmitterSubscription;
  onPlaybackError?: TrackPlayer.EmitterSubscription;

  constructor(props: PlayerProps) {
    super(props);

    this.state = {
      track: null,
      state: null,
    };
  }

  componentDidMount() {
    this.onPlaybackTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      async(data) => {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        this.setState({
          track,
        });
      }
    );
    this.onPlaybackState = TrackPlayer.addEventListener(
      'playback-state',
      async(data) => {
        this.setState({
          state: data.state,
        });
      }
    );
    this.onPlaybackError = TrackPlayer.addEventListener(
      'playback-error',
      async(data) => {
        if (data.code === 'playback-source') {
          if (data.message === 'Response code: 403') {
            // login error
          } else if (data.message === 'Response code: 404') {
            // file doesn't exist
          } else if (data.message === 'Response code: 500') {
            // server error
          }
        }
      }
    );

    TrackPlayer.getCurrentTrack()
      .then((trackId) => TrackPlayer.getTrack(trackId))
      .then((track) => {
        this.setState({
          track,
        });
      });
    TrackPlayer.getState().then((state) => {
      this.setState({
        state,
      });
    });
  }

  componentWillUnmount() {
    this.onPlaybackTrackChange?.remove();
    this.onPlaybackState?.remove();
    this.onPlaybackError?.remove();
  }

  onReplayPress = async() => {
    try {
      await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 30);
    } catch (e) {
      console.log(e);
    }
  };

  onPreviousPress = async() => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      console.log(e);
    }
  };

  onPlayPress = async() => {
    const { track, state } = this.state;
    if (track === null) {
      return;
    }
    if (state === TrackPlayer.STATE_PLAYING) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  onClosePress = async() => {
    await TrackPlayer.stop();
  };

  onNextPress = async() => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { style } = this.props;
    const { track, state } = this.state;
    return (
      <View>
        <Divider />
        <View
          style={{
            ...(style || {}),
            display: 'flex',
            flexDirection: 'row',
            height: 64,
            alignItems: 'center',
            padding: m,
          }}
        >
          <ArkworkView track={track} state={state} />
          <TitleView style={{ flex: 1 }} track={track} />
          <PreviousButton onPress={this.onPreviousPress} />
          <ReplayButton onPress={this.onReplayPress} />
          {state === TrackPlayer.STATE_PLAYING ? (
            <PauseButton onPress={this.onPlayPress} />
          ) : (
            <PlayButton onPress={this.onPlayPress} />
          )}
          <NextButton onPress={this.onNextPress} />
        </View>
        <ProgressView />
      </View>
    );
  }
}

class ProgressView extends ProgressComponent {
  render() {
    const progress = this.getProgress();
    const duration = this.getBufferedProgress();

    return (
      <View
        style={{
          height: 1,
          width: '100%',
          flexDirection: 'row',
        }}
      >
        <View style={{ flex: progress, backgroundColor: 'red' }} />
        <View
          style={{
            flex: duration - progress,
            backgroundColor: 'grey',
          }}
        />
      </View>
    );
  }
}

interface ArtworkProps {
  style?: ViewStyle;
  track: TrackPlayer.Track | null;
  state: TrackPlayer.State | null;
}

class ArkworkView extends React.Component<ArtworkProps> {
  static contextType = StyleContext;
  context!: StyleContextType;

  render() {
    const { track, state } = this.props;
    const { colors } = this.context;
    return (
      <View style={{ width: 48, height: 48, marginRight: 4 }}>
        {track?.artwork && (
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
          <ActivityIndicator
            size={40}
            color={colors.D30}
            animating={state === TrackPlayer.STATE_BUFFERING}
          />
        </View>
      </View>
    );
  }
}

interface TitleProps {
  style?: ViewStyle;
  track: TrackPlayer.Track | null;
}

class TitleView extends React.Component<TitleProps> {
  static contextType = StyleContext;
  context!: StyleContextType;

  onTrackChange!: TrackPlayer.EmitterSubscription;

  constructor(props: TitleProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { style, track } = this.props;
    const { typography } = this.context;

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
}

interface PlaybackButtonProps {
  name: string;
  type: string;
  size: number;
  onPress: () => void;
}

abstract class PlaybackButton extends React.Component<PlaybackButtonProps> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static defaultProps = {
    type: 'material',
    size: 30,
  };

  render() {
    const { name, type, size, onPress } = this.props;
    const { colors } = this.context;
    return (
      <View style={{ padding: 2 }}>
        <Icon name={name} type={type} size={size} onPress={onPress} color={colors.D30} />
      </View>
    );
  }
}

class PreviousButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'skip-previous',
  };
}

class PlayButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'play-arrow',
  };
}

class PauseButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'pause',
  };
}

class NextButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'skip-next',
  };
}

class ReplayButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'replay',
  };
}

class CloseButton extends PlaybackButton {
  static defaultProps = {
    ...PlaybackButton.defaultProps,
    name: 'close',
  };
}

interface TrackProps {
  track: TrackPlayer.Track;
  isCurrentTrack: boolean;
}

class TrackView extends React.Component<TrackProps> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _playNarration = () => {
    playNarration(this.props.track.id);
  };

  render() {
    const { track, isCurrentTrack } = this.props;

    return (
      <TouchableHighlight onPress={this._playNarration}>
        <>
          <Divider />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              height: 64,
              width: '100%',
              alignItems: 'center',
              padding: m,
              backgroundColor: isCurrentTrack ? 'grey' : 'transparent',
            }}
          >
            <ArkworkView track={track} state={null} />
            <TitleView style={{ flex: 1 }} track={track} />
          </View>
        </>
      </TouchableHighlight>
    );
  }
}

interface PlaylistProps {
  style?: ViewStyle;
  queue: TrackPlayer.Track[];
}

interface PlaylistState {
  currentTrackId: string | null;
}

class PlaylistView extends React.Component<PlaylistProps, PlaylistState> {
  onPlaybackTrackChange?: TrackPlayer.EmitterSubscription;

  constructor(props: PlaylistProps) {
    super(props);

    this.state = {
      currentTrackId: null,
    };
  }

  componentDidMount() {
    this.onPlaybackTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      (data) => {
        this.setState({
          currentTrackId: data.nextTrack,
        });
      }
    );
    TrackPlayer.getCurrentTrack().then((currentTrackId) =>
      this.setState({ currentTrackId })
    );
  }

  componentWillUnmount() {
    this.onPlaybackTrackChange?.remove();
  }

  render() {
    const { style, queue } = this.props;
    const { currentTrackId } = this.state;

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
}

interface NarratorContainerProps {
  hasDissonantVoices: boolean;
  children: JSX.Element,
}

class NarratorContainerView extends React.Component<
  NarratorContainerProps,
  { queue: TrackPlayer.Track[] }
> {
  static contextType = StyleContext;
  context!: StyleContextType;
  queueHandle: NodeJS.Timeout | null = null;

  constructor(props: NarratorContainerProps) {
    super(props);

    this.state = {
      queue: [],
    };
  }

  componentDidMount() {
    this.updateQueue();
  }

  componentWillUnmount() {
    if (this.queueHandle !== null) {
      clearTimeout(this.queueHandle);
    }
  }

  updateQueue() {
    if (SHOW_DISSONANT_VOICES) {
      this.queueHandle = setTimeout(async() => {
        const queue = await TrackPlayer.getQueue();
        if (!_.isEqual(queue, this.state.queue)) {
          this.setState(() => ({ queue }), this.updateQueue);
        }
      }, 100);
    }
  }

  render() {
    const { hasDissonantVoices, children } = this.props;
    const { queue } = this.state;
    if (queue.length === 0 || !hasDissonantVoices || !SHOW_DISSONANT_VOICES) {
      return children;
    }
    return (
      <View style={{ height: '100%' }}>
        {children}
        <PlayerView />
        {Platform.OS === 'ios' && <View style={{ height: 83 }} />}
      </View>
    );
  }
}

export default connect((state: AppState) => {
  return {
    hasDissonantVoices: hasDissonantVoices(state),
  };
})(NarratorContainerView);
