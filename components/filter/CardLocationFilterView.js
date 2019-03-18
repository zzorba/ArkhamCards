import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import L from '../../app/i18n';
import ToggleFilter from '../core/ToggleFilter';
import SliderChooser from './SliderChooser';
import withFilterFunctions from './withFilterFunctions';

class CardLocationFilterView extends React.Component {
  static propTypes = {
    filters: PropTypes.object,
    defaultFilterState: PropTypes.object,
    width: PropTypes.number,
    onToggleChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('Location Filters'),
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
      onToggleChange,
      onFilterChange,
    } = this.props;
    return (
      <ScrollView>
        <SliderChooser
          label={L('Shroud')}
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
          label={L('Clues')}
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
              label={L('Per Investigator')}
              setting="cluesFixed"
              value={!cluesFixed}
              onChange={onToggleChange}
            />
          </View>
        </SliderChooser>
        <View style={styles.toggleRow}>
          <View style={styles.toggleColumn}>
            <ToggleFilter
              label={L('Haunted')}
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
