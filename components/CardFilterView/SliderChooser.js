import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import AccordionItem from './AccordionItem';

export default class SliderChooser extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    toggleEnabled: PropTypes.func.isRequired,
  };

  label() {
    const {
      label,
      values,
      enabled,
    } = this.props;
    if (!enabled) {
      return `${label}: All`;
    }
    const rangeText = values[0] === values[1] ? values[0] : `${values[0]} - ${values[1]}`;
    return `${label}: ${rangeText}`;
  }

  render() {
    const {
      width,
      max,
      values,
      onChange,
      enabled,
      toggleEnabled,
    } = this.props;

    return (
      <AccordionItem
        label={this.label()}
        height={80}
        enabled={enabled}
        toggleEnabled={toggleEnabled}
      >
        { enabled && (
          <MultiSlider
            values={values}
            labels={values}
            containerStyle={styles.slider}
            min={0}
            max={max}
            onValuesChange={onChange}
            sliderLength={width - 64}
            snapped
            allowOverlap
          />
        ) }
      </AccordionItem>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    marginLeft: 32,
    marginRight: 32,
  },
});
