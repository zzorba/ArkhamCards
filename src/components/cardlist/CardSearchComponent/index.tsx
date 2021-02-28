import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
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
import space from '@styles/space';
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
  storyOnly?: boolean;
  includeDuplicates?: boolean;
}

interface CardSearchNavigationOptions {
  componentId: string;
  modal?: boolean;
  lightButton?: boolean;
  mythosToggle?: boolean;
  baseQuery?: Brackets;
  title?: string;
}
export function navigationOptions(
  {
    componentId,
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
        filterId: componentId,
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
        filterId: componentId,
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
        filterId: componentId,
        lightButton,
      },
      width: SortButton.WIDTH,
      height: SortButton.HEIGHT,
    },
    accessibilityLabel: t`Sort`,
  }];
  if (mythosToggle && Platform.OS === 'android') {
    rightButtons.push(mythosButton);
  }
  const topBarOptions: OptionsTopBar = {
    rightButtons,
  };
  if (mythosToggle && Platform.OS === 'ios') {
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
    storyOnly,
    includeDuplicates,
  } = props;
  const { typography } = useContext(StyleContext);
  const visible = useComponentVisible(componentId);
  const filterSelector = useCallback((state: AppState) => getFilterState(state, componentId), [componentId]);
  const filters = useSelector(filterSelector);
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, componentId), [componentId]);
  const mythosMode = useSelector(mythosModeSelector);
  const selectedSortSelector = useCallback((state: AppState) => getCardSort(state, componentId), [componentId]);
  const selectedSort = useSelector(selectedSortSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    Navigation.mergeOptions(componentId,
      navigationOptions(
        {
          componentId,
          baseQuery,
          mythosToggle,
          lightButton: deckId !== undefined,
        }
      ));
    return function cleanup() {
      dispatch(removeFilterSet(componentId));
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
    dispatch(toggleMythosMode(componentId, !mythosMode));
  }, [dispatch, componentId, mythosMode]);

  const onFilterChange = useCallback((key: keyof FilterState, value: any) => {
    dispatch(updateFilter(componentId, key, value));
  }, [componentId, dispatch]);

  const onToggleChange = useCallback((key: keyof FilterState, value: boolean) => {
    dispatch(toggleFilter(componentId, key, value));
  }, [componentId, dispatch]);

  const header = useMemo(() => {
    const result: React.ReactElement[] = [];
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
        />
      );
    }
    if (setHideVersatile) {
      result.push(
        <View style={[styles.row, space.paddingRightS, space.paddingTopS, space.paddingBottomS]}>
          <Text style={[typography.small, styles.searchOption, space.paddingRightS]}>
            { t`Hide versatile cards` }
          </Text>
          <ArkhamSwitch
            value={!!hideVersatile}
            onValueChange={setHideVersatile}
          />
        </View>
      );
    }

    if (!result.length) {
      return undefined;
    }
    return (
      <>
        { result }
      </>
    );
  }, [filters, deckId, hideVersatile, setHideVersatile, typography, onFilterChange, onToggleChange]);

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
      header={header}
      visible={visible}
      storyOnly={storyOnly}
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
    flex: 1,
  },
  searchOption: {
    marginRight: 2,
  },
});
