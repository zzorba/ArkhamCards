import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { t } from 'ttag';
import { logout, login } from '@actions';
import { AppState, getMyDecksState } from '@reducers';
import DeckButton from '@components/deck/controls/DeckButton';
import DeckActionRow from '@components/deck/controls/DeckActionRow';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { AlertButton, ShowAlert } from '@components/deck/dialogs';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useAppDispatch } from '@app/store';
import { Linking, Platform } from 'react-native';

interface Props {
  last?: boolean;
  showAlert: ShowAlert
}

function emailKamalisk() {
  Linking.openURL(`mailto:arkhamdb@kamalisk.com?subject=${encodeURIComponent('Account deletion request')}`);
}

export default function ArkhamDbLoginButton({ last, showAlert }: Props) {
  const dispatch = useAppDispatch();
  const loading = useSelector((state: AppState) => state.signedIn.loading);
  const { arkhamDb: signedIn } = useContext(ArkhamCardsAuthContext);
  const { error } = useSelector(getMyDecksState);
  const [{ isConnected }] = useNetworkStatus();
  const doLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    dispatch(login());
  }, [dispatch]);
  const deletePressed = useCallback(() => {
    setTimeout(() => {
      showAlert(
        t`Deleteing ArkhamDB accounts`,
        t`ArkhamDB is a third party website unaffiliated with ArkhamCards. This app only allows you to sign into existing ArkhamDB accounts.\n\nIf you would like to delete your account, please contact the webmaster of ArkhamDB at arkhamdb@kamalisk.com`,
        [
          { text: t`Requeset Account Deletion`, onPress: emailKamalisk, icon: 'email' },
          { text: t`Cancel`, style: 'cancel' },
        ]
      );
    }, 100);
  }, [showAlert]);
  const logOutPressed = useCallback(() => {
    const appleButtons: AlertButton[] = Platform.OS === 'ios' ? [{ text: t`Delete Account`, onPress: deletePressed, icon: 'trash', style: 'destructive' }] : [];
    showAlert(
      t`Are you sure you want to sign out?`,
      t`Data on ArkhamDB will be preserved, but all Campaign data and any edits made without internet might be lost.\n\n If you are having trouble with your account you can also reconnect.`,
      [
        { text: t`Sign Out`, style: Platform.OS === 'android' ? 'destructive' : undefined, onPress: doLogout },
        { text: t`Reconnect Account`, onPress: loginPressed, icon: 'login' },
        ...appleButtons,
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogout, loginPressed, showAlert, deletePressed]);

  const reauthPressed = useCallback(() => {
    const appleButtons: AlertButton[] = Platform.OS === 'ios' ? [{ text: t`Delete Account`, onPress: deletePressed, icon: 'trash', style: 'destructive' }] : [];
    showAlert(
      t`Problem reading from ArkhamDB`,
      t`If you are having trouble with your account you should try to reconnect.\n\nIf the problem persists, you may sign out but campaigns will have ArkhamDB decks disconnected.`,
      [
        { text: t`Sign Out`, style: Platform.OS === 'android' ? 'destructive' : undefined, onPress: doLogout },
        { text: t`Reconnect Account`, onPress: loginPressed, icon: 'login' },
        ...appleButtons,
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogout, loginPressed, showAlert, deletePressed]);
  const [status, control] = useMemo(() => {
    if (isConnected && error) {
      return [
        t`Authorization issues`,
        <DeckButton
          thin
          color="red"
          key="reauth-control"
          onPress={reauthPressed}
          title={t`Reconnect`}
        />,
      ];
    }
    return [
      signedIn ? t`Logged in` : t`Synchronize decks`,
      <DeckButton
        key="auth-control"
        thin
        onPress={signedIn ? logOutPressed : loginPressed}
        title={signedIn ? t`Log out` : t`Log in`}
      />,
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
