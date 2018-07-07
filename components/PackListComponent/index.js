import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
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
    setChecked: PropTypes.func.isRequired,
    setCycleChecked: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    whiteBackground: PropTypes.bool,
    baseQuery: PropTypes.string,
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
      packs,
      checkState,
      setChecked,
      setCycleChecked,
      whiteBackground,
      baseQuery,
    } = this.props;
    const cyclePacks = item.position === 1 ? filter(packs, pack => {
      return (pack.cycle_position === item.cycle_position &&
        pack.id !== item.id);
    }) : [];
    return (
      <PackRow
        navigator={this.props.navigator}
        pack={item}
        cycle={cyclePacks}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
        checked={checkState && checkState[item.code]}
        whiteBackground={whiteBackground}
        baseQuery={baseQuery}
      />
    );
  }

  render() {
    const {
      packs,
      checkState,
      renderHeader,
      renderFooter,
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
          ListFooterComponent={renderFooter}
          data={packs}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={checkState}
        />
      </View>
    );
  }
}
