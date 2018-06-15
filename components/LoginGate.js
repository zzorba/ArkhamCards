import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../actions';
import { syncCards } from '../lib/api';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;

/**
 * Simple component to block children rendering until a login flow is completed.
 */
export default class LoginGate extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      loading,
      children,
    } = this.props;
    const {
      loadingCards,
    } = this.state;
    if (loading || loadingCards) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <Text>Loading latest cards...</Text>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
