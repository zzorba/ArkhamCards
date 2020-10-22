import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { t } from 'ttag';

import ToggleFilter from '@components/core/ToggleFilter';
import SliderChooser from './SliderChooser';
import { xs } from '@styles/space';
import useFilterFunctions, { FilterFunctionProps } from './useFilterFunctions';
import { NavigationProps } from '@components/nav/types';
import StyleContext from '@styles/StyleContext';

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
    ],
  });
  const { width } = useWindowDimensions();
  const {
    shroud,
    shroudEnabled,
    clues,
    cluesEnabled,
    cluesFixed,
    hauntedEnabled,
  } = filters;
  const { backgroundStyle } = useContext(StyleContext);
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
      <View style={styles.toggleRow}>
        <View style={styles.toggleColumn}>
          <ToggleFilter
            label={t`Haunted`}
            setting="hauntedEnabled"
            value={hauntedEnabled}
            onChange={onToggleChange}
          />
        </View>
      </View>
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
