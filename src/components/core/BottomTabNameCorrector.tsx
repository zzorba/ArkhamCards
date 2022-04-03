import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { Navigation, NavigationComponentProps, NavigationFunctionComponent } from 'react-native-navigation';
import useAppState from 'react-native-appstate-hook';


// https://github.com/wix/react-native-navigation/issues/6923
export default function BottomTabNameCorrector<P extends NavigationComponentProps>(
  tabId: string,
  title: () => string,
  Component: NavigationFunctionComponent<P>,
): NavigationFunctionComponent<P> {
  function Wrapper(props: P) {
    const onForeground = useCallback(() => {
      Navigation.mergeOptions(tabId, {
        bottomTab: {
          text: title(),
        },
      });
    }, []);

    useAppState({ onForeground });

    return (
      <Component { ...props } />
    );
  }

  Wrapper.displayName = `BottomTabNameCorrector(${
    Component.displayName || Component.name
  })`;

  return Platform.OS === 'ios' ? Wrapper : Component; // disabled for android
}