import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { filter, find, flatMap, keys, map, partition, uniq, uniqBy } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { CardSelectorProps } from '../CardSelectorView';
import CampaignGuideContext from '../CampaignGuideContext';
import ScenarioStepContext from '../ScenarioStepContext';
import { CardChoiceInput, CardSearchQuery, CardQuery } from '@data/scenario/types';
import { LatestDecks, ProcessedScenario } from '@data/scenario';
import { PLAYER_CARDS_QUERY, combineQueries, combineQueriesOpt, where } from '@data/sqlite/query';
import FilterBuilder, { UNIQUE_FILTER, VENGEANCE_FILTER } from '@lib/filters';
import Card from '@data/types/Card';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { calculateCardChoiceResult } from '@data/scenario/inputHelper';
import ScenarioGuideContext from '../ScenarioGuideContext';

interface Props {
  componentId: string;
  id: string;
  text?: string;
  input: CardChoiceInput;
}

const FILTER_BUILDER = new FilterBuilder('ccp');

function basicQuery(q: CardSearchQuery): Brackets[] {
  const result: Brackets[] = [
    ...(q.trait ? FILTER_BUILDER.traitFilter([q.trait], false) : []),
  ];
  if (q.unique) {
    result.push(UNIQUE_FILTER);
  }
  if (q.vengeance) {
    result.push(VENGEANCE_FILTER);
  }
  if (q.exclude_code) {
    const codeParts = map(q.exclude_code, code => `(c.code != '${code}')`).join(' AND ');
    result.push(where(codeParts));
  }
  return result;
}

function mainQuery(
  query: CardQuery[],
  processedScenario: ProcessedScenario,
  investigators: Card[],
  latestDecks: LatestDecks,
): Brackets | undefined {
  const queries = flatMap(query, q => {
    if (q.code) {
      return FILTER_BUILDER.equalsVectorClause(q.code, 'code', ['code']);
    }
    switch (q.source) {
      case 'scenario': {
        const encounterSets = flatMap(
          processedScenario.steps,
          step => {
            if (step.step.type === 'encounter_sets') {
              return step.step.encounter_sets;
            }
            return [];
          });
        if (!encounterSets) {
          return [];
        }
        return combineQueriesOpt([
          ...FILTER_BUILDER.equalsVectorClause(encounterSets, 'encounter_code'),
          ...basicQuery(q),
        ], 'and') || [];
      }
      case 'deck': {
        const deckCodes: string[] = uniq(
          flatMap(investigators, investigator => {
            const deck = latestDecks[investigator.code];
            if (!deck) {
              // Do something else in this case?
              return [];
            }
            return keys(deck.slots);
          })
        );
        if (!deckCodes.length) {
          return [];
        }
        return combineQueriesOpt([
          ...FILTER_BUILDER.equalsVectorClause(deckCodes, 'code', ['deck']),
          ...basicQuery(q),
        ], 'and') || [];
      }
    }
  });
  return combineQueriesOpt(
    queries,
    'or'
  );
}

export default function CardChoicePrompt({ componentId, id, text, input }: Props) {
  const [extraCards, setExtraCards] = useState<string[]>([]);
  const { latestDecks } = useContext(CampaignGuideContext);
  const { scenarioState, processedScenario } = useContext(ScenarioGuideContext);
  const { scenarioInvestigators, campaignLog } = useContext(ScenarioStepContext);
  const nonDeckButton = useMemo(() => {
    return !!find(
      input.query,
      query => query.source === 'deck'
    ) && !!find(
      scenarioInvestigators,
      investigator => !latestDecks[investigator.code]
    );
  }, [input, scenarioInvestigators, latestDecks]);

  const selectedCards = useMemo((): undefined | string[] => {
    if (input.include_counts) {
      const choices = scenarioState.numberChoices(id);
      return choices && keys(choices);
    }
    const choices = scenarioState.stringChoices(id);
    return choices && keys(choices);
  }, [scenarioState, id, input]);

  const showOtherCardSelector = useCallback(() => {
    const query = flatMap(input.query, query => {
      if (query.source === 'deck') {
        return basicQuery(query);
      }
      return [];
    });

    Navigation.push<CardSelectorProps>(componentId, {
      component: {
        name: 'Guide.CardSelector',
        passProps: {
          query: combineQueries(
            PLAYER_CARDS_QUERY,
            query,
            'and'
          ),
          selection: extraCards,
          onSelect: setExtraCards,
          includeStoryToggle: true,
          uniqueName: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Select Cards`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [extraCards, setExtraCards, componentId, input]);

  const query = useMemo(() => {
    if (selectedCards === undefined) {
      // No choice yet, so pull up everything possible.
      const queryOpt = mainQuery(input.query, processedScenario, scenarioInvestigators, latestDecks);
      return combineQueriesOpt(
        [
          ...(queryOpt ? [queryOpt] : []),
          ...FILTER_BUILDER.equalsVectorClause(extraCards, 'code', ['extra']),
        ],
        'or'
      );
    }
    // They've already decided, so only fetch what they already chose.
    return where('c.code in (:...codes)', { codes: selectedCards });
  }, [processedScenario, scenarioInvestigators, latestDecks, input.query, extraCards, selectedCards]);

  const [rawCards, loading] = useCardsFromQuery({ query });
  const cards = useMemo(() => {
    const extraSet = new Set(extraCards);
    const [extra, normal] = partition(uniqBy(rawCards, card => card.code), card => extraSet.has(card.code));
    return [...normal, ...extra];
  }, [rawCards, extraCards]);
  const filteredCards = useMemo(() => {
    if (!input.campaign_log_condition) {
      return cards;
    }
    const condition = input.campaign_log_condition;
    return filter(cards, card => calculateCardChoiceResult(condition, campaignLog, card.code));
  }, [cards, campaignLog, input.campaign_log_condition]);
  if (input.include_counts) {
    return (
      <>
        <SetupStepWrapper>
          { !!text && <CampaignGuideTextComponent text={text} /> }
        </SetupStepWrapper>
        <CounterListComponent
          id={id}
          countText={input.choices[0].text}
          loading={loading}
          items={map(filteredCards, card => {
            return {
              code: card.code,
              name: card.name,
              limit: card.quantity || 1,
            };
          })}
        />
      </>
    );
  }
  if (input.choices.length > 1) {
    return (
      <>
        <ChoiceListComponent
          id={id}
          text={text}
          items={map(filteredCards, card => {
            return {
              code: card.code,
              name: card.name,
              masculine: card.grammarGenderMasculine(),
            };
          })}
          loading={loading}
          options={{
            type: 'universal',
            choices: input.choices,
          }}
        />
      </>
    );
  }

  const choice = input.choices[0];
  return (
    <CheckListComponent
      id={id}
      choiceId={choice.id}
      text={text}
      items={map(filteredCards, card => {
        return {
          code: card.code,
          name: card.name,
        };
      })}
      min={input.min}
      max={input.max}
      extraSelected={extraCards}
      checkText={choice.text}
      loading={loading}
      button={(nonDeckButton && selectedCards === undefined) ? (
        <BasicButton
          title={t`Choose additional card`}
          onPress={showOtherCardSelector}
        />
      ) : undefined}
    />
  );
}

