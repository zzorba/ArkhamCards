import React, { useContext, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { t } from 'ttag';

import ToggleFilter from '@components/core/ToggleFilter';
import SliderChooser from './SliderChooser';
import { xs } from '@styles/space';
import useFilterFunctions, { FilterFunctionProps } from './useFilterFunctions';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';
import TwoColumnSort, { ToggleItem } from './TwoColumnSort';
import LanguageContext from '@lib/i18n/LanguageContext';

const CardLocationFilterView = (props: FilterFunctionProps & NavigationProps) => {
  const {
    defaultFilterState,
    filters,
    onToggleChange,
    onFilterChange,
  } = useFilterFunctions(props, {
    title: t`Location Filters`,
    clearTraits: [
      'shroud',
      'shroudEnabled',
      'clues',
      'cluesEnabled',
      'cluesFixed',
      'hauntedEnabled',
      'locationVictoryEnabled',
      'locationVengeanceEnabled',
    ],
  });
  const {
    shroud,
    shroudEnabled,
    clues,
    cluesEnabled,
    cluesFixed,
    hauntedEnabled,
    locationVictoryEnabled,
    locationVengeanceEnabled,
  } = filters;
  const { backgroundStyle, width } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const toggleItems: ToggleItem[] = useMemo(() => {
    return [
      { label: t`Haunted`, setting: 'hauntedEnabled' },
      { label: t`Victory`, setting: 'locationVictoryEnabled' },
      { label: t`Vengeance`, setting: 'locationVengeanceEnabled' },
    ];
  }, [lang]);
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <SliderChooser
        label={t`Shroud`}
        width={width}
        max={defaultFilterState.shroud[1]}
        values={shroud}
        setting="shroud"
        onFilterChange={onFilterChange}
        enabled={shroudEnabled}
        toggleName="shroudEnabled"
        onToggleChange={onToggleChange}
      />
      <SliderChooser
        label={t`Clues`}
        width={width}
        max={defaultFilterState.clues[1]}
        values={clues}
        setting="clues"
        onFilterChange={onFilterChange}
        enabled={cluesEnabled}
        toggleName="cluesEnabled"
        onToggleChange={onToggleChange}
        height={1}
      >
        <View>
          <ToggleFilter
            label={t`Per Investigator`}
            setting="cluesFixed"
            value={!cluesFixed}
            onChange={onToggleChange}
          />
        </View>
      </SliderChooser>
      <TwoColumnSort
        noBorder
        onToggleChange={onToggleChange}
        filters={filters}
        items={toggleItems}
      />
    </ScrollView>
  );
};

CardLocationFilterView.options = () => {
  return {
    topBar: {
      title: {
        text: t`Location Filters`,
      },
    },
  };
};
export default CardLocationFilterView;

const styles = StyleSheet.create({
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  toggleRow: {
    marginTop: xs,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
