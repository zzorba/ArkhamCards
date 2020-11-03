import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { forEach, map, sum } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CounterListItemComponent from './CounterListItemComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import { NumberChoices } from '@actions/types';
import space, { m } from '@styles/space';
import { useCounters } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';

export interface CounterItem {
  code: string;
  name: string;
  description?: string;
  color?: string;
  limit?: number;
}

interface Props {
  id: string;
  items: CounterItem[];
  countText?: string;
  requiredTotal?: number;
  loading?: boolean;
}

export default function CounterListComponent({ id, items, countText, requiredTotal, loading }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { colors, borderStyle, typography } = useContext(StyleContext);
  const [counts, onInc, onDec] = useCounters({});

  const save = useCallback(() => {
    const choices: NumberChoices = {};
    forEach(counts, (value, code) => {
      if (value !== undefined) {
        choices[code] = [value];
      }
    });
    scenarioState.setNumberChoices(
      id,
      choices
    );
  }, [id, counts, scenarioState]);
  const choiceList = scenarioState.numberChoices(id);
  const hasDecision = choiceList !== undefined;

  const saveButton = useMemo(() => {
    if (hasDecision) {
      return null;
    }
    const currentTotal = sum(map(counts));
    const disabled = (requiredTotal !== undefined) && currentTotal !== requiredTotal;
    return disabled && requiredTotal !== undefined ? (
      <BasicButton
        title={currentTotal > requiredTotal ? t`Too many` : t`Not enough`}
        onPress={save}
        disabled
      />
    ) : (
      <BasicButton
        title={t`Proceed`}
        onPress={save}
        disabled={disabled}
      />
    );
  }, [hasDecision, requiredTotal, counts, save]);

  const getValue = useCallback((code: string): number => {
    if (choiceList === undefined) {
      return counts[code] || 0;
    }
    const investigatorCount = choiceList[code];
    if (!investigatorCount || !investigatorCount.length) {
      return 0;
    }
    return investigatorCount[0] || 0;
  }, [counts, choiceList]);

  return (
    <View>
      <View style={[
        styles.prompt,
        borderStyle,
        space.paddingTopS,
        space.paddingRightM,
      ]}>
        <Text style={typography.mediumGameFont}>
          { countText }
        </Text>
      </View>
      { loading ? (
        <View style={[styles.loadingRow, borderStyle]}>
          <ActivityIndicator size="small" animating color={colors.lightText} />
        </View>
      ) : map(items, ({ code, name, description, limit, color }, idx) => {
        const value = getValue(code);
        return (
          <CounterListItemComponent
            key={idx}
            value={value}
            code={code}
            name={name}
            description={description}
            onInc={onInc}
            onDec={onDec}
            limit={limit}
            editable={!hasDecision}
            color={color}
          />
        );
      }) }
      { saveButton }
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
