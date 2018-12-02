import {
  Alert,
} from 'react-native';

import L from '../app/i18n';

export function handleAuthErrors(
  promise,
  onSuccess,
  onFailure,
  retry,
  login,
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
              onFailure(err);
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
