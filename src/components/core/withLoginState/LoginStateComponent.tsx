import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '@actions';
import { AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';

interface Props {
  noWrapper: boolean;
  children: (login: () => void, signedIn: boolean, signInError?: string) => JSX.Element | null;
}

export default function LoginStateComponent({ noWrapper, children }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const signedIn = useSelector((state: AppState) => state.signedIn.status || false);
  const error = useSelector((state: AppState) => state.signedIn.error || undefined);
  const loading = useSelector((state: AppState) => state.signedIn.loading);
  const dispatch = useDispatch();
  const doLogin = useCallback(() => dispatch(login()), [dispatch]);

  if (noWrapper) {
    return children(doLogin, signedIn, error);
  }
  return (
    <View style={styles.wrapper}>
      { children(doLogin, signedIn, error) }
      { !!loading && (
        <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
          <ActivityIndicator
            style={{ height: 80 }}
            color={colors.lightText}
            size="small"
            animating
          />
        </View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
