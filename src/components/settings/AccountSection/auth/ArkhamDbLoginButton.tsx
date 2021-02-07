import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { t } from 'ttag';
import { logout, login } from '@actions';
import { AppState, getMyDecksState } from '@reducers';
import DeckButton from '@components/deck/controls/DeckButton';
import DeckActionRow from '@components/deck/controls/DeckActionRow';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  last?: boolean;
  showAlert: ShowAlert
}
export default function ArkhamDbLoginButton({ last, showAlert }: Props) {
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.signedIn.loading);
  const signedIn = useSelector((state: AppState) => state.signedIn.status);
  const { error } = useSelector(getMyDecksState);
  const [{ isConnected }] = useNetworkStatus();
  const doLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    dispatch(login());
  }, [dispatch]);
  const logOutPressed = useCallback(() => {
    showAlert(
      t`Are you sure you want to sign out?`,
      t`Data on ArkhamDB will be preserved, but all Campaign data and any edits made without internet might be lost.\n\n If you are having trouble with your account you can also reconnect.`,
      [
        { text: t`Sign Out`, style: 'destructive', onPress: doLogout },
        { text: t`Reconnect Account`, onPress: loginPressed, icon: 'login' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogout, loginPressed, showAlert]);

  const reauthPressed = useCallback(() => {
    showAlert(
      t`Problem reading from ArkhamDB`,
      t`If you are having trouble with your account you should try to reconnect.\n\nIf the problem persists, you may sign out but campaigns will have ArkhamDB decks disconnected.`,
      [
        { text: t`Sign Out`, style: 'destructive', onPress: doLogout },
        { text: t`Reconnect Account`, onPress: loginPressed, icon: 'login' },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogout, loginPressed, showAlert]);
  const [status, control] = useMemo(() => {
    if (isConnected && error) {
      return [t`Authorization issues`, <DeckButton thin color="red" key="reauth-control" onPress={reauthPressed} title={t`Reconnect`} />];
    }
    return [
      signedIn ? t`Logged in` : t`Synchronize decks`,
      <DeckButton key="auth-control" thin onPress={signedIn ? logOutPressed : loginPressed} title={signedIn ? t`Log out` : t`Log in`} />,
    ];
  }, [error, isConnected, signedIn, reauthPressed, loginPressed, logOutPressed]);
  return (
    <DeckActionRow
      icon="arkhamdb"
      title={status}
      description={t`ArkhamDB`}
      loading={loading}
      control={control}
      last={last}
      growControl
    />
  );
}
