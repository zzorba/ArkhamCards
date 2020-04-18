import React from 'react';
import { Navigation } from 'react-native-navigation';
import { forEach, find, flatMap, keys, map, uniq } from 'lodash';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import CardQueryWrapper from '../CardQueryWrapper';
import CardListWrapper from '../CardListWrapper';
import { CardSelectorProps } from '../CardSelectorView';
import CampaignGuideContext, { CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { CardChoiceInput, CardSearchQuery } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { LatestDecks, ProcessedScenario } from 'data/scenario';
import { safeValue } from 'lib/filters';
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
    const queryParts = flatMap(input.query,
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
          query: `((${queryParts.join(' AND ')}) AND deck_limit > 0)`,
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
  ): string | undefined {
    const queryParts = [];
    if (q.trait) {
      queryParts.push([
        '(',
        `traits_normalized CONTAINS[c] "${safeValue(q.trait)}"`,
        ')',
      ].join(''));
    }
    if (q.unique) {
      queryParts.push(
        '(is_unique == true or linked_card.is_unique == true)'
      );
    }
    if (q.vengeance) {
      queryParts.push(
        '(vengeance >= 0 or linked_card.vengeance >= 0)'
      );
    }
    if (q.exclude_code) {
      const codeParts = map(q.exclude_code, code => `(code != '${code}')`).join(' AND ');
      queryParts.push(`(${codeParts})`);
    }
    return `(${queryParts.join(' AND ')})`;
  }

  query(
    processedScenario: ProcessedScenario,
    investigators: Card[],
    latestDecks: LatestDecks,
  ): string {
    const { input: { query } } = this.props;
    const { extraCards } = this.state;
    const queryParts = flatMap(query, q => {
      if (q.code) {
        const codeParts = map(q.code, code => t`(code == '${code}')`).join(' OR ');
        return `(${codeParts})`;
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
          const encounterQuery = flatMap(
            encounterSets,
            encounterCode => [
              `(encounter_code == '${encounterCode}')`,
              `(linked_card.encounter_code == '${encounterCode}')`,
            ]
          ).join(' OR ');
          return `((${encounterQuery}) AND ${this.basicQuery(q)})`;
        }
        case 'deck': {
          const codeQuery = map(
            uniq(
              flatMap(investigators, investigator => {
                const deck = latestDecks[investigator.code];
                if (!deck) {
                  // Do something else in this case?
                  return [];
                }
                return keys(deck.slots);
              })
            ),
            code => `(code == '${code}')`
          ).join(' OR ');
          if (!codeQuery) {
            return [];
          }
          return `((${codeQuery}) AND ${this.basicQuery(q)})`;
        }
      }
    });

    forEach(extraCards, code => {
      queryParts.push(`(code == '${code}')`);
    });
    return `(${queryParts.join(' OR ')})`;
  }

  render() {
    return (
      <CampaignGuideContext.Consumer>
        { ({ latestDecks }: CampaignGuideContextType) => (
          <ScenarioStepContext.Consumer>
            { ({ scenarioState, processedScenario, scenarioInvestigators }: ScenarioStepContextType) => {
              const selectedCards = this.lockedCards(scenarioState);
              if (selectedCards === undefined) {
                const nonDeckButton = this.includeNonDeckSearch(scenarioInvestigators, latestDecks);
                return (
                  <CardQueryWrapper
                    query={this.query(processedScenario, scenarioInvestigators, latestDecks)}
                    render={this._renderCards}
                    extraArg={nonDeckButton}
                  />
                );
              }
              return (
                <CardListWrapper
                  cards={selectedCards}
                  render={this._renderCards}
                  extraArg={false}
                />
              );
            } }
          </ScenarioStepContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}
