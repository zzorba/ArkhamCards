import React from 'react';
import { Navigation } from 'react-native-navigation';
import { find, flatMap, keys, map, uniq } from 'lodash';
import { Brackets } from 'typeorm';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import CardQueryWrapper from 'components/card/CardQueryWrapper';
import CardListWrapper from 'components/card/CardListWrapper';
import { CardSelectorProps } from '../CardSelectorView';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { CardChoiceInput, CardSearchQuery } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { LatestDecks, ProcessedScenario } from 'data/scenario';
import { PLAYER_CARDS_QUERY, combineQueries, combineQueriesOpt, where } from 'data/query';
import { traitFilter, equalsVectorClause, UNIQUE_FILTER, VENGEANCE_FILTER } from 'lib/filters';
import Card from 'data/Card';

interface Props {
  componentId: string;
  id: string;
  text?: string;
  input: CardChoiceInput;
}

interface State {
  extraCards: string[];
}

export default class CardChoicePrompt extends React.Component<Props, State> {
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
          return this.basicQuery(query);
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
    includeNonDeckButton: boolean
  ): Element | null => {
    const {
      id,
      text,
      input,
    } = this.props;
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

  basicQuery(
    q: CardSearchQuery
  ): Brackets[] {
    const result: Brackets[] = [
      ...(q.trait ? traitFilter([q.trait]) : []),
    ];
    if (q.unique) {
      result.push(UNIQUE_FILTER);
    }
    if (q.vengeance) {
      result.push(VENGEANCE_FILTER);
    }
    if (q.exclude_code) {
      const codeParts = map(q.exclude_code, code => `(code != '${code}')`).join(' AND ');
      result.push(where(codeParts));
    }
    return result;
  }

  query(
    processedScenario: ProcessedScenario,
    investigators: Card[],
    latestDecks: LatestDecks,
  ): Brackets | undefined {
    const {
      input: { query },
    } = this.props;
    const queries = flatMap(query, q => {
      if (q.code) {
        return equalsVectorClause(q.code, 'code');
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
          return [
            ...equalsVectorClause(encounterSets, 'encounter_code'),
            ...this.basicQuery(q),
          ];
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
          return [
            ...equalsVectorClause(deckCodes, 'code'),
            ...this.basicQuery(q),
          ];
        }
      }
    });
    return combineQueriesOpt(
      queries,
      'and'
    );
  }

  render() {
    const { extraCards } = this.state;
    return (
      <CampaignGuideContext.Consumer>
        { ({ latestDecks }: CampaignGuideContextType) => (
          <ScenarioStepContext.Consumer>
            { ({ scenarioState, processedScenario, scenarioInvestigators }: ScenarioStepContextType) => {
              const selectedCards = this.lockedCards(scenarioState);
              if (selectedCards === undefined) {
                const nonDeckButton = this.includeNonDeckSearch(scenarioInvestigators, latestDecks);
                const queryOpt = this.query(processedScenario, scenarioInvestigators, latestDecks);
                return (
                  <CardQueryWrapper
                    query={combineQueriesOpt(
                      [
                        ...(queryOpt ? [queryOpt] : []),
                        ...equalsVectorClause(extraCards, 'code')
                      ],
                      'or'
                    )}
                    extraArg={nonDeckButton}
                  >
                    { this._renderCards }
                  </CardQueryWrapper>
                );
              }
              return (
                <CardListWrapper
                  cards={selectedCards}
                  extraArg={false}
                >
                  { this._renderCards }
                </CardListWrapper>
              );
            } }
          </ScenarioStepContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}
