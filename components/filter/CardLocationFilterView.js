import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
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
      </ScrollView>
    );
  }
}

export default withFilterFunctions(CardLocationFilterView);
