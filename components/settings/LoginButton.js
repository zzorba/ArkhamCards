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

import L from '../../app/i18n';
import * as Actions from '../../actions';

class LoginButton extends React.Component {
  static propTypes = {
    signedIn: PropTypes.bool.isRequired,
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
      L('Are you sure you want to sign out?'),
      L('Data on ArkhamDB will be preserved, but all Campaign data and any edits made without internet might be lost.\n\n If you are having trouble with your account you can also reconnect.'),
      [
        { text: L('Sign Out'), style: 'destructive', onPress: this.props.logout },
        { text: L('Reconnect Account'), onPress: this.props.login },
        { text: L('Cancel') },
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
          <Button onPress={this._logOutPressed} title={L('Sign out of ArkhamDB')} />
        </View>
      );
    }

    return (
      <View style={styles.wrapper}>
        <Button onPress={login} title={L('Sign in to ArkhamDB')} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    signedIn: state.signedIn.status,
    loading: state.signedIn.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 40,
    padding: 4,
  },
});
