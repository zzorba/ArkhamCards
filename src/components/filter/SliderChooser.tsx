import React, { ReactNode, useCallback, useMemo, useContext, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import AccordionItem from './AccordionItem';
import LanguageContext from '@lib/i18n/LanguageContext';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { Counters, useCounters, useEffectUpdate } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  label: string;
  width: number;
  height?: number;
  max: number;
  values: [number, number];
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
  const { colors, typography } = useContext(StyleContext);
  const { colon } = useContext(LanguageContext);
  const onChange = useCallback((values: number[]) => {
    onFilterChange(setting, values);
  }, [onFilterChange, setting]);

  const shouldSync = useRef(true);

  const [liveValues, inc, dec, _, sync] = useCounters(
    { min: values[0], max: values[1] },
    {
      checkConstraints: (change: String, counters: Counters) => {
        shouldSync.current = false;
        if ((counters.min || 0) <= (counters.max || 0)) {
          return counters;
        }

        if (change == 'min') {
          return {
            ...counters,
            max: counters.min,
          };
        }
        return {
          ...counters,
          min: counters.max,
        };
      },
      onChange: (newValues: Counters) => {
        shouldSync.current = false;
        setTimeout(() => onChange([newValues.min || 0, newValues.max || 0]), 0);
      },
    });

  useEffectUpdate(() => {
    if (shouldSync.current) {
      sync({ min: values[0], max: values[1] });
    }
    shouldSync.current = true;
  }, [values[0], values[1]]);

  const formattedLabel = useMemo(() => {
    if (!enabled) {
      return t`${label}: All`;
    }
    const rangeText = values[0] === values[1] ? values[0] : `${values[0]} - ${values[1]}`;
    return `${label}${colon}${rangeText}`;
  }, [label, values, colon, enabled]);

  const decMin = useCallback(() => dec('min', 0), [dec]);
  const incMin = useCallback(() => inc('min', max), [inc, max]);

  const decMax = useCallback(() => dec('max', 0), [dec]);
  const incMax = useCallback(() => inc('max', max), [inc, max]);

  return (
    <AccordionItem
      label={formattedLabel}
      height={40 + (children && height ? (height * 48) : 10)}
      enabled={enabled}
      toggleName={toggleName}
      onToggleChange={onToggleChange}
    >
      { !!enabled && (
        <View style={[styles.row, { width }, space.paddingSideS, space.paddingVerticalS]}>
          <View style={[styles.counter, { borderColor: colors.L10 }, space.paddingS]}>
            <Text style={[typography.counter, space.marginSideS]}>{t`Min`}</Text>
            <PlusMinusButtons
              min={0}
              max={max}
              onIncrement={incMin}
              onDecrement={decMin}
              dialogStyle
              showZeroCount
              count={liveValues['min'] || 0}
            >
              <Text style={[{ minWidth: 28 }, typography.counter, typography.dark, typography.center]}>{liveValues['min'] || 0}</Text>
            </PlusMinusButtons>
          </View>
          <View style={[styles.counter, { borderColor: colors.L10 }, space.paddingS]}>
          <Text style={[typography.counter, space.marginSideS]}>{t`Max`}</Text>
            <PlusMinusButtons
              min={0}
              max={max}
              onIncrement={incMax}
              onDecrement={decMax}
              dialogStyle

              showZeroCount
              count={liveValues['max'] || 0}
              >
              <Text style={[{ minWidth: 28 }, typography.counter, typography.dark, typography.center]}>{liveValues['max'] || 0}</Text>
            </PlusMinusButtons>
          </View>
        </View>
      ) }
      { enabled && children }
    </AccordionItem>
  );
}


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});