import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Button } from 'react-native-elements';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { signIn, getAccessToken } from '../lib/auth';

/**
 * Simple component to block children rendering until a login flow is completed.
 */
export default function withLoginGate(WrappedComponent) {
  class ConnectedLoginGateComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        signingIn: false,
        loggedIn: false,
      };

      this._signInPressed = this.signInPressed.bind(this);
    }

    signInPressed() {
      this.setState({
        signingIn: true,
      }, () => {
        signIn().then(result => {
          if (result.success) {
            this.setState({
              signingIn: false,
              loggedIn: true,
            });
          } else {
            this.setState({
              signInError: result.error,
            });
          }
        })
      });
    }

    componentDidMount() {
      getAccessToken().then(accessToken => {
        this.setState({
          loading: false,
          loggedIn: !!accessToken,
        });
      });
    }

    render() {
      const {
        loading,
        loggedIn,
      } = this.state;
      if (loading) {
        return (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator
              style={[{ height: 80 }]}
              size="small"
              animating
            />
          </View>
        );
      }

      if (!loggedIn) {
        return (
          <View style={styles.signInContainer}>
            <Button text="Sign in to ArkhamDB" onPress={this._signInPressed} />
          </View>
        );
      }

      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  hoistNonReactStatics(ConnectedLoginGateComponent, WrappedComponent);

  return ConnectedLoginGateComponent;
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  signInContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
