import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { t } from 'ttag';
import { arkhamBuildLogin, arkhamBuildLogout } from '@actions';
import { AppState } from '@reducers';
import DeckButton from '@components/deck/controls/DeckButton';
import DeckActionRow from '@components/deck/controls/DeckActionRow';
import { ShowAlert } from '@components/deck/dialogs';
import { useAppDispatch } from '@app/store';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

interface Props {
  last?: boolean;
  showAlert: ShowAlert;
}

export default function ArkhamBuildLoginButton({ last, showAlert }: Props) {
  const dispatch = useAppDispatch();
  const loading = useSelector((state: AppState) => state.arkhamBuild.loading);
  const { arkhamBuild: signedIn } = useContext(ArkhamCardsAuthContext);
  const doLogout = useCallback(() => {
    dispatch(arkhamBuildLogout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    dispatch(arkhamBuildLogin());
  }, [dispatch]);
  const logOutPressed = useCallback(() => {
    showAlert(
      t`Are you sure you want to sign out?`,
      t`You will need to sign in again to sync decks with arkham.build.`,
      [
        { text: t`Sign Out`, onPress: doLogout },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogout, showAlert]);

  const [status, control] = useMemo(() => {
    return [
      signedIn ? t`Logged in` : t`Synchronize decks`,
      <DeckButton
        key="auth-control"
        thin
        icon="world"
        onPress={signedIn ? logOutPressed : loginPressed}
        title={signedIn ? t`Log out` : t`Log in`}
      />,
    ];
  }, [signedIn, loginPressed, logOutPressed]);
  return (
    <DeckActionRow
      icon="world"
      title={status}
      description={t`arkham.build`}
      loading={loading}
      control={control}
      last={last}
      growControl
    />
  );
}
