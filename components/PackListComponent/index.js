import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PackRow from './PackRow';

export default class PackListComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    coreSetName: PropTypes.string,
    packs: PropTypes.array,
    checkState: PropTypes.object,
    setChecked: PropTypes.func.isRequired,
    setCycleChecked: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    whiteBackground: PropTypes.bool,
    baseQuery: PropTypes.string,
    compact: PropTypes.bool,
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
      compact,
      coreSetName,
    } = this.props;
    const cyclePacks = item.position === 1 ? filter(packs, pack => {
      return (pack.cycle_position === item.cycle_position &&
        pack.id !== item.id);
    }) : [];
    return (
      <PackRow
        componentId={this.props.componentId}
        pack={item}
        nameOverride={item.code === 'core' ? coreSetName : null}
        cycle={cyclePacks}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
        checked={checkState && checkState[item.code]}
        whiteBackground={whiteBackground}
        baseQuery={baseQuery}
        compact={compact}
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
      <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
