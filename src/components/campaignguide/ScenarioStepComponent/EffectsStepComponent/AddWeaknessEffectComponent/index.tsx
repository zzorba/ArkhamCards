import React, { useCallback, useContext, useMemo } from 'react';
import { map, sortBy } from 'lodash';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { BASIC_WEAKNESS_QUERY, combineQueries } from '@data/sqlite/query';
import SelectWeaknessTraitsComponent from './SelectWeaknessTraitsComponent';
import DrawRandomWeaknessComponent from './DrawRandomWeaknessComponent';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import InvestigatorSelectorWrapper from '@components/campaignguide/InvestigatorSelectorWrapper';
import BinaryPrompt from '@components/campaignguide/prompts/BinaryPrompt';
import { AddWeaknessEffect } from '@data/scenario/types';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import FilterBuilder from '@lib/filters';
import { usePlayerCards, useWeaknessCards } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  id: string;
  effect: AddWeaknessEffect;
  input?: string[];
  numberInput?: number[];
}

const FILTER_BUILDER = new FilterBuilder('weakness');

export default function AddWeaknessEffectComponent({ id, effect, input, numberInput }: Props) {
  const { useCardTraits } = useContext(LanguageContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const { campaignLog } = useContext(ScenarioStepContext);
  const firstDecisionId = `${id}_use_app`;
  const traitsDecisionId = `${id}_traits`;
  const weaknessCards = useWeaknessCards();
  const cards = usePlayerCards();

  const firstPrompt = useMemo(() => {
    if (effect.count === '$input_value' || effect.choose_only) {
      // When drawing multiple weaknesses at a time, don't prompt for the app.
      return null;
    }
    return (
      <BinaryPrompt
        id={firstDecisionId}
        bulletType="small"
        text={t`Do you want to use the app to randomize weaknesses?`}
      />
    );
  }, [effect.count, firstDecisionId, effect.choose_only]);

  const renderCardChoice = useCallback((cards: Card[], investigators: Card[]) => {
    return (
      <InvestigatorChoicePrompt
        bulletType="none"
        investigators={investigators}
        id={`${id}_weakness`}
        options={{
          type: 'universal',
          choices: map(
            sortBy(cards, card => card.name),
            card => {
              return {
                id: card.code,
                code: card.code,
                text: card.name,
              };
            }
          ),
        }}
      />
    );
  }, [id]);

  const saveTraits = useCallback((traits: string[]) => {
    scenarioState.setStringChoices(traitsDecisionId, { traits });
  }, [scenarioState, traitsDecisionId]);
  const query = useMemo(() => {
    return combineQueries(
      BASIC_WEAKNESS_QUERY,
      FILTER_BUILDER.traitFilter(effect.weakness_traits, false),
      'and'
    );
  }, [effect.weakness_traits]);

  const [possibleWeaknessCards, possibleWeaknessCardsLoading] = useCardsFromQuery({ query });
  const renderSecondPrompt = useCallback((
    investigators: Card[],
    scenarioState: ScenarioStateHelper
  ) => {
    if (!weaknessCards || !cards) {
      return null;
    }
    if (effect.count !== '$input_value') {
      const useAppDecision = effect.choose_only ? false : scenarioState.decision(firstDecisionId);
      if (useAppDecision === undefined) {
        return null;
      }
      if (!useAppDecision) {
        return possibleWeaknessCardsLoading ? null : renderCardChoice(possibleWeaknessCards, investigators);
      }
    }
    const traitsChoice = effect.select_traits ?
      scenarioState.stringChoices(traitsDecisionId) :
      undefined;
    const chosenTraits: string[] | undefined = traitsChoice && traitsChoice.traits;
    return (
      <>
        { !!effect.select_traits && (
          <SelectWeaknessTraitsComponent
            weaknessCards={weaknessCards}
            choices={chosenTraits}
            useCardTraits={useCardTraits}
            save={saveTraits}
          />
        ) }
        { (!effect.select_traits || chosenTraits !== undefined) && (
          <DrawRandomWeaknessComponent
            id={id}
            traits={chosenTraits || effect.weakness_traits}
            realTraits={!chosenTraits || !useCardTraits}
            investigators={investigators}
            campaignLog={campaignLog}
            scenarioState={scenarioState}
            weaknessCards={weaknessCards}
            cards={cards}
            count={effect.count === '$input_value' && numberInput ? numberInput[0] : 1}
            standalone={!!effect.standalone}
          />
        ) }
      </>
    );
  }, [saveTraits,
    id, numberInput, useCardTraits,
    firstDecisionId, renderCardChoice, traitsDecisionId, effect, weaknessCards, cards, campaignLog, possibleWeaknessCards, possibleWeaknessCardsLoading]);

  return (
    <>
      { firstPrompt }
      <InvestigatorSelectorWrapper
        id={id}
        investigator={effect.investigator}
        input={input}
        render={renderSecondPrompt}
        extraArg={scenarioState}
      />
    </>
  );
}

