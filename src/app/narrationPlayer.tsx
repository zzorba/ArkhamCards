import TrackPlayer from 'react-native-track-player';

export const registerNarrationPlayer = () => {
  return TrackPlayer.registerPlaybackService(() => async() => {
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
  });
};
