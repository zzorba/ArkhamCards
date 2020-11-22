import { t } from 'ttag';
import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BasicButton from '@components/core/BasicButton';
import SettingsItem from '@components/settings/SettingsItem';
import { dissonantVoicesLogin, dissonantVoicesLogout } from '@actions';
import { AppState } from '@reducers';
import StyleContext from '@styles/StyleContext';

interface Props {
  settings?: boolean;
}

export default function DissonantVoicesLoginButton({ settings }: Props) {
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  const loading = useSelector((state: AppState) => state.dissonantVoices.loading);
  const signedIn = useSelector((state: AppState) => state.dissonantVoices.status);
  const doLogin = useCallback(() => {
    dispatch(dissonantVoicesLogin());
  }, [dispatch]);
  const logOutPressed = useCallback(() => {
    dispatch(dissonantVoicesLogout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    Alert.alert(
      t`Sign in to Dissonant Voices?`,
      t`Dissonant Voices is an ongoing project by Mythos Busters to narrate the english scenario text for each Arkham Horror campaign.`,
      [
        { text: t`Sign In`, onPress: doLogin },
        { text: t`Cancel`, style: 'cancel' },
      ],
    );
  }, [doLogin]);
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
      <SettingsItem onPress={logOutPressed} text={t`Sign out of Dissonant Voices`} />
    ) : (
      <View style={styles.wrapper}>
        <BasicButton onPress={logOutPressed} title={t`Sign out of Dissonant Voices`} />
      </View>
    );
  }

  return settings ? (
    <SettingsItem onPress={loginPressed} text={t`Sign in to Dissonant Voices`} />
  ) : (
    <View style={styles.wrapper}>
      <BasicButton onPress={loginPressed} title={t`Sign in to Dissonant Voices`} />
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
