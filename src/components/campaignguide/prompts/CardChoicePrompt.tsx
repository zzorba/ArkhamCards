import React from 'react';
import { flatMap, keys, map, uniq } from 'lodash';
import { t } from 'ttag';

import CheckListComponent from './CheckListComponent';
import ChoiceListComponent from './ChoiceListComponent';
import { InvestigatorDeck } from 'data/scenario';
import CardQueryWrapper from '../CardQueryWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import { CardChoiceInput } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import { safeValue } from 'lib/filters';
import Card from 'data/Card';

interface Props {
  id: string;
  text?: string;
  input: CardChoiceInput;
}

export default class CardChoicePrompt extends React.Component<Props> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  _renderCards = (cards: Card[]) => {
    const {
      id,
      text,
      input: { choices },
    } = this.props;
    if (choices.length > 1) {
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
          choices={choices}
        />
      );
    }

    return (
      <CheckListComponent
        id={id}
        text={text}
        items={map(cards, card => {
          return {
            code: card.code,
            name: card.name,
          };
        })}
        choice={choices[0]}
      />
    );
  };

  query(
    scenarioGuide: ScenarioGuide,
    scenarioState: ScenarioStateHelper,
    investigatorDecks: InvestigatorDeck[]
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
          const encounterSets = scenarioGuide.encounterSets(scenarioState);
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
              flatMap(investigatorDecks, investigator => keys(investigator.deck.slots))
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
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState, scenarioGuide }: ScenarioGuideContextType) => {
          return (
            <CardQueryWrapper
              query={this.query(scenarioGuide, scenarioState, investigatorDecks)}
              render={this._renderCards}
            />
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
