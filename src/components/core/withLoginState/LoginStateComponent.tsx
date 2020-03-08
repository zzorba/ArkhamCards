import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { login } from 'actions';
import { AppState } from 'reducers';

interface OwnProps {
  render: (
    login: () => void,
    signedIn: boolean,
    signInError?: string,
  ) => ReactNode;
  noWrapper: boolean;
  otherProps: any;
}

interface ReduxProps {
  loading: boolean;
  signedIn: boolean;
  error?: string;
}

interface ReduxActionProps {
  login: () => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class LoginStateComponent extends React.Component<Props> {
  render() {
    const {
      loading,
      signedIn,
      login,
      error,
      render,
      noWrapper,
    } = this.props;
    if (noWrapper) {
      return render(login, signedIn, error);
    }
    return (
      <View style={styles.wrapper}>
        { render(login, signedIn, error) }
        { !!loading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator
              style={[{ height: 80 }]}
              size="small"
              animating
            />
          </View>
        ) }
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    signedIn: state.signedIn.status || false,
    error: state.signedIn.error || undefined,
    loading: state.signedIn.loading,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<Action>
): ReduxActionProps {
  return bindActionCreators({ login }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginStateComponent);


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
