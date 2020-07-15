import React, { ReactNode } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { t } from 'ttag';

import AccordionItem from './AccordionItem';
import space from '@styles/space';

interface Props {
  label: string;
  width: number;
  fontScale: number;
  height?: number;
  max: number;
  values: number[];
  enabled: boolean;
  setting: string;
  onFilterChange: (setting: string, values: number[]) => void;
  toggleName: string;
  onToggleChange: (setting: string, value: boolean) => void;
  children?: ReactNode;
}

export default class SliderChooser extends React.Component<Props> {
  _onChange = (values: number[]) => {
    const {
      onFilterChange,
      setting,
    } = this.props;
    onFilterChange(setting, values);
  };

  label() {
    const {
      label,
      values,
      enabled,
    } = this.props;
    if (!enabled) {
      return t`${label}: All`;
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
      height,
      fontScale,
    } = this.props;

    return (
      <AccordionItem
        label={this.label()}
        height={40 + (children && height ? (height * 48) : 10)}
        fontScale={fontScale}
        enabled={enabled}
        toggleName={toggleName}
        onToggleChange={onToggleChange}
      >
        { !!enabled && (
          <MultiSlider
            values={values}
            labels={values}
            containerStyle={space.marginSideL}
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
