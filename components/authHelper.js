import {
  Alert,
} from 'react-native';

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
          'Authorization error',
          'We are having trouble talking to ArkhamDB.\n\nIf the problem persists, please try to reauthorize.',
          [{
            text: 'Try again',
            onPress: () => {
              onFailure(err);
              retry();
            },
          }, {
            text: 'Reauthorize',
            onPress: () => {
              login();
              onFailure(err);
            },
          }, {
            text: 'Cancel',
            onPress: () => {
              onFailure(err);
            },
          }],
        );
      } else {
        Alert.alert('Unknown error', err.message || err);
        onFailure(err);
      }
    });
}

export default {
  handleAuthErrors,
};
