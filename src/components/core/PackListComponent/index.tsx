import React, { useCallback, useContext } from 'react';
import { filter, find, groupBy, map, sortBy } from 'lodash';
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
import { cycleName, getPackChapter, ReprintPack, reprintPackToPack, SPECIAL_PACKS } from '@app_constants';
import ArkhamButton from '../ArkhamButton';
import { useToggles } from '../hooks';

type PackItem = {
  type: 'pack';
  pack: Pack;
} | {
  type: 'reprint';
  reprint: ReprintPack;
  pack: Pack;
} | {
  type: 'reprint_toggle';
  cycleCode: string;
  packs: Pack[];
}

interface PackCycle extends SectionListData<PackItem> {
  title: string;
  id: string;
  data: PackItem[];
  isChapter?: boolean;
  chapter?: number;
}

interface Props {
  alwaysShowCoreSet?: boolean;
  cyclesOnly?: boolean;
  coreSetName?: string;
  packs: Pack[];
  checkState?: { [pack_code: string]: boolean | undefined };
  setChecked?: (pack_code: string, checked: boolean) => void;
  setCycleChecked?: (cycle_code: string, checked: boolean) => void;
  header?: React.ReactElement;
  renderFooter?: () => React.ReactElement;
  baseQuery?: Brackets;
  compact?: boolean;
  noFlatList?: boolean;
  includeNoCore?: boolean;
}

function keyExtractor(item: PackItem) {
  switch (item.type) {
    case 'pack': return item.pack.code;
    case 'reprint_toggle': return item.cycleCode;
    case 'reprint': return item.reprint.code;
  }
}

function renderSectionHeader({ section }: { section: SectionListData<PackItem> & { isChapter?: boolean } }) {
  if (section.isChapter) {
    return (
      <CardSectionHeader section={{ title: section.title }} />
    );
  }
  return (
    <CardSectionHeader section={{ subTitle: section.title }} />
  );
}

export default function PackListComponent({
  alwaysShowCoreSet,
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
  cyclesOnly,
  includeNoCore,
}: Props) {
  const { typography } = useContext(StyleContext);
  const [showLegacy, setShowLegacy] = useToggles({});
  const renderPack = useCallback((pack: Pack) => {
    const cyclePacks: Pack[] = pack.position === 1 ? filter(packs, p => {
      return (pack.cycle_position === p.cycle_position &&
        pack.id !== p.id);
    }) : [];
    if (pack.code === 'core' && (alwaysShowCoreSet || includeNoCore)) {
      return (
        <>
          { (alwaysShowCoreSet || includeNoCore) && pack.code === 'core' && (
            <PackRow
              key="always-core"
              pack={pack}
              packId="no_core"
              nameOverride={t`Core Set`}
              cycle={cyclePacks}
              baseQuery={baseQuery}
              compact={compact}
              setChecked={!checkState?.core ? setChecked : undefined}
              checked={!checkState?.no_core}
            />
          ) }
          { (!includeNoCore || !checkState?.no_core) && (
            <PackRow
              key={pack.id}
              pack={pack}
              nameOverride={coreSetName}
              cycle={cyclePacks}
              setChecked={setChecked}
              setCycleChecked={setCycleChecked}
              checked={checkState && checkState[pack.code]}
              baseQuery={baseQuery}
              compact={compact}
              alwaysCycle={cyclesOnly}
            />
          ) }
        </>
      )
    }
    return (
      <PackRow
        key={pack.id}
        pack={pack}
        cycle={cyclePacks}
        setChecked={setChecked}
        setCycleChecked={setCycleChecked}
        checked={checkState && checkState[pack.code]}
        baseQuery={baseQuery}
        compact={compact}
        alwaysCycle={cyclesOnly}
      />
    );
  }, [packs, checkState, cyclesOnly, alwaysShowCoreSet, includeNoCore, setChecked, setCycleChecked, baseQuery, compact, coreSetName]);

  const renderItem = useCallback(({ item }: SectionListRenderItemInfo<PackItem>) => {
    switch (item.type) {
      case 'pack':
        return renderPack(item.pack);
      case 'reprint':
        return (
          <PackRow
            key={item.pack.code}
            pack={item.pack}
            cycle={[]}
            setChecked={setChecked}
            setCycleChecked={setCycleChecked}
            checked={checkState && checkState[item.pack.code]}
            baseQuery={baseQuery}
            compact={compact}
            alwaysCycle={cyclesOnly}
          />
        );
      case 'reprint_toggle':
        if (showLegacy[item.cycleCode] || !!find(item.packs, pack => checkState && checkState[pack.code])) {
          return (
            <>
              { map(item.packs, pack => (
                <PackRow
                  key={pack.code}
                  pack={pack}
                  cycle={[]}
                  setChecked={setChecked}
                  setCycleChecked={setCycleChecked}
                  checked={checkState && checkState[pack.code]}
                  baseQuery={baseQuery}
                  compact={compact}
                  alwaysCycle={cyclesOnly}
                />
              ))}
            </>
          );
        }
        return (
          <View>
            { /* eslint-disable-next-line react/jsx-no-bind */ }
            <ArkhamButton icon="show" title={t`Show original release packs`} onPress={() => setShowLegacy(item.cycleCode)} />
          </View>
        );
    }
  }, [baseQuery, compact, cyclesOnly, setChecked, setCycleChecked, renderPack, checkState, setShowLegacy, showLegacy]);


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
  function chapterForGroup(group: Pack[]): number | undefined {
    return group[0] ? getPackChapter(group[0]) : undefined;
  }

  function chapterSortOrder(chapter: number | undefined): number {
    switch (chapter) {
      case 2: return 0;
      case 1: return 1;
      default: return 2;
    }
  }

  function chapterLabel(chapter: number | undefined): string {
    switch (chapter) {
      case 2: return t`Chapter 2`;
      case 1: return t`Chapter 1`;
      default: return t`Fan-Made`;
    }
  }

  const cycleGroups: PackCycle[] = map(
    groupBy(
      filter(packs, pack => pack.code !== 'books' && (
        !cyclesOnly ||
        pack.cycle_position < 2 ||
        pack.cycle_position >= 50 ||
        pack.position === 1
      ) && (!cyclesOnly || pack.cycle_position < 70) && !pack.reprint),
      pack => {
        const cycleKey = (cyclesOnly && pack.cycle_position >= 2 && pack.cycle_position < 50) ? 2 : pack.cycle_position;
        return `${cycleKey}_ch${getPackChapter(pack) ?? 'none'}`;
      }),
    (group, key) => {
      const cycleKey = key.split('_ch')[0];
      const reprintPacks = filter(SPECIAL_PACKS, reprintPack => `${reprintPack.cyclePosition}` === cycleKey);
      if (!cyclesOnly && reprintPacks.length) {
        const items: PackItem[] = [
          ...map(reprintPacks, reprint => {
            const item: PackItem = {
              type: 'reprint',
              reprint,
              pack: reprintPackToPack(reprint),
            };
            return item;
          }),
          {
            type: 'reprint_toggle',
            packs: group,
            cycleCode: cycleKey,
          },
        ];
        return {
          title: cycleKey === '2' && cyclesOnly ? t`Campaigns Cycles` : cycleName(cycleKey),
          id: key,
          data: items,
          chapter: chapterForGroup(group),
        };
      }
      return {
        title: cycleKey === '2' && cyclesOnly ? t`Campaigns Cycles` : cycleName(cycleKey),
        id: key,
        data: map(group, pack => {
          return {
            type: 'pack',
            pack,
          };
        }),
        reprintPacks,
        chapter: chapterForGroup(group),
      };
    });

  const sortedGroups = sortBy(cycleGroups, g => chapterSortOrder(g.chapter));
  const groups: PackCycle[] = [];
  let currentChapter: number | undefined | null = null;
  sortedGroups.forEach(group => {
    const chapter = group.chapter;
    if (currentChapter !== chapter) {
      currentChapter = chapter;
      groups.push({
        title: chapterLabel(chapter),
        id: `chapter-${chapter}`,
        data: [],
        isChapter: true,
      });
    }
    groups.push(group);
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
