import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../app/i18n';
import * as Actions from '../actions';

/**
 * Simple component to block children rendering until a login flow is completed.
 */
export default function withLoginGate(WrappedComponent, message) {
  class ConnectedLoginGateComponent extends React.Component {
    static propTypes = {
      loading: PropTypes.bool,
      error: PropTypes.string,
      signedIn: PropTypes.bool.isRequired,
      login: PropTypes.func.isRequired,
    };

    render() {
      const {
        loading,
        signedIn,
        login,
      } = this.props;
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

      if (!signedIn) {
        return (
          <View style={styles.signInContainer}>
            { !!message && <Text style={styles.messageText}>{ message }</Text> }
            <Button title={L('Sign in to ArkhamDB')} onPress={login} />
          </View>
        );
      }

      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  hoistNonReactStatics(ConnectedLoginGateComponent, WrappedComponent);

  function mapStateToProps(state) {
    return {
      signedIn: state.signedIn.status,
      error: state.signedIn.error,
      loading: state.signedIn.loading,
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedLoginGateComponent);
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  signInContainer: {
    margin: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  messageText: {
    fontSize: 18,
    fontFamily: 'System',
    marginBottom: 32,
  },
});
