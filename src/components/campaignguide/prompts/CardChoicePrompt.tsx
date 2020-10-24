import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, flatMap, keys, map, uniq, uniqBy } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import CardListWrapper from '@components/card/CardListWrapper';
import { CardSelectorProps } from '../CardSelectorView';
import CampaignGuideContext from '../CampaignGuideContext';
import ScenarioStepContext from '../ScenarioStepContext';
import { CardChoiceInput, CardSearchQuery, CardQuery } from '@data/scenario/types';
import { LatestDecks, ProcessedScenario } from '@data/scenario';
import { PLAYER_CARDS_QUERY, combineQueries, combineQueriesOpt, where } from '@data/query';
import FilterBuilder, { UNIQUE_FILTER, VENGEANCE_FILTER } from '@lib/filters';
import Card from '@data/Card';
import { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  id: string;
  text?: string;
  input: CardChoiceInput;
}

const FILTER_BUILDER = new FilterBuilder('ccp');

function basicQuery(q: CardSearchQuery): Brackets[] {
  const result: Brackets[] = [
    ...(q.trait ? FILTER_BUILDER.traitFilter([q.trait]) : []),
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
  const { colors, borderStyle } = useContext(StyleContext)
  const [extraCards, setExtraCards] = useState<string[]>([]);
  const { latestDecks } = useContext(CampaignGuideContext);
  const { scenarioState, processedScenario, scenarioInvestigators } = useContext(ScenarioStepContext);
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

  const renderCards = useCallback((
    rawCards: Card[],
    loading: boolean,
    includeNonDeckButton: boolean
  ): Element | null => {
    const cards = uniqBy(rawCards, card => card.code);
    if (loading) {
      return (
        <View style={[styles.loadingRow, borderStyle]}>
          <ActivityIndicator size="small" animating color={colors.lightText} />
        </View>
      );
    }
    if (input.include_counts) {
      return (
        <>
          <SetupStepWrapper>
            { !!text && <CampaignGuideTextComponent text={text} /> }
          </SetupStepWrapper>
          <CounterListComponent
            id={id}
            countText={input.choices[0].text}
            items={map(cards, card => {
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
            items={map(cards, card => {
              return {
                code: card.code,
                name: card.name,
              };
            })}
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
        items={map(cards, card => {
          return {
            code: card.code,
            name: card.name,
          };
        })}
        min={input.min}
        max={input.max}
        checkText={choice.text}
        button={includeNonDeckButton ? (
          <BasicButton
            title={t`Choose additional card`}
            onPress={showOtherCardSelector}
          />
        ) : undefined}
      />
    );
  }, [id, text, input, colors, borderStyle, showOtherCardSelector]);
  const query = useMemo(() => {
    const queryOpt = mainQuery(input.query, processedScenario, scenarioInvestigators, latestDecks);
    return combineQueriesOpt(
      [
        ...(queryOpt ? [queryOpt] : []),
        ...FILTER_BUILDER.equalsVectorClause(extraCards, 'code', ['extra']),
      ],
      'or'
    );
  }, [processedScenario, scenarioInvestigators, latestDecks, input.query, extraCards]);
  if (selectedCards === undefined) {
    return (
      <CardQueryWrapper name="card-choice" query={query} >
        { (cards: Card[], loading: boolean) => renderCards(cards, loading, nonDeckButton) }
      </CardQueryWrapper>
    );
  }
  return (
    <CardListWrapper
      codes={selectedCards}
      type="encounter"
    >
      { (cards: Card[], loading: boolean) => renderCards(cards, loading, false) }
    </CardListWrapper>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
