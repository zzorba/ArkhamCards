import React, { useCallback, useMemo } from 'react';
import { Platform, TouchableOpacity, View, Pressable, UIManager, Touchable } from 'react-native';
import { map, flatMap, filter, find, takeWhile } from 'lodash';
import { t } from 'ttag';

import DraggableList, { DraggableListRenderInfo } from '@components/core/DraggableList';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_FACTION_PACK,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
  SORT_BY_FACTION_XP,
  SORT_BY_XP,
  SORT_BY_CYCLE,
  SORT_BY_CARD_ID,
  SORT_BY_SLOT,
} from '@actions/types';
import { useDialog } from '@components/deck/dialogs';
import NewDialog from '@components/core/NewDialog';

function sortToCopy(sort: SortType): string {
  switch (sort) {
    case SORT_BY_TYPE:
      return t`Type`;
    case SORT_BY_FACTION:
      return t`Class`;
    case SORT_BY_COST:
      return t`Cost`;
    case SORT_BY_PACK:
      return t`Pack`;
    case SORT_BY_CYCLE:
      return t`Cycle`;
    case SORT_BY_TITLE:
      return t`Title`;
    case SORT_BY_ENCOUNTER_SET:
      return t`Encounter Set`;
    case SORT_BY_XP:
      return t`Level`;
    case SORT_BY_CARD_ID:
      return t`Card number`;
    case SORT_BY_SLOT:
      return t`Slot`;
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = sort;
      return '';
    }
  }
}
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SortItem {
  type: 'sort';
  sort: SortType;
}
interface HeaderItem {
  type: 'header';
  title: string;
}
type Item = SortItem | HeaderItem;

export function useSortDialog(
  sortChanged: (sort: SortType[]) => void,
  selectedSorts: SortType[],
  hasEncounterCards: boolean
): [React.ReactNode, () => void] {
  const items: Item[] = useMemo(() => {
    const sorts: SortType[] = [
      SORT_BY_TYPE,
      SORT_BY_SLOT,
      SORT_BY_FACTION,
      SORT_BY_COST,
      SORT_BY_CYCLE,
      SORT_BY_PACK,
      SORT_BY_TITLE,
      SORT_BY_XP,
      SORT_BY_CARD_ID,
    ];
    if (hasEncounterCards || find(selectedSorts, s => s === SORT_BY_ENCOUNTER_SET)) {
      sorts.push(SORT_BY_ENCOUNTER_SET);
    }
    const chosenSorts: SortItem[] = map(selectedSorts, sort => { return { type: 'sort', sort }; });
    const otherSorts: SortItem[] = map(filter(sorts, s => !find(selectedSorts, s2 => s2 === s)),  sort => { return { type: 'sort', sort }; });
    const availableHeader: HeaderItem = { type: 'header', title: t`Other` };
    return [
      ...chosenSorts,
      ...(otherSorts.length ? [availableHeader] : []),
      ...otherSorts,
    ];
  }, [hasEncounterCards, selectedSorts]);
  const onChanged = useCallback((data: Item[]) => {
    const newItems = flatMap(takeWhile(data, (item) => item.type !== 'header'), (item) => item.type === 'sort' ? [item.sort] : []);
    sortChanged(newItems);
  }, [sortChanged]);

  const renderItem = useCallback(({ item, getIndex, drag }: DraggableListRenderInfo<Item>) => {
    if (item.type === 'header') {
      return (
        <NewDialog.SectionHeader
          key={item.title}
          text={item.title}
        />
      );
    }
    const index = getIndex() || 0;
    const content = (
      <NewDialog.LineItem
        iconName="menu"
        text={sortToCopy(item.sort)}
        last={index === items.length - 1 || items[index + 1]?.type === 'header'}
      />
    );
    return (
      <Pressable
        key={item.sort}
        onPressIn={drag}
      >
        {content}
      </Pressable>
    );
  }, [items]);
  const { dialog, showDialog} = useDialog({
    title: t`Sort by`,
    allowDismiss: true,
    alignment: 'bottom',
    maxHeightPercent: 0.80,
    content: (
      <View>
        <NewDialog.SectionHeader text={t`Selected`} />
        <DraggableList
          data={items}
          onChanged={onChanged}
          renderItem={renderItem}
          keyExtractor={(item) => item.type == 'sort' ? item.sort : item.title}
        />
      </View>
    ),
  });
  return [dialog, showDialog];
}
