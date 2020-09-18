import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import BasicButton from '@components/core/BasicButton';
import SettingsItem from './SettingsItem';
import { t } from 'ttag';
import { logout, login } from '@actions';
import { AppState } from '@reducers';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface OwnProps {
  settings?: boolean;
}

interface ReduxProps {
  signedIn: boolean;
  loading?: boolean;
}

interface ReduxActionProps {
  login: () => void;
  logout: () => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class LoginButton extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _logOutPressed = () => {
    Alert.alert(
      t`Are you sure you want to sign out?`,
      t`Data on ArkhamDB will be preserved, but all Campaign data and any edits made without internet might be lost.\n\n If you are having trouble with your account you can also reconnect.`,
      [
        { text: t`Sign Out`, style: 'destructive', onPress: this.props.logout },
        { text: t`Reconnect Account`, onPress: this.props.login },
        { text: t`Cancel` },
      ],
    );
  };

  render() {
    const {
      settings,
      signedIn,
      loading,
      login,
    } = this.props;
    const { colors } = this.context;
    if (loading) {
      return (
        <ActivityIndicator
          style={[{ height: 60 }]}
          color={colors.lightText}
          size="small"
          animating
        />
      );
    }

    if (signedIn) {
      return settings ? (
        <SettingsItem onPress={this._logOutPressed} text={t`Sign out of ArkhamDB`} />
      ) : (
        <View style={styles.wrapper}>
          <BasicButton onPress={this._logOutPressed} title={t`Sign out of ArkhamDB`} />
        </View>
      );
    }

    return settings ? (
      <SettingsItem onPress={login} text={t`Sign in to ArkhamDB`} />
    ) : (
      <View style={styles.wrapper}>
        <BasicButton onPress={login} title={t`Sign in to ArkhamDB`} />
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    signedIn: state.signedIn.status,
    loading: state.signedIn.loading,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    logout,
    login,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: 40,
  },
});
