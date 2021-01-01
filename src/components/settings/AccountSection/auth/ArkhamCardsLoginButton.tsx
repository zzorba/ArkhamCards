import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { forEach, map, uniq } from 'lodash';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import { AppleButton, appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

import { t } from 'ttag';
import StyleContext from '@styles/StyleContext';
import { useDialog } from '@components/deck/dialogs';
import space, { s, xs } from '@styles/space';
import { useFlag } from '@components/core/hooks';
import DeckButton from '@components/deck/controls/DeckButton';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

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

type LoginRemedy = 'try-login' | 'try-create' | 'reset-password';
function errorMessage(code: string): {
  message?: string;
  field?: 'email' | 'password';
  remedy?: LoginRemedy;
} {
  switch (code) {
    case 'auth/email-already-in-use':
      return {
        message: t`Looks like there is already an account registered with this email address.`,
        remedy: 'try-login',
        field: 'email',
      };
    case 'auth/invalid-email':
      return {
        message: t`That doesn't look like a valid email address`,
        field: 'email',
      };
    case 'auth/weak-password':
      return {
        message: t`That password seems to be too weak.`,
        field: 'password',
      };
    case 'auth/user-disabled':
      return {
        message: t`Your account has been disabled.`,
      };
    case 'auth/user-not-found':
      return {
        message: t`There doesn't appear to be an account with that email address.`,
        remedy: 'try-create',
        field: 'email',
      };
    case 'auth/wrong-password':
      return {
        message: t`Invalid password.`,
        field: 'password',
        remedy: 'reset-password',
      };
    case 'auth/operation-not-allowed':
    default:
      return {
        message: t`Unknown error`,
      };
  }
}

function EmailSubmitForm({ mode, setMode, closeDialog, backPressed }: {
  mode: 'create' | 'login' | undefined;
  setMode: (mode: 'create' | 'login') => void;
  closeDialog: () => void;
  backPressed: () => void;
}) {
  const { typography } = useContext(StyleContext);
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailErrorCodes, setEmailErrorCodes] = useState<string[]>([]);
  const passwordInputRef = useRef<Input>(null);

  useEffect(() => {
    if (emailErrorCodes.length) {
      setEmailErrorCodes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, emailAddress]);

  const submitEmail = useCallback(() => {
    setSubmitting(true);
    const promise = mode === 'create' ?
      auth().createUserWithEmailAndPassword(emailAddress, password) :
      auth().signInWithEmailAndPassword(emailAddress, password);
    promise.then(
      () => {
        setSubmitting(false);
        closeDialog();
      },
      (error) => {
        if (error.code) {
          if (Array.isArray(error.code)) {
            setEmailErrorCodes(error.code);
          } else {
            setEmailErrorCodes([error.code]);
          }
        }
        setSubmitting(false);
      }
    );
  }, [emailAddress, password, setSubmitting, closeDialog, setEmailErrorCodes, mode]);
  const focusPasswordField = useCallback(() => {
    passwordInputRef.current && passwordInputRef.current.focus();
  }, [passwordInputRef]);
  const [emailErrors, passwordErrors, genericErrors, remedies] = useMemo(() => {
    const emailErrors: string[] = [];
    const passwordErrors: string[] = [];
    const genericErrors: string[] = [];
    const remedies: LoginRemedy[] = [];
    forEach(emailErrorCodes, code => {
      const {
        message,
        field,
        remedy,
      } = errorMessage(code);
      if (message) {
        if (field === 'email') {
          emailErrors.push(message);
        } else if (field === 'password') {
          passwordErrors.push(message);
        } else {
          genericErrors.push(message);
        }
      }
      if (remedy) {
        remedies.push(remedy);
      }
    });
    return [emailErrors, passwordErrors, genericErrors, uniq(remedies)];
  }, [emailErrorCodes]);
  const [sentPasswordReset, setSentPasswordReset] = useState(false);
  const sendPasswordReset = useCallback(() => {
    setSentPasswordReset(true);
    auth().sendPasswordResetEmail(emailAddress);
  }, [emailAddress]);

  const switchToCreate = useCallback(() => {
    setMode('create');
    setEmailErrorCodes([]);
  }, [setMode]);
  const switchToLogin = useCallback(() => {
    setMode('login');
    setEmailErrorCodes([]);
  }, [setMode]);
  return (
    <View style={styles.center}>
      <Input
        leftIcon={{ type: 'material', name: 'email' }}
        placeholder={t`Email address`}
        autoCompleteType="email"
        value={emailAddress}
        keyboardType="email-address"
        textContentType="username"
        onChangeText={setEmailAddress}
        errorMessage={emailErrors.join('\n')}
        onSubmitEditing={focusPasswordField}
        returnKeyType="next"
        blurOnSubmit={false}
        autoFocus
      />
      <Input
        ref={passwordInputRef}
        leftIcon={{ type: 'material', name: 'lock' }}
        placeholder={t`Password`}
        secureTextEntry
        value={password}
        textContentType={mode === 'create' && Platform.OS === 'ios' && parseInt(`${Platform.Version}`, 10) >= 12 ? 'newPassword' : 'password'}
        onChangeText={setPassword}
        errorMessage={passwordErrors.join('\n')}
        returnKeyType="send"
        onSubmitEditing={submitEmail}
      />
      { genericErrors.length > 0 && (
        <View style={[space.paddingSideXs, space.paddingTopXs, space.paddingBottomS]}>
          <Text style={[typography.text, typography.error]}>
            { genericErrors.join('\n') }
          </Text>
        </View>
      ) }
      { map(remedies, (remedy, idx) => {
        switch (remedy) {
          case 'try-create':
            return (
              <View style={[space.paddingTopS, space.paddingBottomM]}>
                <Text style={[typography.text, space.paddingBottomS]}>
                  { t`Would you like to create a new account instead?` }
                </Text>
                <View style={styles.row}>
                  <DeckButton thin color="red" icon="plus-thin" title={`Create new account`} onPress={switchToCreate} />
                </View>
              </View>
            );
          case 'try-login':
            return (
              <View style={[space.paddingTopS, space.paddingBottomM]}>
                <Text style={[typography.text, space.paddingBottomS]}>
                  { t`Are you trying to sign in to an existing account?` }
                </Text>
                <View style={styles.row}>
                  <DeckButton thin color="red" icon="login" title={`Sign in to existing account`} onPress={switchToLogin} />
                </View>
              </View>
            );
          case 'reset-password':
            return sentPasswordReset ? (
              <View key={idx} style={[space.paddingSideXs, space.paddingTopXs, space.paddingBottomS]}>
                <Text style={[typography.text]}>
                  { t`A password reset email has been sent to '${emailAddress}'.\n\nPlease follow the instructions and then return to the app to continue.` }
                </Text>
              </View>
            ) : (
              <View style={[space.paddingTopS, space.paddingBottomM]}>
                <Text style={[typography.text, space.paddingBottomS]}>
                  { t`Would you like to reset your password via email?` }
                </Text>
                <View style={styles.row}>
                  <DeckButton thin color="red" icon="email" title={`Request password reset email`} onPress={sendPasswordReset} />
                </View>
              </View>
            );
        }
      }) }
      <View style={styles.row}>
        <View style={[styles.row, { flex: 1 }, space.paddingRightXs]}>
          <DeckButton thin color="red" icon="dismiss" title={t`Cancel`} onPress={backPressed} />
        </View>
        <View style={[styles.row, { flex: 1 }, space.paddingLeftS]}>
          <DeckButton thin icon="check-thin" title={mode === 'create' ? t`Sign up` : t`Sign in`} onPress={submitEmail} loading={submitting} />
        </View>
      </View>
    </View>
  );
}

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
export default function ArkhamCardsLoginButton({ children }: Props) {
  const { darkMode, typography } = useContext(StyleContext);
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const [emailLogin, toggleEmailLogin, setEmailLogin] = useFlag(false);
  const setVisibleRef = useRef<(visible: boolean) => void>();
  const [mode, setMode] = useState<'login' | 'create' | undefined>();
  const doLogout = useCallback(() => {
    auth().signOut();
  }, []);
  const createAccountPressed = useCallback(() => setMode('create'), [setMode]);
  const loginPressed = useCallback(() => setMode('login'), [setMode]);
  const resetDialog = useCallback(() => {
    setMode(undefined);
    setEmailLogin(false);
    if (setVisibleRef.current) {
      setVisibleRef.current(false);
    }
  }, [setMode, setEmailLogin, setVisibleRef]);

  const signInToApple = useCallback(() => onAppleButtonPress().then(() => resetDialog()), [resetDialog]);
  const signInToGoogle = useCallback(() => onGoogleButtonPress().then(() => resetDialog()), [resetDialog]);

  const welcomeContent = useMemo(() => {
    return (
      <View style={styles.center}>
        <View style={[space.paddingSideXs, space.paddingTopXs, space.paddingBottomS]}>
          <Text style={typography.text}>
            { t`Using an Arkham Cards account will allow you to backup and sync your campaign data between devices.\nMore features are in the works.`}
          </Text>
        </View>
        <View style={[styles.row, space.paddingBottomS]}>
          <DeckButton thin icon="login" title={t`Sign in to your account`} onPress={loginPressed} />
        </View>
        <View style={[styles.row, space.paddingBottomS]}>
          <DeckButton thin icon="plus-thin" title={t`Create a new account`} onPress={createAccountPressed} />
        </View>
      </View>
    );
  }, [typography, loginPressed, createAccountPressed]);

  const emailContent = useMemo(() => <EmailSubmitForm setMode={setMode} closeDialog={resetDialog} backPressed={toggleEmailLogin} mode={mode} />, [resetDialog, toggleEmailLogin, mode]);
  const signInContent = useMemo(() => {
    return (
      <View style={styles.center}>
        <View style={{ paddingBottom: s + xs }}>
          <DeckButton thin color="red" icon="email" title={mode === 'create' ? t`Sign up with email` : t`Sign in with email`} onPress={toggleEmailLogin} shrink />
        </View>
        { (Platform.OS === 'ios' || appleAuthAndroid.isSupported) && (
          <AppleButton
            buttonStyle={darkMode ? AppleButton.Style.WHITE : AppleButton.Style.BLACK}
            buttonType={appleAuth.isSignUpButtonSupported && mode === 'create' ? AppleButton.Type.SIGN_UP : AppleButton.Type.SIGN_IN}
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
  }, [darkMode, mode, signInToApple, signInToGoogle, toggleEmailLogin]);

  const dialogContent = useMemo(() => {
    if (!mode) {
      return welcomeContent;
    }
    return emailLogin ? emailContent : signInContent;
  }, [mode, welcomeContent, emailLogin, emailContent, signInContent]);

  const { dialog, showDialog, setVisible } = useDialog({
    title: mode === 'create' ? t`Sign up` : t`Sign in`,
    alignment: 'bottom',
    content: dialogContent,
    allowDismiss: true,
    avoidKeyboard: true,
    dismiss: {
      onPress: resetDialog,
    },
  });

  useEffect(() => {
    setVisibleRef.current = setVisible;
  }, [setVisible]);
  return (
    <>
      { !!user && children }
      <View style={[space.paddingTopS, styles.wrapper]}>
        <DeckButton
          title={user ? t`Sign out` : t`Sign in to app`}
          icon="logo"
          loading={loading}
          color={user ? 'gray' : 'red'}
          onPress={user ? doLogout : showDialog}
        />
        { dialog }
      </View>
      { !user && children }
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {

  },
  center: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
