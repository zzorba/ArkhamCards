import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { t } from 'ttag';
import ToggleFilter from 'components/core/ToggleFilter';
import SliderChooser from './SliderChooser';
import withFilterFunctions, { FilterProps } from './withFilterFunctions';

class CardLocationFilterView extends React.Component<FilterProps> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Location Filters`,
        },
      },
    };
  }

  render() {
    const {
      defaultFilterState,
      filters: {
        shroud,
        shroudEnabled,
        clues,
        cluesEnabled,
        cluesFixed,
        hauntedEnabled,
      },
      width,
      fontScale,
      onToggleChange,
      onFilterChange,
    } = this.props;
    return (
      <ScrollView>
        <SliderChooser
          label={t`Shroud`}
          width={width}
          fontScale={fontScale}
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
          fontScale={fontScale}
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
  }
}

export default withFilterFunctions(
  CardLocationFilterView,
  t`Location Filters`,
  [
    'shroud',
    'shroudEnabled',
    'clues',
    'cluesEnabled',
    'cluesFixed',
    'hauntedEnabled',
  ]
);

const styles = StyleSheet.create({
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
