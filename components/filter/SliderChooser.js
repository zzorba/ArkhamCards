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
    enabled: PropTypes.bool.isRequired,
    setting: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    toggleName: PropTypes.string.isRequired,
    onToggleChange: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this._onChange = this.onChange.bind(this);
  }

  onChange(values) {
    const {
      onFilterChange,
      setting,
    } = this.props;
    onFilterChange(setting, values);
  }

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
      enabled,
      onToggleChange,
      toggleName,
      children,
    } = this.props;

    return (
      <AccordionItem
        label={this.label()}
        height={80 + (children ? 50 : 0)}
        enabled={enabled}
        toggleName={toggleName}
        onToggleChange={onToggleChange}
      >
        { enabled && (
          <MultiSlider
            values={values}
            labels={values}
            containerStyle={styles.slider}
            min={0}
            max={max}
            onValuesChange={this._onChange}
            sliderLength={width - 64}
            snapped
            allowOverlap
          />
        ) }
        { enabled && children }
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
