import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import { generateUuid } from '@lib/uuid';

import { CardScreenType, DeckId, Slots, SortType } from '@actions/types';
import { InvestigatorChoice } from '@data/types/Card';
import XpChooser from '@components/filter/CardFilterView/XpChooser';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import { FilterState } from '@lib/filters';
import { removeFilterSet, clearFilters, toggleMythosMode, toggleFilter, updateFilter, updateCardSorts } from '@components/filter/actions';
import { getFilterState, getMythosMode, getCardSort, AppState } from '@reducers';
import MythosButton from './MythosButton';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import { useComponentVisible, useEffectUpdate } from '@components/core/hooks';
import HeaderButton from '@components/core/HeaderButton';
import { useFilterButton } from '../hooks';
import { useSortDialog } from '../CardSortDialog';
import TuneButton from './TuneButton';

export function useFilterSortDialog(filterId: string, screenType: CardScreenType): [React.ReactNode, () => void] {
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, filterId), [filterId]);
  const mythosMode = useSelector(mythosModeSelector);
  const sortSelector = useCallback((state: AppState) => getCardSort(state, screenType, mythosMode), [screenType, mythosMode]);
  const sorts = useSelector(sortSelector);
  const dispatch = useDispatch();

  const sortChanged = useCallback((sorts: SortType[]) => {
    dispatch(updateCardSorts(sorts, screenType, mythosMode));
  }, [dispatch, screenType, mythosMode]);
  const [sortDialog, showSortDialog] = useSortDialog(sortChanged, sorts, mythosMode);
  const onPress = useCallback(() => {
    Keyboard.dismiss();
    showSortDialog();
  }, [showSortDialog]);
  return [sortDialog, onPress];
}


interface Props {
  filterId?: string;
  baseQuery?: (filters: FilterState | undefined, slots: Slots | undefined) => Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  sort?: SortType;

  screenType: CardScreenType;

  investigator?: InvestigatorChoice;
  deckId?: DeckId;
  hideVersatile?: boolean;
  setHideVersatile?: (value: boolean) => void;
  mode?: 'story' | 'side' | 'extra';
  includeDuplicates?: boolean;

  hideSplash?: boolean;
  setHideSplash?: (value: boolean) => void;
}

export default function CardSearchComponent(props: Props) {
  const {
    deckId,
    baseQuery,
    mythosToggle,
    showNonCollection,
    sort,
    investigator,
    hideSplash,
    setHideSplash,
    hideVersatile,
    setHideVersatile,
    mode,
    includeDuplicates,
    screenType,
  } = props;
  const { fontScale, typography, width, colors } = useContext(StyleContext);
  const navigation = useNavigation();
  const visible = useComponentVisible();
  const randomFilterId = useMemo(() => generateUuid(), []);
  const filterId = deckId?.uuid || props.filterId || randomFilterId;
  const filterSelector = useCallback((state: AppState) => getFilterState(state, filterId), [filterId]);
  const filters = useSelector(filterSelector);
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, filterId), [filterId]);
  const mythosMode = useSelector(mythosModeSelector);
  const selectedSortSelector = useCallback(
    (state: AppState) => getCardSort(state, screenType, mythosMode),
    [screenType, mythosMode]);
  const selectedSorts = useSelector(selectedSortSelector);
  const dispatch = useDispatch();

  // Cleanup filter set on unmount (if not a deck search)
  useEffect(() => {
    return function cleanup() {
      if (!deckId) {
        dispatch(removeFilterSet(filterId));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, showFilters] = useFilterButton({ filterId, baseQuery, modal: false });

  const [dialog, showSortDialog] = useFilterSortDialog(filterId, screenType);
  // Set up header buttons
  useEffect(() => {
    navigation.setOptions({
      headerLeft: mythosToggle ? () => (
        <MythosButton filterId={filterId} />
      ) : undefined,
      headerRight: () => (
        <>
          <TuneButton
            filterId={filterId}
            lightButton={!!deckId}
            baseQuery={baseQuery}
          />
          <HeaderButton
            iconName="sort"
            onPress={showSortDialog}
            color={deckId ? '#FFFFFF' : colors.M}
            accessibilityLabel={t`Sort`}
          />
        </>
      ),
    });
  }, [navigation, deckId, baseQuery, showFilters, showSortDialog, colors.M, mythosToggle, filterId]);

  const onClearSearchFilters = useCallback(() => {
    dispatch(clearFilters(filterId));
  }, [dispatch, filterId]);

  useEffectUpdate(() => {
    if (mythosToggle) {
      navigation.setOptions({
        title: mythosMode ? t`Encounter Cards` : t`Player Cards`,
      });
    }
  }, [mythosToggle, mythosMode, navigation]);

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
    if (setHideSplash) {
      result.push(
        <View key="splash" style={[styles.row, space.paddingRightS, space.paddingTopS, space.paddingBottomS, { width }]}>
          <View style={space.paddingRightS}>
            <Text style={[typography.small, styles.searchOption]}>
              { t`Hide splash cards` }
            </Text>
          </View>
          <ArkhamSwitch
            value={!!hideSplash}
            onValueChange={setHideSplash}
          />
        </View>
      );
    }
    return [result, headerHeight];
  }, [hideSplash, filters, fontScale, width, deckId, hideVersatile, setHideVersatile, setHideSplash, typography, onFilterChange, onToggleChange]);
  return (
    <>
      <CardSearchResultsComponent
        deckId={deckId}
        filterId={filterId}
        baseQuery={baseQuery}
        mythosToggle={mythosToggle}
        mythosMode={mythosMode}
        showNonCollection={showNonCollection}
        selectedSorts={selectedSorts}
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
      {dialog}
    </>
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
