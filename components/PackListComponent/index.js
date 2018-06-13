import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  FlatList,
  Text,
  View,
} from 'react-native';

import PackRow from './PackRow';

export default class PackListComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    packs: PropTypes.array,
    checkState: PropTypes.object,
    setChecked: PropTypes.func,
    renderHeader: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._renderItem = this.renderItem.bind(this);
    this._keyExtractor = this.keyExtractor.bind(this);
    this._setCycleChecked = this.setCycleChecked.bind(this);
  }

  keyExtractor(item) {
    return item.code;
  }

  renderItem({ item }) {
    const {
      checkState,
      setChecked,
    } = this.props;
    return (
      <PackRow
        navigator={this.props.navigator}
        pack={item}
        setChecked={setChecked}
        setCycleChecked={this._setCycleChecked}
        checked={checkState && checkState[item.code]}
      />
    );
  }

  setCycleChecked(cyclePosition, value) {
    const {
      packs,
      setChecked,
    } = this.props;
    forEach(packs, pack => {
      if (pack.cycle_position === cyclePosition) {
        setChecked(pack.code, value);
      }
    });
  }

  render() {
    const {
      packs,
      checkState,
      renderHeader,
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
          ListHeaderComponent={renderHeader}
          data={packs}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={checkState}
        />
      </View>
    );
  }
}
