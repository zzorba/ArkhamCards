import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, flatMap, keys, map, uniq } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import QueryProvider from '@components/data/QueryProvider';
import BasicButton from '@components/core/BasicButton';
import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import CardListWrapper from '@components/card/CardListWrapper';
import { CardSelectorProps } from '../CardSelectorView';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { CardChoiceInput, CardSearchQuery, CardQuery } from '@data/scenario/types';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { LatestDecks, ProcessedScenario } from '@data/scenario';
import { PLAYER_CARDS_QUERY, combineQueries, combineQueriesOpt, where } from '@data/query';
import FilterBuilder, { UNIQUE_FILTER, VENGEANCE_FILTER } from '@lib/filters';
import Card from '@data/Card';
import { m } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  componentId: string;
  id: string;
  text?: string;
  input: CardChoiceInput;
}

interface State {
  extraCards: string[];
}

interface QueryProps {
  processedScenario: ProcessedScenario;
  scenarioInvestigators: Card[];
  latestDecks: LatestDecks;
  query: CardQuery[];
  extraCards: string[];
}

export default class CardChoicePrompt extends React.Component<Props, State> {
  static FILTER_BUILDER = new FilterBuilder('ccp');
  state: State = {
    extraCards: [],
  };

  includeNonDeckSearch(
    investigators: Card[],
    latestDecks: LatestDecks
  ) {
    const { input } = this.props;
    return !!find(
      input.query,
      query => query.source === 'deck'
    ) && !!find(
      investigators,
      investigator => !latestDecks[investigator.code]
    );
  }

  lockedCards(
    scenarioState: ScenarioStateHelper
  ): undefined | string[] {
    const {
      id,
      input,
    } = this.props;
    if (input.include_counts) {
      const choices = scenarioState.numberChoices(id);
      return choices && keys(choices);
    }
    const choices = scenarioState.stringChoices(id);
    return choices && keys(choices);
  }

  _onSelect = (selection: string[]) => {
    this.setState({
      extraCards: selection,
    });
  };

  _showOtherCardSelector = () => {
    const { componentId, input } = this.props;
    const query = flatMap(input.query,
      query => {
        if (query.source === 'deck') {
          return CardChoicePrompt.basicQuery(query);
        }
        return [];
      }
    );

    Navigation.push<CardSelectorProps>(componentId, {
      component: {
        name: 'Guide.CardSelector',
        passProps: {
          query: combineQueries(
            PLAYER_CARDS_QUERY,
            query,
            'and'
          ),
          selection: this.state.extraCards,
          onSelect: this._onSelect,
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
  };

  _renderCards = (
    cards: Card[],
    loading: boolean,
    includeNonDeckButton: boolean
  ): Element | null => {
    const {
      id,
      text,
      input,
    } = this.props;
    if (loading) {
      return (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" animating color={COLORS.lightText} />
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
            onPress={this._showOtherCardSelector}
          />
        ) : undefined}
      />
    );
  };

  static basicQuery(
    q: CardSearchQuery
  ): Brackets[] {
    const result: Brackets[] = [
      ...(q.trait ? CardChoicePrompt.FILTER_BUILDER.traitFilter([q.trait]) : []),
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

  static mainQuery(
    query: CardQuery[],
    processedScenario: ProcessedScenario,
    investigators: Card[],
    latestDecks: LatestDecks,
  ): Brackets | undefined {
    const queries = flatMap(query, q => {
      if (q.code) {
        return CardChoicePrompt.FILTER_BUILDER.equalsVectorClause(q.code, 'code', ['code']);
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
            ...CardChoicePrompt.FILTER_BUILDER.equalsVectorClause(encounterSets, 'encounter_code'),
            ...CardChoicePrompt.basicQuery(q),
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
            ...CardChoicePrompt.FILTER_BUILDER.equalsVectorClause(deckCodes, 'code', ['deck']),
            ...this.basicQuery(q),
          ], 'and') || [];
        }
      }
    });
    return combineQueriesOpt(
      queries,
      'or'
    );
  }

  static query({
    processedScenario,
    scenarioInvestigators,
    latestDecks,
    query,
    extraCards,
  }: QueryProps) {
    const queryOpt = CardChoicePrompt.mainQuery(query, processedScenario, scenarioInvestigators, latestDecks);
    return combineQueriesOpt(
      [
        ...(queryOpt ? [queryOpt] : []),
        ...CardChoicePrompt.FILTER_BUILDER.equalsVectorClause(extraCards, 'code', ['extra']),
      ],
      'or'
    );
  }

  render() {
    const { input } = this.props;
    const { extraCards } = this.state;
    return (
      <CampaignGuideContext.Consumer>
        { ({ latestDecks }: CampaignGuideContextType) => (
          <ScenarioStepContext.Consumer>
            { ({ scenarioState, processedScenario, scenarioInvestigators }: ScenarioStepContextType) => {
              const selectedCards = this.lockedCards(scenarioState);
              if (selectedCards === undefined) {
                const nonDeckButton = this.includeNonDeckSearch(scenarioInvestigators, latestDecks);
                return (
                  <QueryProvider<QueryProps, Brackets | undefined>
                    processedScenario={processedScenario}
                    scenarioInvestigators={scenarioInvestigators}
                    latestDecks={latestDecks}
                    query={input.query}
                    extraCards={extraCards}
                    getQuery={CardChoicePrompt.query}
                  >
                    { query => (
                      <CardQueryWrapper name="card-choice" query={query} >
                        { (cards: Card[], loading: boolean) => this._renderCards(cards, loading, nonDeckButton) }
                      </CardQueryWrapper>
                    ) }
                  </QueryProvider>
                );
              }
              return (
                <CardListWrapper
                  codes={selectedCards}
                  type="encounter"
                >
                  { (cards: Card[], loading: boolean) => this._renderCards(cards, loading, false) }
                </CardListWrapper>
              );
            } }
          </ScenarioStepContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  loadingRow: {
    flexDirection: 'row',
    padding: m,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
