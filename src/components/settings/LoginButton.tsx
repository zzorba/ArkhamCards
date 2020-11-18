import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BasicButton from '@components/core/BasicButton';
import SettingsItem from './SettingsItem';
import { t } from 'ttag';
import { logout, login } from '@actions';
import { AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';

interface Props {
  settings?: boolean;
}

export default function LoginButton({ settings }: Props) {
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.signedIn.loading);
  const signedIn = useSelector((state: AppState) => state.signedIn.status);
  const doLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    dispatch(login());
  }, [dispatch]);
  const logOutPressed = useCallback(() => {
    Alert.alert(
      t`Are you sure you want to sign out?`,
      t`Data on ArkhamDB will be preserved, but all Campaign data and any edits made without internet might be lost.\n\n If you are having trouble with your account you can also reconnect.`,
      [
        { text: t`Sign Out`, style: 'destructive', onPress: doLogout },
        { text: t`Reconnect Account`, onPress: loginPressed },
        { text: t`Cancel` },
      ],
    );
  }, [doLogout, loginPressed]);
  if (loading) {
    return (
      <ActivityIndicator
        style={[{ height: 60 }]}
        color={colors.lightText}
        size="small"
        animating
      />
    );
  }

  if (signedIn) {
    return settings ? (
      <SettingsItem onPress={logOutPressed} text={t`Sign out of ArkhamDB`} />
    ) : (
      <View style={styles.wrapper}>
        <BasicButton onPress={logOutPressed} title={t`Sign out of ArkhamDB`} />
      </View>
    );
  }

  return settings ? (
    <SettingsItem onPress={loginPressed} text={t`Sign in to ArkhamDB`} />
  ) : (
    <View style={styles.wrapper}>
      <BasicButton onPress={loginPressed} title={t`Sign in to ArkhamDB`} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 40,
  },
});
