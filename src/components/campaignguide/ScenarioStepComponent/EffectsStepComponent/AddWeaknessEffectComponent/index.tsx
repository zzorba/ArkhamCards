import React, { useCallback, useContext, useMemo } from 'react';
import { map, sortBy } from 'lodash';
import { t } from 'ttag';

import Card from '@data/Card';
import { BASIC_WEAKNESS_QUERY, combineQueries } from '@data/query';
import SelectWeaknessTraitsComponent from './SelectWeaknessTraitsComponent';
import DrawRandomWeaknessComponent from './DrawRandomWeaknessComponent';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import InvestigatorSelectorWrapper from '@components/campaignguide/InvestigatorSelectorWrapper';
import BinaryPrompt from '@components/campaignguide/prompts/BinaryPrompt';
import { AddWeaknessEffect } from '@data/scenario/types';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import FilterBuilder from '@lib/filters';
import { usePlayerCards, useWeaknessCards } from '@components/core/hooks';

interface Props {
  id: string;
  effect: AddWeaknessEffect;
  input?: string[];
}

const FILTER_BUILDER = new FilterBuilder('weakness');

export default function AddWeaknessEffectComponent({ id, effect, input }: Props) {
  const { scenarioState, campaignLog } = useContext(ScenarioStepContext);
  const firstDecisionId = `${id}_use_app`;
  const traitsDecisionId = `${id}_traits`;
  const weaknessCards = useWeaknessCards();
  const cards = usePlayerCards();

  const firstPrompt = useMemo(() => {
    return (
      <BinaryPrompt
        id={firstDecisionId}
        bulletType="small"
        text={t`Do you want to use the app to randomize weaknesses?`}
      />
    );
  }, [firstDecisionId]);

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
      FILTER_BUILDER.traitFilter(effect.weakness_traits),
      'and'
    );
  }, [effect.weakness_traits]);

  const renderSecondPrompt = useCallback((
    investigators: Card[],
    scenarioState: ScenarioStateHelper
  ) => {
    const useAppDecision = scenarioState.decision(firstDecisionId);
    if (useAppDecision === undefined || !weaknessCards || !cards) {
      return null;
    }
    if (!useAppDecision) {
      return (
        <CardQueryWrapper name="add-weakness" query={query}>
          { (cards: Card[]) => renderCardChoice(cards, investigators) }
        </CardQueryWrapper>
      );
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
            save={saveTraits}
          />
        ) }
        { (!effect.select_traits || chosenTraits !== undefined) && (
          <DrawRandomWeaknessComponent
            id={id}
            traits={chosenTraits || effect.weakness_traits}
            realTraits={!chosenTraits}
            investigators={investigators}
            campaignLog={campaignLog}
            scenarioState={scenarioState}
            weaknessCards={weaknessCards}
            cards={cards}
          />
        ) }
      </>
    );
  }, [saveTraits, id, traitsDecisionId, effect, weaknessCards, cards, campaignLog, scenarioState, query]);

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

