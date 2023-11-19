import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, View, Pressable, UIManager, Text } from 'react-native';
import { map, flatMap, filter, find, takeWhile } from 'lodash';
import { t, c } from 'ttag';

import DraggableList, { DraggableListRenderInfo } from '@components/core/DraggableList';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
  SORT_BY_XP,
  SORT_BY_CYCLE,
  SORT_BY_CARD_ID,
  SORT_BY_SLOT,
  DEFAULT_MYTHOS_SORT,
  DEFAULT_SORT,
} from '@actions/types';
import { useDialog } from '@components/deck/dialogs';
import NewDialog from '@components/core/NewDialog';
import StyleContext from '@styles/StyleContext';
import { TouchableOpacity } from '@components/core/Touchables';
import space from '@styles/space';
import deepEqual from 'deep-equal';

function sortToCopy(sort: SortType): string {
  switch (sort) {
    case SORT_BY_TYPE:
      return c('sort').t`Type`;
    case SORT_BY_FACTION:
      return c('sort').t`Class`;
    case SORT_BY_COST:
      return c('sort').t`Cost`;
    case SORT_BY_PACK:
      return c('sort').t`Pack`;
    case SORT_BY_CYCLE:
      return c('sort').t`Cycle`;
    case SORT_BY_TITLE:
      return c('sort').t`Title`;
    case SORT_BY_ENCOUNTER_SET:
      return c('sort').t`Encounter Set`;
    case SORT_BY_XP:
      return c('sort').t`Level`;
    case SORT_BY_CARD_ID:
      return c('sort').t`Card number`;
    case SORT_BY_SLOT:
      return c('sort').t`Slot`;
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
  saveSorts: (sort: SortType[]) => void,
  savedSorts: SortType[],
  mythosMode: boolean,
): [React.ReactNode, () => void] {
  const { typography } = useContext(StyleContext);

  const [selectedSorts, sortChanged] = useState<SortType[]>(savedSorts);
  useEffect(() => {
    sortChanged(savedSorts);
  }, [savedSorts]);
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
    if (mythosMode || find(selectedSorts, s => s === SORT_BY_ENCOUNTER_SET)) {
      sorts.push(SORT_BY_ENCOUNTER_SET);
    }
    const chosenSorts: SortItem[] = map(selectedSorts, sort => { return { type: 'sort', sort }; });
    const otherSorts: SortItem[] = map(filter(sorts, s => !find(selectedSorts, s2 => s2 === s)),  sort => { return { type: 'sort', sort }; });
    const availableHeader: HeaderItem = { type: 'header', title: t`Other` };
    return [
      ...chosenSorts,
      availableHeader,
      ...otherSorts,
    ];
  }, [mythosMode, selectedSorts]);


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
  const resetSort = useCallback(() => {
    sortChanged(mythosMode ? DEFAULT_MYTHOS_SORT : DEFAULT_SORT);
  }, [sortChanged, mythosMode]);
  const isDirty = useMemo(() => {
    return !deepEqual(selectedSorts, savedSorts);
  }, [selectedSorts, savedSorts]);
  const onSave = useCallback(() => {
    saveSorts(selectedSorts);
  }, [saveSorts, selectedSorts]);
  const onCancel = useCallback(() => {
    sortChanged(savedSorts);
  }, [sortChanged, savedSorts]);
  const { dialog, showDialog} = useDialog({
    title: t`Sort by`,
    allowDismiss: true,
    alignment: 'bottom',
    maxHeightPercent: 0.80,
    content: (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={resetSort}>
            <View style={space.paddingS}>
              <Text style={typography.subHeaderText}>{t`Reset`}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <NewDialog.SectionHeader text={t`Selected`} />
        <DraggableList
          data={items}
          onChanged={onChanged}
          renderItem={renderItem}
          keyExtractor={(item) => item.type == 'sort' ? item.sort : item.title}
        />
      </View>
    ),
    dismiss: {
      title: t`Cancel`,
      onPress: onCancel,
    },
    confirm: {
      title: t`Apply`,
      onPress: onSave,
      disabled: !isDirty,
    },
  });
  return [dialog, showDialog];
}
