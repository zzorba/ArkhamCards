import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
} from 'react-native';

import SliderChooser from './SliderChooser';
import ToggleFilter from './ToggleFilter';
import withFilterFunctions from './withFilterFunctions';

class CardLocationFilterView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    filters: PropTypes.object,
    width: PropTypes.number,
    onToggleChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    props.navigator.setTitle({
      title: 'Location Filters',
    });
  }

  render() {
    const {
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
          label="Shroud"
          width={width}
          max={6}
          values={shroud}
          setting="shroud"
          onFilterChange={onFilterChange}
          enabled={shroudEnabled}
          toggleName="shroudEnabled"
          onToggleChange={onToggleChange}
        />
        <SliderChooser
          label="Clues"
          width={width}
          max={6}
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
              label="Per Investigator"
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
