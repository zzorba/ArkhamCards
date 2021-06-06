import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { BulletType } from '@data/scenario/types';
import space from '@styles/space';
import { useCounter } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import InputWrapper from './InputWrapper';

interface Props {
  id: string;
  bulletType?: BulletType;
  prompt: string;
  longLived?: boolean;
  delta?: boolean;
  confirmText?: string;
  min?: number;
  max?: number;
  text?: string;
}

export default function NumberPrompt({
  id,
  bulletType,
  prompt,
  longLived,
  delta,
  confirmText,
  min,
  max,
  text,
}: Props) {
  const { typography } = useContext(StyleContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const [value, incValue, decValue] = useCounter(min || 0, { min, max });
  const currentValue = useMemo(() => {

    if (longLived) {
      return scenarioState.count(`${id}#live`) || 0;
    }
    return value;
  }, [id, longLived, value, scenarioState]);

  const inc = useCallback(() => {
    if (longLived) {
      const value = scenarioState.count(`${id}#live`) || 0;
      const newValue = value + 1;
      scenarioState.setCount(`${id}#live`,
        max ? Math.min(newValue, max) : newValue
      );
    } else {
      incValue();
    }
  }, [id, longLived, max, scenarioState, incValue]);

  const dec = useCallback(() => {
    if (longLived) {
      const value = scenarioState.count(`${id}#live`) || 0;
      const newValue = value - 1;
      scenarioState.setCount(`${id}#live`,
        Math.max(newValue, min || 0)
      );
    } else {
      decValue();
    }
  }, [id, longLived, min, scenarioState, decValue]);

  const submit = useCallback(() => {
    scenarioState.setCount(id, currentValue);
  }, [id, currentValue, scenarioState]);

  const count = scenarioState.count(id);
  return (
    <View style={space.paddingTopS}>
      { !!text && (
        <SetupStepWrapper bulletType={bulletType}>
          <CampaignGuideTextComponent text={text} />
        </SetupStepWrapper>
      ) }
      { !!confirmText && (
        <SetupStepWrapper bulletType="small">
          <CampaignGuideTextComponent
            text={count === undefined ? t`${confirmText} <i>(included automatically)</i>` : confirmText}
          />
        </SetupStepWrapper>
      ) }
      <InputWrapper
        editable={count === undefined}
        onSubmit={submit}
      >
        <View style={[styles.promptRow, count === undefined ? undefined : space.paddingS]}>
          <View style={styles.text}>
            <Text style={[space.marginLeftS, typography.mediumGameFont]}>{prompt}</Text>
            { count !== undefined && (
              <View style={[space.paddingLeftS, space.paddingRightM]}>
                <Text style={[typography.mediumGameFont, typography.regular]}>
                  { delta && currentValue >= 0 ? '+ ' : '' }{ count }
                </Text>
              </View>
            ) }
          </View>
          { count === undefined && (
            <PlusMinusButtons
              count={value}
              dialogStyle
              rounded
              min={min}
              max={max}
              onIncrement={inc}
              onDecrement={dec}
              countRender={(
                <View style={[styles.count, space.paddingSideXs, delta ? styles.countDelta : {}]}>
                  <Text style={[typography.counter, typography.center, { minWidth: 28 }]}>
                    { delta && currentValue >= 0 ? '+ ' : '' }{ currentValue }
                  </Text>
                </View>
              )}
            />
          ) }
        </View>
      </InputWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    minWidth: 40,
  },
  countDelta: {
    minWidth: 50,
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
