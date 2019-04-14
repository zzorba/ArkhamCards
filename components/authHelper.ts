import {
  Alert,
} from 'react-native';
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

export default {
  handleAuthErrors,
};
