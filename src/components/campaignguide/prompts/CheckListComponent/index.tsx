import React, { useCallback, useContext, useMemo } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { forEach, keyBy, keys, map, mapValues, sum } from 'lodash';
import { t } from 'ttag';

import CheckListItemComponent from './CheckListItemComponent';
import ScenarioGuideContext from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { StringChoices } from '@actions/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { m, s } from '@styles/space';
import { Toggles, useEffectUpdate, useToggles } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import Card from '@data/types/Card';
import InputWrapper from '../InputWrapper';

export interface ListItem {
  code: string;
  name: string;
  description?: string;
  color?: string;
  investigator?: Card;
  investigatorButton?: React.ReactNode;
}

export interface CheckListComponentProps {
  id: string;
  choiceId: string;
  defaultState?: boolean;
  bulletType?: BulletType;
  text?: string;
  checkText: string;
  confirmText?: string;
  fixedMin?: boolean;
  min?: number;
  max?: number;
  button?: React.ReactNode;
  loading?: boolean;
  extraSelected?: string[];

  titleNode?: React.ReactNode;
  extraSave?: () => void;
  onSecondaryChoice?: (code: string) => void;
  syncSelection?: (selection: Toggles) => void;
}

interface Props extends CheckListComponentProps {
  items: ListItem[];
}

export default function CheckListComponent({ extraSave, id, choiceId, defaultState, bulletType, text, checkText, confirmText, fixedMin, min, max, button, loading, items, extraSelected, titleNode, onSecondaryChoice, syncSelection }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const [selectedChoice, , onChoiceToggle, ,removeToggle] = useToggles(
    mapValues(keyBy(items, i => i.code), () => defaultState ? true : false),
    syncSelection
  );

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
    extraSave?.();
  }, [selectedChoice, id, choiceId, scenarioState, extraSave]);
  const choiceList = scenarioState.stringChoices(id);
  const hasDecision = choiceList !== undefined;

  const disabledText = useMemo(() => {
    if (hasDecision) {
      return undefined;
    }
    const effectiveMin = (!fixedMin && min) ? Math.min(min, items.length) : min;
    if (effectiveMin === undefined && max === undefined) {
      return undefined;
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
    if (!enabled) {
      return hasMin ? t`Too many` : t`Not enough`;
    }
    return undefined;
  }, [hasDecision, items, max, fixedMin, selectedChoice, min]);

  return (
    <>
      { !!text && (
        <SetupStepWrapper bulletType={bulletType}>
          <CampaignGuideTextComponent text={text} />
        </SetupStepWrapper>
      ) }
      <InputWrapper
        title={(hasDecision && confirmText) || checkText}
        titleNode={!hasDecision && titleNode}
        editable={!hasDecision}
        disabledText={disabledText}
        buttons={!hasDecision && !!button ? button : undefined}
        onSubmit={save}
      >
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
              onSecondaryChoice={onSecondaryChoice}
              editable={!hasDecision}
              last={choiceList !== undefined || idx === items.length - 1}
            />
          );
        }) }
        { ((items.length === 0 && !loading) || (choiceList !== undefined && keys(choiceList).length === 0)) && (
          <View style={styles.row}>
            <Text style={[typography.mediumGameFont, styles.nameText]}>
              { t`None` }
            </Text>
          </View>
        ) }
      </InputWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
