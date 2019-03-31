import {
  Alert,
} from 'react-native';

import L from '../app/i18n';

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
          L('Authorization error'),
          L('We are having trouble talking to ArkhamDB.\n\nIf the problem persists, please try to reauthorize.'),
          [{
            text: L('Try again'),
            onPress: () => {
              retry();
            },
          }, {
            text: L('Reauthorize'),
            onPress: () => {
              login();
              onFailure(err);
            },
          }, {
            text: L('Cancel'),
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
