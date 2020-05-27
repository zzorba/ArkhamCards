import React from 'react';
import { filter, groupBy, map } from 'lodash';
import {
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import { Pack } from 'actions/types';
import CardSectionHeader from 'components/core/CardSectionHeader';
import PackRow from './PackRow';

interface PackCycle {
  title: string;
  id: string;
  data: Pack[];
}

interface Props {
  componentId: string;
  coreSetName?: string;
  packs: Pack[];
  fontScale: number;
  checkState?: { [pack_code: string]: boolean};
  setChecked: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_number: number, checked: boolean) => void;
  renderHeader?: () => React.ReactElement;
  renderFooter?: () => React.ReactElement;
  whiteBackground?: boolean;
  baseQuery?: Brackets;
  compact?: boolean;
  noFlatList?: boolean;
}

export default class PackListComponent extends React.Component<Props> {
  _keyExtractor = (item: Pack) => {
    return item.code;
  };

  cycleName(position: string): string {
    switch (position) {
      case '1': return t`Core Set`;
      case '2': return t`The Dunwich Legacy`;
      case '3': return t`The Path to Carcosa`;
      case '4': return t`The Forgotten Age`;
      case '5': return t`The Circle Undone`;
      case '6': return t`The Dream-Eaters`;
      case '7': return t`The Innsmouth Conspiracy`;
      case '50': return t`Return to...`;
      case '60': return t`Investigator Starter Decks`;
      case '70': return t`Standalone`;
      case '80': return t`Miscelaneous`;
      case '90': return t`Parallel`;
      default: return 'Unknown';
    }
  }

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

  _renderSectionHeader = ({ section }: { section: SectionListData<PackCycle> }) => {
    const { fontScale } = this.props;
    return (
      <CardSectionHeader
        section={{ title: section.title }}
        fontScale={fontScale}
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
    const groups: PackCycle[] = map(
      groupBy(packs, pack => pack.cycle_position),
      (group, key) => {
        return {
          title: this.cycleName(`${key}`),
          id: key,
          data: group,
        };
      });

    return (
      <View style={styles.container}>
        <SectionList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          sections={groups}
          renderSectionHeader={this._renderSectionHeader}
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
