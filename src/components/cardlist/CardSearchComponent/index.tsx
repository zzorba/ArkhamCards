import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { Navigation, OptionsTopBarButton, OptionsTopBar } from 'react-native-navigation';
import { t } from 'ttag';

import { DeckId, SortType } from '@actions/types';
import Card from '@data/types/Card';
import XpChooser from '@components/filter/CardFilterView/XpChooser';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import { FilterState } from '@lib/filters';
import { removeFilterSet, clearFilters, toggleMythosMode, toggleFilter, updateFilter } from '@components/filter/actions';
import { getFilterState, getMythosMode, getCardSort, AppState } from '@reducers';
import MythosButton from './MythosButton';
import TuneButton from './TuneButton';
import SortButton from './SortButton';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import { useComponentVisible, useEffectUpdate } from '@components/core/hooks';

interface Props {
  componentId: string;
  baseQuery?: Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  sort?: SortType;

  investigator?: Card;
  deckId?: DeckId;
  hideVersatile?: boolean;
  setHideVersatile?: (value: boolean) => void;
  mode?: 'story' | 'side';
  includeDuplicates?: boolean;
}

interface CardSearchNavigationOptions {
  componentId: string;
  filterId: string;
  modal?: boolean;
  lightButton?: boolean;
  mythosToggle?: boolean;
  baseQuery?: Brackets;
  title?: string;
}
export function navigationOptions(
  {
    componentId,
    filterId,
    modal,
    lightButton,
    mythosToggle,
    baseQuery,
  }: CardSearchNavigationOptions
){
  const mythosButton: OptionsTopBarButton = {
    id: 'mythos',
    component: {
      name: 'MythosButton',
      passProps: {
        filterId,
        lightButton,
      },
      width: MythosButton.WIDTH,
      height: MythosButton.HEIGHT,
    },
    enabled: true,
    accessibilityLabel: t`Encounter Card Toggle`,
  };

  const rightButtons: OptionsTopBarButton[] = [{
    id: 'filter',
    component: {
      name: 'TuneButton',
      passProps: {
        parentComponentId: componentId,
        filterId,
        baseQuery,
        modal,
        lightButton,
      },
      width: TuneButton.WIDTH,
      height: TuneButton.HEIGHT,
    },
    accessibilityLabel: t`Filters`,
    enabled: true,
  }, {
    id: 'sort',
    component: {
      name: 'SortButton',
      passProps: {
        filterId,
        lightButton,
      },
      width: SortButton.WIDTH,
      height: SortButton.HEIGHT,
    },
    accessibilityLabel: t`Sort`,
  }];
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };
  if (mythosToggle) {
    topBarOptions.leftButtons = [mythosButton];
  }

  return {
    topBar: topBarOptions,
  };
}

export default function CardSearchComponent(props: Props) {
  const {
    componentId,
    deckId,
    baseQuery,
    mythosToggle,
    showNonCollection,
    sort,
    investigator,
    hideVersatile,
    setHideVersatile,
    mode,
    includeDuplicates,
  } = props;
  const { fontScale, typography, width } = useContext(StyleContext);
  const visible = useComponentVisible(componentId);
  const filterId = deckId?.uuid || componentId;
  const filterSelector = useCallback((state: AppState) => getFilterState(state, filterId), [filterId]);
  const filters = useSelector(filterSelector);
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, filterId), [filterId]);
  const mythosMode = useSelector(mythosModeSelector);
  const selectedSortSelector = useCallback((state: AppState) => getCardSort(state, filterId), [filterId]);
  const selectedSort = useSelector(selectedSortSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    Navigation.mergeOptions(componentId,
      navigationOptions(
        {
          componentId,
          filterId,
          baseQuery,
          mythosToggle,
          lightButton: deckId !== undefined,
        }
      ));
    return function cleanup() {
      if (!deckId) {
        dispatch(removeFilterSet(filterId));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClearSearchFilters = useCallback(() => {
    dispatch(clearFilters(componentId));
  }, [dispatch, componentId]);

  useEffectUpdate(() => {
    if (mythosToggle) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: mythosMode ? t`Encounter Cards` : t`Player Cards`,
          },
        },
      });
    }
  }, [mythosToggle, mythosMode, componentId]);

  const onToggleMythosMode = useCallback(() => {
    dispatch(toggleMythosMode(filterId, !mythosMode));
  }, [dispatch, filterId, mythosMode]);

  const onFilterChange = useCallback((key: keyof FilterState, value: any) => {
    dispatch(updateFilter(filterId, key, value));
  }, [filterId, dispatch]);

  const onToggleChange = useCallback((key: keyof FilterState, value: boolean) => {
    dispatch(toggleFilter(filterId, key, value));
  }, [filterId, dispatch]);

  const [headerItems, headerHeight] = useMemo(() => {
    let headerHeight: number = 0;
    const result: React.ReactNode[] = [];
    if (deckId !== undefined) {
      result.push(
        <XpChooser
          key="xp"
          onFilterChange={onFilterChange}
          onToggleChange={onToggleChange}
          maxLevel={5}
          levels={filters?.level || [0,5]}
          enabled={filters?.levelEnabled || false}
          exceptional={filters?.exceptional || false}
          nonExceptional={filters?.nonExceptional || false}
          componentId={componentId}
        />
      );
      headerHeight += (s * 2 + 10 * 2 + fontScale * 28);
    }
    if (setHideVersatile) {
      result.push(
        <View key="versatile" style={[styles.row, space.paddingRightS, space.paddingTopS, space.paddingBottomS, { width }]}>
          <View style={space.paddingRightS}>
            <Text style={[typography.small, styles.searchOption]}>
              { t`Hide versatile cards` }
            </Text>
          </View>
          <ArkhamSwitch
            value={!!hideVersatile}
            onValueChange={setHideVersatile}
          />
        </View>
      );
      headerHeight += s * 2 + 28 * fontScale;
    }
    return [result, headerHeight];
  }, [filters, fontScale, width, deckId, hideVersatile, setHideVersatile, componentId, typography, onFilterChange, onToggleChange]);

  return (
    <CardSearchResultsComponent
      componentId={componentId}
      deckId={deckId}
      baseQuery={baseQuery}
      mythosToggle={mythosToggle}
      mythosMode={mythosMode}
      showNonCollection={showNonCollection}
      selectedSort={selectedSort}
      filters={filters}
      toggleMythosMode={onToggleMythosMode}
      clearSearchFilters={onClearSearchFilters}
      investigator={investigator}
      headerItems={headerItems}
      headerHeight={headerHeight}
      visible={visible}
      mode={mode}
      initialSort={sort}
      includeDuplicates={includeDuplicates}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchOption: {
    marginRight: 2,
  },
});
