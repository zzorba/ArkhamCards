import React from 'react';
import { flatMap, keys, map, uniq } from 'lodash';
import { t } from 'ttag';

import CounterListComponent from './CounterListComponent';
import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import CardQueryWrapper from '../CardQueryWrapper';
import CampaignGuideContext, { LatestDecks, CampaignGuideContextType } from '../CampaignGuideContext';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';
import { CardChoiceInput } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { ProcessedScenario } from 'data/scenario';
import { safeValue } from 'lib/filters';
import Card from 'data/Card';

interface Props {
  id: string;
  text?: string;
  input: CardChoiceInput;
}

export default class CardChoicePrompt extends React.Component<Props> {
  _renderCards = (cards: Card[]) => {
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
      />
    );
  };

  query(
    processedScenario: ProcessedScenario,
    scenarioState: ScenarioStateHelper,
    investigators: Card[],
    latestDecks: LatestDecks,
  ): string {
    const { input: { query } } = this.props;
    const mainQuery = map(query, q => {
      if (q.code) {
        const codeParts = map(q.code, code => t`(code == '${code}')`).join(' OR ');
        return `(${codeParts})`;
      }
      const queryParts: string[] = [];
      switch (q.source) {
        case 'scenario': {
          const encounterSets = flatMap(processedScenario.steps, step => {
            if (step.step.type === 'encounter_sets') {
              return step.step.encounter_sets;
            }
            return [];
          });
          if (encounterSets) {
            const encounterQuery = flatMap(
              encounterSets,
              encounterCode => [
                `(encounter_code == '${encounterCode}')`,
                `(linked_card.encounter_code == '${encounterCode}')`,
              ]
            ).join(' OR ');
            queryParts.push(`(${encounterQuery})`);
          }
          break;
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
          queryParts.push(`(${codeQuery})`);
          break;
        }
      }
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
      return `(${queryParts.join(' AND ')})`;
    }).join(' OR ');
    return `(${mainQuery})`;
  }

  render() {
    return (
      <CampaignGuideContext.Consumer>
        { ({ latestDecks }: CampaignGuideContextType) => (
          <ScenarioStepContext.Consumer>
            { ({ scenarioState, processedScenario, scenarioInvestigators }: ScenarioStepContextType) => (
              <CardQueryWrapper
                query={this.query(processedScenario, scenarioState, scenarioInvestigators, latestDecks)}
                render={this._renderCards}
                extraArg={undefined}
              />
            ) }
          </ScenarioStepContext.Consumer>
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}
