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
import { DeckActions } from '@data/remote/decks';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  noWrapper: boolean;
  children: (login: () => void, signedIn: boolean, signInError?: string) => JSX.Element | null;
  actions: DeckActions;
}

export default function LoginStateComponent({ noWrapper, actions, children }: Props) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  const { arkhamDbUser } = useContext(ArkhamCardsAuthContext);
  const error = useSelector((state: AppState) => state.signedIn.error || undefined);
  const loading = useSelector((state: AppState) => state.signedIn.loading);
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);
  const doLogin = useCallback(() => dispatch(login(user, actions)), [dispatch, user, actions]);

  if (noWrapper) {
    return children(doLogin, !!arkhamDbUser, error);
  }
  return (
    <View style={styles.wrapper}>
      { children(doLogin, !!arkhamDbUser, error) }
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
