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
import { getAccessToken, signIn, signOut } from '../lib/auth';

class LoginButton extends React.Component {
  static propTypes = {
    clearDecks: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      signedIn: false,
    };

    this._logInPressed = this.logInPressed.bind(this);
    this._logOutPressed = this.logOutPressed.bind(this);
    this._logOut = this.logOut.bind(this);
  }

  logInPressed() {
    this.setState({
      loading: true,
    }, () => {
      signIn().then(result => {
        if (result.success) {
          this.setState({
            loading: false,
            signedIn: true,
          });
        } else {
          this.setState({
            loading: false,
            signedIn: false,
            error: result.error,
          });
        }
      });
    });
  }

  logOutPressed() {
    Alert.alert(
      'Are you sure you want to sign out?',
      'Data on ArkhamDB will be preserved, but any edits made without internet might be lost.',
      [
        { text: 'Cancel' },
        { text: 'Sign Out', onPress: this._logOut },
      ],
    );
  }

  logOut() {
    this.setState({
      loading: true,
    }, () => {
      signOut().then(() => {
        this.props.clearDecks();
        this.setState({
          loading: false,
          signedIn: false,
        });
      });
    });
  }

  componentDidMount() {
    getAccessToken().then(accessToken => {
      this.setState({
        loading: false,
        signedIn: !!accessToken,
      });
    }, error => {
      console.log(error.message || error);
    });
  }

  render() {
    const {
      loading,
      signedIn,
    } = this.state;

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
        <Button onPress={this._logInPressed} title="Sign in to ArkhamDB" />
      </View>
    );
  }
}


function mapStateToProps(state, props) {
  return {};
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
