import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import PackRow from './PackRow';

export default class PackListView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    checkState: PropTypes.object,
    setChecked: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._renderItem = this.renderItem.bind(this);
    this._keyExtractor = this.keyExtractor.bind(this);
  }

  keyExtractor(item) {
    return item.code;
  }

  renderItem({ item }) {
    const {
      setChecked,
      checkState,
    } = this.props;
    return (
      <PackRow
        navigator={this.props.navigator}
        pack={item}
        setChecked={setChecked}
        checked={checkState && checkState[item.code]}
      />
    );
  }

  render() {
    const {
      packs,
      checkState,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={packs}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={checkState}
        />
      </View>
    );
  }
}
