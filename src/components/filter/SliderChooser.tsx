import React, { ReactNode, useCallback, useMemo } from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { t } from 'ttag';

import AccordionItem from './AccordionItem';
import space from '@styles/space';

interface Props {
  label: string;
  width: number;
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

export default function SliderChooser({
  label,
  width,
  height,
  max,
  values,
  enabled,
  setting,
  onFilterChange,
  toggleName,
  onToggleChange,
  children,
}: Props) {
  const onChange = useCallback((values: number[]) => {
    onFilterChange(setting, values);
  }, [onFilterChange, setting]);

  const formattedLabel = useMemo(() => {
    if (!enabled) {
      return t`${label}: All`;
    }
    const rangeText = values[0] === values[1] ? values[0] : `${values[0]} - ${values[1]}`;
    return `${label}: ${rangeText}`;
  }, [label, values, enabled]);

  return (
    <AccordionItem
      label={formattedLabel}
      height={40 + (children && height ? (height * 48) : 10)}
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
          onValuesChange={onChange}
          sliderLength={width - 64}
          snapped
          allowOverlap
        />
      ) }
      { enabled && children }
    </AccordionItem>
  );
}
