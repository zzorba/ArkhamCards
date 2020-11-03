import React, { useCallback, useContext, useMemo } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { forEach, keyBy, keys, map, mapValues, sum } from 'lodash';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CheckListItemComponent from './CheckListItemComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { m, s } from '@styles/space';
import { useEffectUpdate, useToggles } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';

export interface ListItem {
  code: string;
  name: string;
  color?: string;
}

export interface CheckListComponentProps {
  id: string;
  choiceId: string;
  defaultState?: boolean;
  bulletType?: BulletType;
  text?: string;
  checkText: string;
  fixedMin?: boolean;
  min?: number;
  max?: number;
  button?: React.ReactNode;
  loading?: boolean;
  extraSelected?: string[];
}

interface Props extends CheckListComponentProps {
  items: ListItem[];
}

export default function CheckListComponent({ id, choiceId, defaultState, bulletType, text, checkText, fixedMin, min, max, button, loading, items, extraSelected }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const [selectedChoice, , onChoiceToggle, ,removeToggle] = useToggles(mapValues(keyBy(items, i => i.code), () => defaultState ? true : false));

  useEffectUpdate(() => {
    const extraSelectedSet = new Set(extraSelected || []);
    const knownItems = new Set(map(items, item => item.code));
    forEach(items, item => {
      if (selectedChoice[item.code] === undefined) {
        onChoiceToggle(item.code, defaultState || extraSelectedSet.has(item.code));
      }
    });
    forEach(selectedChoice, (value, code) => {
      if (value !== undefined && !knownItems.has(code)) {
        removeToggle(code);
      }
    });
  }, [items]);
  const save = useCallback(() => {
    const choices: StringChoices = {};
    forEach(selectedChoice, (checked, code) => {
      if (checked) {
        choices[code] = [choiceId];
      }
    });
    scenarioState.setStringChoices(id, choices);
  }, [selectedChoice, id, choiceId, scenarioState]);
  const choiceList = scenarioState.stringChoices(id);
  const hasDecision = choiceList !== undefined;

  const saveButton = useMemo(() => {
    if (hasDecision) {
      return null;
    }
    const effectiveMin = (!fixedMin && min) ? Math.min(min, items.length) : min;
    if (effectiveMin === undefined && max === undefined) {
      return (
        <BasicButton
          title={t`Proceed`}
          onPress={save}
        />
      );
    }
    const currentTotal = sum(
      map(
        selectedChoice,
        choice => choice ? 1 : 0
      )
    );
    const hasMin = (effectiveMin === undefined || currentTotal >= effectiveMin);
    const hasMax = (max === undefined || currentTotal <= max);
    const enabled = hasMin && hasMax;
    return !enabled ? (
      <BasicButton
        title={hasMin ? t`Too many` : t`Not enough`}
        onPress={save}
        disabled
      />
    ) : (
      <BasicButton
        title={t`Proceed`}
        onPress={save}
      />
    );
  }, [hasDecision, items, max, fixedMin, save, selectedChoice, min]);

  return (
    <>
      { !!text && (
        <SetupStepWrapper bulletType={bulletType}>
          <CampaignGuideTextComponent text={text} />
        </SetupStepWrapper>
      ) }
      <View style={[styles.prompt, borderStyle]}>
        <Text style={typography.mediumGameFont}>
          { checkText }
        </Text>
      </View>
      { loading ? (
        <View style={[styles.loadingRow, borderStyle]}>
          <ActivityIndicator size="small" animating color={colors.lightText} />
        </View>
      ) : map(items, (item, idx) => {
        const selected = choiceList !== undefined ? (
          choiceList[item.code] !== undefined
        ) : (
          !!selectedChoice[item.code]
        );
        return (
          <CheckListItemComponent
            key={idx}
            {...item}
            selected={selected}
            onChoiceToggle={onChoiceToggle}
            editable={!hasDecision}
          />
        );
      }) }
      { ((items.length === 0 && !loading) || (choiceList !== undefined && keys(choiceList).length === 0)) && (
        <View style={[styles.row, borderStyle]}>
          <Text style={[typography.mediumGameFont, styles.nameText]}>
            { t`None` }
          </Text>
        </View>
      ) }
      { !hasDecision && !!button && (
        <View style={[styles.bottomBorder, borderStyle]}>
          { button }
        </View>
      ) }
      { saveButton }
    </>
  );
}

const styles = StyleSheet.create({
  prompt: {
    flexDirection: 'row',
    paddingTop: m,
    paddingRight: m,
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameText: {
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
