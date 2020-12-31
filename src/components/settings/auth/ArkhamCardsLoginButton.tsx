import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppleButton, appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

import BasicButton from '@components/core/BasicButton';
import SettingsItem from '../SettingsItem';
import { t } from 'ttag';
import StyleContext from '@styles/StyleContext';
import { useDialog } from '@components/deck/dialogs';
import space from '@styles/space';

interface Props {
  settings?: boolean;
}

GoogleSignin.configure({
  scopes: ['email'],
  offlineAccess: true,
  webClientId: '375702423113-g70bmcovqfqduf2tleg7otk7fkpo1sku.apps.googleusercontent.com',
});

async function onAppleButtonPress() {
  if (Platform.OS === 'ios') {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }

  const rawNonce = uuid.v4();
  const state = uuid.v4();
  appleAuthAndroid.configure({
    // The Service ID you registered with Apple
    clientId: 'com.arkhamcards',

    // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
    // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
    redirectUri: 'https://arkhamblob.firebaseapp.com/__/auth/handler',

    // The type of response requested - code, id_token, or both.
    responseType: appleAuthAndroid.ResponseType.ALL,

    // The amount of user information requested from Apple.
    scope: appleAuthAndroid.Scope.ALL,

    // Random nonce value that will be SHA256 hashed before sending to Apple.
    nonce: rawNonce,

    // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
    state,
  });
  const androidResponse = await appleAuthAndroid.signIn();
  // Ensure Apple returned a user identityToken
  if (!androidResponse.id_token) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const { id_token, nonce } = androidResponse;
  const androidCredential = auth.AppleAuthProvider.credential(id_token, nonce);

  // Sign the user in with the credential
  return auth().signInWithCredential(androidCredential);
}


async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices();
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return await auth().signInWithCredential(googleCredential);
}


export default function ArkhamCardsLoginButton({ settings }: Props) {
  const { colors, darkMode } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  const onAuthStateChanged = useCallback((user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (loading) {
      setLoading(false);
    }
  }, [setLoading, loading, setUser]);
  const onAuthStateChangedRef = useRef(onAuthStateChanged);
  useEffect(() => {
    onAuthStateChangedRef.current = onAuthStateChanged;
  }, [onAuthStateChanged]);

  useEffect(() => {
    const callback = (user: FirebaseAuthTypes.User | null) =>{
      if (onAuthStateChangedRef.current) {
        onAuthStateChangedRef.current(user);
      }
    };
    const subscriber = auth().onAuthStateChanged(callback);
    return subscriber; // unsubscribe on unmount
  }, []);
  const doLogout = useCallback(() => {
    auth().signOut();
  }, []);
  const signInToApple = useCallback(() => onAppleButtonPress().then(() => console.log('Apple sign-in complete!')), []);
  const signInToGoogle = useCallback(() => onGoogleButtonPress().then(() => console.log('Signed in with Google!')), []);
  const signInContent = useMemo(() => {
    return (
      <View style={styles.center}>
        { (Platform.OS === 'ios' || appleAuthAndroid.isSupported) && (
          <AppleButton
            buttonStyle={darkMode ? AppleButton.Style.WHITE : AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={[{
              minWidth: 200,
              minHeight: 45,
            }, space.marginBottomS]}
            onPress={signInToApple}
          />
        ) }
        <GoogleSigninButton
          onPress={signInToGoogle}
          size={GoogleSigninButton.Size.Standard}
          color={darkMode ? GoogleSigninButton.Color.Light : GoogleSigninButton.Color.Dark}
        />
      </View>
    );
  }, [darkMode, signInToApple, signInToGoogle]);
  const { dialog, showDialog } = useDialog({
    title: t`Sign in`,
    alignment: 'bottom',
    content: signInContent,
    allowDismiss: true,
  });
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

  if (user) {
    return settings ? (
      <SettingsItem onPress={doLogout} text={t`Sign out`} />
    ) : (
      <View style={styles.wrapper}>
        <BasicButton onPress={doLogout} title={t`Sign out`} />
      </View>
    );
  }

  return (
    <>
      { settings ? (
        <SettingsItem onPress={showDialog} text={t`Sign in`} />
      ) : (
        <View style={styles.wrapper}>
          <BasicButton onPress={showDialog} title={t`Sign in`} />
        </View>
      ) }
      { dialog }
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 40,
  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
