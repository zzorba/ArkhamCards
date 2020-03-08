import React from 'react';
import { filter, map } from 'lodash';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Pack } from 'actions/types';
import PackRow from './PackRow';

interface Props {
  componentId: string;
  coreSetName?: string;
  packs: Pack[];
  checkState?: { [pack_code: string]: boolean};
  setChecked: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_number: number, checked: boolean) => void;
  renderHeader?: () => React.ReactElement;
  renderFooter?: () => React.ReactElement;
  whiteBackground?: boolean;
  baseQuery?: string;
  compact?: boolean;
  noFlatList?: boolean;
}

export default class PackListComponent extends React.Component<Props> {
  _keyExtractor = (item: Pack) => {
    return item.code;
  };

  _renderItem = ({ item }: { item: Pack }) => {
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
    const cyclePacks: Pack[] = item.position === 1 ? filter(packs, pack => {
      return (pack.cycle_position === item.cycle_position &&
        pack.id !== item.id);
    }) : [];
    return (
      <PackRow
        key={item.id}
        componentId={this.props.componentId}
        pack={item}
        nameOverride={item.code === 'core' ? coreSetName : undefined}
        cycle={cyclePacks}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
        checked={checkState && checkState[item.code]}
        whiteBackground={whiteBackground}
        baseQuery={baseQuery}
        compact={compact}
      />
    );
  };

  render() {
    const {
      packs,
      checkState,
      renderHeader,
      renderFooter,
      noFlatList,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    if (noFlatList) {
      return (
        <View style={styles.container}>
          { !!renderHeader && renderHeader() }
          { map(packs, item => this._renderItem({ item })) }
          { !!renderFooter && renderFooter() }
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
