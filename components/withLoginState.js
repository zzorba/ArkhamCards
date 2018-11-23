import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';

/**
 * Simple component to block children rendering until a login flow is completed.
 */
export default function withLoginState(WrappedComponent) {
  class ConnectedLoginStateComponent extends React.Component {
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
        error,
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

      return (
        <WrappedComponent
          {...this.props}
          login={login}
          signedIn={signedIn}
          signInError={error}
        />
      );
    }
  }

  hoistNonReactStatics(ConnectedLoginStateComponent, WrappedComponent);

  function mapStateToProps(state) {
    return {
      signedIn: state.signedIn.status || false,
      error: state.signedIn.error,
      loading: state.signedIn.loading,
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedLoginStateComponent);
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
