import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { Platform, Text, View, StyleSheet, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { Navigation, OptionsTopBarButton, OptionsTopBar } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { CardScreenType, DeckId, Slots, SortType } from '@actions/types';
import { InvestigatorChoice } from '@data/types/Card';
import XpChooser from '@components/filter/CardFilterView/XpChooser';
import CardSearchResultsComponent from '@components/cardlist/CardSearchResultsComponent';
import { FilterState } from '@lib/filters';
import { removeFilterSet, clearFilters, toggleMythosMode, toggleFilter, updateFilter, updateCardSorts } from '@components/filter/actions';
import { getFilterState, getMythosMode, getCardSort, AppState } from '@reducers';
import MythosButton from './MythosButton';
import TuneButton from './TuneButton';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import { useComponentVisible, useEffectUpdate, useNavigationButtonPressed } from '@components/core/hooks';
import COLORS from '@styles/colors';
import { useFilterButton } from '../hooks';
import { useSortDialog } from '../CardSortDialog';


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
  componentId: string;
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

interface CardSearchNavigationOptions {
  componentId: string;
  filterId: string;
  modal?: boolean;
  lightButton?: boolean;
  mythosToggle?: boolean;
  baseQuery?: (filters: FilterState | undefined, slots: Slots | undefined) => Brackets;
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
) {
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

  const filterButton: OptionsTopBarButton = Platform.OS === 'ios' ? {
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
  } : {
    id: 'filter',
    icon: iconsMap.filter,
    color: lightButton ? 'white' : COLORS.M,
    accessibilityLabel: t`Filters`,
  };

  const rightButtons: OptionsTopBarButton[] = [
    filterButton,
    {
      id: 'sort',
      icon: iconsMap.sort,
      color: lightButton ? 'white' : COLORS.M,
      accessibilityLabel: t`Sort`,
    },
  ];
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
    hideSplash,
    setHideSplash,
    hideVersatile,
    setHideVersatile,
    mode,
    includeDuplicates,
    screenType,
  } = props;
  const { fontScale, typography, width } = useContext(StyleContext);
  const visible = useComponentVisible(componentId);
  const filterId = deckId?.uuid || props.filterId || componentId;
  const filterSelector = useCallback((state: AppState) => getFilterState(state, filterId), [filterId]);
  const filters = useSelector(filterSelector);
  const mythosModeSelector = useCallback((state: AppState) => getMythosMode(state, filterId), [filterId]);
  const mythosMode = useSelector(mythosModeSelector);
  const selectedSortSelector = useCallback(
    (state: AppState) => getCardSort(state, screenType, mythosMode),
    [screenType, mythosMode]);
  const selectedSorts = useSelector(selectedSortSelector);
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
      )
    );
    return function cleanup() {
      if (!deckId) {
        dispatch(removeFilterSet(filterId));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [, showFilters] = useFilterButton({ componentId, filterId, baseQuery, modal: false });

  const [dialog, showSortDialog] = useFilterSortDialog(filterId, screenType);
  useNavigationButtonPressed((event) => {
    if (event.buttonId === 'sort') {
      showSortDialog();
    } else if (event.buttonId === 'filter') {
      showFilters();
    }
  }, componentId, [showSortDialog, showFilters]);

  const onClearSearchFilters = useCallback(() => {
    dispatch(clearFilters(filterId));
  }, [dispatch, filterId]);

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
  }, [hideSplash, filters, fontScale, width, deckId, hideVersatile, setHideVersatile, setHideSplash, componentId, typography, onFilterChange, onToggleChange]);
  return (
    <>
      <CardSearchResultsComponent
        componentId={componentId}
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
