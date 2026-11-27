import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { filter, forEach, map } from 'lodash';
import { t } from 'ttag';

import CheckListItemComponent from './CheckListComponent/CheckListItemComponent';
import InputWrapper from './InputWrapper';
import ScenarioGuideContext from '../ScenarioGuideContext';
import { StepPaddingContext } from '@components/campaignguide/StepPaddingContext';
import { StringChoices } from '@actions/types';
import { BulletType } from '@data/scenario/types';
import { Choices, DisplayChoiceWithId } from '@data/scenario';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import StyleContext from '@styles/StyleContext';
import space, { m, s } from '@styles/space';

interface Props {
  id: string;
  investigators: CampaignInvestigator[];
  options: Choices;
  // Choice ids each investigator must take; shown checked and locked.
  required?: StringChoices;
  text?: string;
  confirmText?: string;
  bulletType?: BulletType;
}

function investigatorChoices(options: Choices, code: string): DisplayChoiceWithId[] {
  return options.type === 'universal' ?
    options.choices :
    map(options.perCode[code] || [], idx => options.choices[idx]);
}

/**
 * Lets each investigator check any number of choices, shown as one checklist per investigator.
 * Saved as { [investigatorCode]: [choiceId, ...] }, which is the shape
 * ScenarioStep.processListChoices already understands.
 */
export default function InvestigatorMultiChoicePrompt({ id, investigators, options, required, text, confirmText, bulletType }: Props) {
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { colors, typography, width } = useContext(StyleContext);
  const { side } = useContext(StepPaddingContext);
  const [selected, setSelected] = useState<StringChoices>(() => {
    const initial: StringChoices = {};
    forEach(investigators, investigator => {
      initial[investigator.code] = [...(required?.[investigator.code] || [])];
    });
    return initial;
  });

  const choiceList = scenarioState.stringChoices(id);
  const hasDecision = choiceList !== undefined;

  const onToggle = useCallback((investigatorCode: string, choiceId: string, value: boolean) => {
    setSelected(current => {
      const others = filter(current[investigatorCode] || [], c => c !== choiceId);
      return {
        ...current,
        [investigatorCode]: value ? [...others, choiceId] : others,
      };
    });
  }, []);

  const save = useCallback(() => {
    const result: StringChoices = {};
    forEach(investigators, investigator => {
      const checked = selected[investigator.code] || [];
      // Keep the choices in their listed order, regardless of the order they were checked in.
      const ordered = map(
        filter(investigatorChoices(options, investigator.code), choice => checked.indexOf(choice.id) !== -1),
        choice => choice.id
      );
      if (ordered.length) {
        result[investigator.code] = ordered;
      }
    });
    scenarioState.setStringChoices(id, result);
  }, [investigators, selected, options, scenarioState, id]);

  return (
    <InputWrapper
      title={(hasDecision && confirmText) || text}
      editable={!hasDecision}
      onSubmit={save}
      bulletType={bulletType}
    >
      { map(investigators, investigator => {
        const choices = investigatorChoices(options, investigator.code);
        if (!choices.length) {
          return null;
        }
        const checked = (hasDecision ? choiceList[investigator.code] : selected[investigator.code]) || [];
        const locked = required?.[investigator.code] || [];
        return (
          <View style={space.paddingBottomXs} key={investigator.code}>
            <RoundedFactionBlock
              faction={investigator.card.factionCode()}
              header={
                <CompactInvestigatorRow
                  investigator={investigator.card}
                  width={width - s * (hasDecision ? 2 : 4) - side * 2}
                  open
                />
              }
              noSpace
              noShadow
            >
              <View style={[styles.choices, { backgroundColor: colors.L20 }]}>
                { map(choices, (choice, idx) => (
                  <CheckListItemComponent
                    key={choice.id}
                    code={choice.id}
                    name={choice.text ?? ''}
                    description={choice.description}
                    selected={checked.indexOf(choice.id) !== -1}
                    onChoiceToggle={(choiceId, value) => onToggle(investigator.code, choiceId, value)}
                    editable={!hasDecision && locked.indexOf(choice.id) === -1}
                    last={hasDecision || idx === choices.length - 1}
                  />
                )) }
                { hasDecision && !checked.length && (
                  <Text style={[typography.mediumGameFont, styles.noneText]}>
                    { t`None` }
                  </Text>
                ) }
              </View>
            </RoundedFactionBlock>
          </View>
        );
      }) }
    </InputWrapper>
  );
}

const styles = StyleSheet.create({
  choices: {
    paddingLeft: m,
    paddingRight: m,
    paddingBottom: s,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  noneText: {
    fontWeight: '600',
    paddingTop: s,
  },
});
