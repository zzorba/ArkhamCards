import { Alert } from 'react-native';
import { t } from 'ttag';

export function handleAuthErrors<T>(
  promise: Promise<T>,
  onSuccess: (result: T) => void,
  onFailure: (error: Error) => void,
  retry: () => void,
  login: () => void,
) {
  promise.then(
    onSuccess,
    err => {
      if (err.message === 'badAccessToken') {
        Alert.alert(
          t`Authorization error`,
          t`We are having trouble talking to ArkhamDB.\n\nIf the problem persists, please try to reauthorize.`,
          [{
            text: t`Try again`,
            onPress: () => {
              retry();
            },
          }, {
            text: t`Reauthorize`,
            onPress: () => {
              login();
              onFailure(err);
            },
          }, {
            text: t`Cancel`,
            onPress: () => {
              onFailure(err);
            },
          }],
        );
      } else {
        onFailure(err);
      }
    });
}

const ARKHAM_BUILD_AUTH_ERRORS = new Set(['badAccessToken', 'unauthorized', 'forbidden']);

// 'forbidden' covers tokens granted before write access was requested, which need a fresh sign in.
export function handleArkhamBuildAuthErrors<T>(
  promise: Promise<T>,
  onSuccess: (result: T) => void,
  onFailure: (error: Error) => void,
  retry: () => void,
  login: () => void,
) {
  promise.then(
    onSuccess,
    err => {
      if (ARKHAM_BUILD_AUTH_ERRORS.has(err.message)) {
        Alert.alert(
          t`Authorization error`,
          t`We are having trouble saving to arkham.build.\n\nIf the problem persists, please try to reauthorize.`,
          [{
            text: t`Try again`,
            onPress: () => {
              retry();
            },
          }, {
            text: t`Reauthorize`,
            onPress: () => {
              login();
              onFailure(err);
            },
          }, {
            text: t`Cancel`,
            onPress: () => {
              onFailure(err);
            },
          }],
        );
      } else {
        onFailure(err);
      }
    });
}

export default {
  handleAuthErrors,
  handleArkhamBuildAuthErrors,
};
