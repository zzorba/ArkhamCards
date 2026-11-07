import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import CheckListItemComponent from './CheckListComponent/CheckListItemComponent';
import InputWrapper from './InputWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import { StringChoices } from '@actions/types';
import { BulletType } from '@data/scenario/types';
import { DisplayChoiceWithId } from '@data/scenario';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { useToggles } from '@components/core/hooks';
import StyleContext from '@styles/StyleContext';
import { m, s } from '@styles/space';

interface Props {
  id: string;
  investigator: CampaignInvestigator;
  choices: DisplayChoiceWithId[];
  confirmText?: string;
  bulletType?: BulletType;
  min?: number;
  max?: number;
}

/**
 * Lets a single investigator select between min (default 0, i.e. nothing
 * required) and max (default unlimited) choices.
 * Saved as { [investigatorCode]: [choiceId, ...] }, which is the shape
 * ScenarioStep.processListChoices already understands.
 */
export default function InvestigatorMultiChoiceComponent({ id, investigator, choices, confirmText, bulletType, min, max }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { typography } = useContext(StyleContext);
  const [selectedChoice, , onChoiceToggle] = useToggles({});

  const choiceList = scenarioState.stringChoices(id);
  const hasDecision = choiceList !== undefined;
  const savedIds = useMemo(() => new Set(choiceList?.[investigator.code] ?? []), [choiceList, investigator.code]);

  const disabledText = useMemo(() => {
    if (hasDecision) {
      return undefined;
    }
    // min of 0 (or undefined) never requires a selection; never ask for more than exist.
    const effectiveMin = min === undefined ? 0 : Math.min(min, choices.length);
    const total = filter(choices, choice => !!selectedChoice[choice.id]).length;
    if (total < effectiveMin) {
      return t`Not enough`;
    }
    if (max !== undefined && total > max) {
      return t`Too many`;
    }
    return undefined;
  }, [hasDecision, min, max, choices, selectedChoice]);

  const save = useCallback(() => {
    const result: StringChoices = {};
    const checked = map(
      filter(choices, choice => !!selectedChoice[choice.id]),
      choice => choice.id
    );
    if (checked.length) {
      result[investigator.code] = checked;
    }
    scenarioState.setStringChoices(id, result);
  }, [choices, selectedChoice, investigator.code, scenarioState, id]);

  return (
    <InputWrapper
      title={(hasDecision && confirmText) || undefined}
      investigator={investigator.card}
      editable={!hasDecision}
      onSubmit={save}
      disabledText={disabledText}
      bulletType={bulletType}
    >
      { map(choices, (choice, idx) => (
        <CheckListItemComponent
          key={choice.id}
          code={choice.id}
          name={choice.text ?? ''}
          description={choice.description}
          selected={hasDecision ? savedIds.has(choice.id) : !!selectedChoice[choice.id]}
          onChoiceToggle={onChoiceToggle}
          editable={!hasDecision}
          last={hasDecision || idx === choices.length - 1}
        />
      )) }
      { hasDecision && savedIds.size === 0 && (
        <View style={styles.row}>
          <Text style={[typography.mediumGameFont, styles.nameText]}>
            { t`None` }
          </Text>
        </View>
      ) }
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: s,
    paddingLeft: m,
    paddingRight: m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: '600',
  },
});
