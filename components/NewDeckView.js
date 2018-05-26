import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { Button } from 'react-native-elements';

import InvestigatorsListComponent from './InvestigatorsListComponent';

export default class NewDeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: 'New Deck',
    });
  }

  onPress() {
    this.props.navigator.pop();
  }

  render() {
    const {
      navigator,
    } = this.props;
    return (
      <InvestigatorsListComponent navigator={navigator} onPress={this._onPress} />
    );
  }
}
