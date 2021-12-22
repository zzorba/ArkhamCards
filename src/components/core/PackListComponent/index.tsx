import React, { useCallback, useContext } from 'react';
import { filter, groupBy, map } from 'lodash';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import { Pack } from '@actions/types';
import CardSectionHeader from '@components/core/CardSectionHeader';
import PackRow from './PackRow';
import StyleContext from '@styles/StyleContext';

interface PackCycle extends SectionListData<Pack> {
  title: string;
  id: string;
  data: Pack[];
}

interface Props {
  componentId: string;
  coreSetName?: string;
  packs: Pack[];
  checkState?: { [pack_code: string]: boolean | undefined };
  setChecked: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_code: string, checked: boolean) => void;
  header?: JSX.Element;
  renderFooter?: () => JSX.Element;
  baseQuery?: Brackets;
  compact?: boolean;
  noFlatList?: boolean;
}

function keyExtractor(item: Pack) {
  return item.code;
}

function cycleName(position: string): string {
  switch (position) {
    case '1': return t`Core Set`;
    case '2': return t`The Dunwich Legacy`;
    case '3': return t`The Path to Carcosa`;
    case '4': return t`The Forgotten Age`;
    case '5': return t`The Circle Undone`;
    case '6': return t`The Dream-Eaters`;
    case '7': return t`The Innsmouth Conspiracy`;
    case '8': return t`Edge of the Earth`;
    case '50': return t`Return to...`;
    case '60': return t`Investigator Starter Decks`;
    case '70': return t`Standalone`;
    case '80': return t`Books`;
    case '90': return t`Parallel`;
    default: return 'Unknown';
  }
}

function renderSectionHeader({ section }: { section: SectionListData<Pack> }) {
  return (
    <CardSectionHeader
      section={{ subTitle: section.title }}
    />
  );
}

export default function PackListComponent({
  componentId,
  coreSetName,
  packs,
  checkState,
  setChecked,
  setCycleChecked,
  header,
  renderFooter,
  baseQuery,
  compact,
  noFlatList,
}: Props) {
  const { typography } = useContext(StyleContext);
  const renderPack = useCallback((pack: Pack) => {
    const cyclePacks: Pack[] = pack.position === 1 ? filter(packs, p => {
      return (pack.cycle_position === p.cycle_position &&
        pack.id !== p.id);
    }) : [];
    return (
      <PackRow
        key={pack.id}
        componentId={componentId}
        pack={pack}
        nameOverride={pack.code === 'core' ? coreSetName : undefined}
        cycle={cyclePacks}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
        checked={checkState && checkState[pack.code]}
        baseQuery={baseQuery}
        compact={compact}
      />
    );
  }, [packs, checkState, componentId, setChecked, setCycleChecked, baseQuery, compact, coreSetName]);

  const renderItem = useCallback(({ item }: SectionListRenderItemInfo<Pack>) => {
    return renderPack(item);
  }, [renderPack]);


  if (!packs.length) {
    return (
      <View>
        <Text style={typography.text}>{t`Loading`}</Text>
      </View>
    );
  }
  if (noFlatList) {
    return (
      <View style={styles.container}>
        { !!header && header }
        { map(packs, item => renderPack(item)) }
        { !!renderFooter && renderFooter() }
      </View>
    );
  }
  const groups: PackCycle[] = map(
    groupBy(filter(packs, pack => pack.code !== 'books'), pack => pack.cycle_position),
    (group, key) => {
      return {
        title: cycleName(`${key}`),
        id: key,
        data: group,
      };
    });

  return (
    <SectionList
      ListHeaderComponent={header}
      ListFooterComponent={renderFooter}
      sections={groups}
      initialNumToRender={30}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled={false}
      extraData={checkState}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});
