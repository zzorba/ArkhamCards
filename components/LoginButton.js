import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';

class LoginButton extends React.Component {
  static propTypes = {
    signedIn: PropTypes.bool.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._logOutPressed = this.logOutPressed.bind(this);
  }

  logOutPressed() {
    Alert.alert(
      'Are you sure you want to sign out?',
      'Data on ArkhamDB will be preserved, but any edits made without internet might be lost.',
      [
        { text: 'Cancel' },
        { text: 'Sign Out', onPress: this.props.logout },
      ],
    );
  }

  render() {
    const {
      signedIn,
      loading,
      login,
    } = this.props;

    if (loading) {
      return (
        <ActivityIndicator
          style={[{ height: 60 }]}
          size="small"
          animating
        />
      );
    }

    if (signedIn) {
      return (
        <View style={styles.wrapper}>
          <Button onPress={this._logOutPressed} title="Sign out of ArkhamDB" />
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
        <Button onPress={login} title="Sign in to ArkhamDB" />
      </View>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
  },
});
