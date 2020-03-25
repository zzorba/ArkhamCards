import React from 'react';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import { InvestigatorSelector } from 'data/scenario/types';
import { InvestigatorDeck, InvestigatorResolutionStatus } from 'data/scenario';

interface Props {
  id: string;
  investigator: InvestigatorSelector;
  inputValue?: number[];
  render: (investigatorDecks: InvestigatorDeck[]) => React.ReactNode;
}

export default class InvestigatorSelectorWrapper extends React.Component<Props> {
  investigators(
    scenarioState: ScenarioStateHelper,
    investigatorDecks: InvestigatorDeck[],
    choice: number | undefined
  ): InvestigatorDeck[] {
    const { investigator, inputValue } = this.props;
    switch (investigator) {
      case 'lead_investigator':
        return [
          investigatorDecks[scenarioState.leadInvestigatorChoice()],
        ];
      case 'all':
        return investigatorDecks;
      case 'any':
        return [];
      case 'choice':
        if (choice === undefined || choice === -1) {
          return [];
        }
        return [investigatorDecks[choice]];
      case 'defeated':
      case 'not_resigned': {
        const allStatus = scenarioState.investigatorResolutionStatus();
        return filter(investigatorDecks, (id) => {
          const status = allStatus[id.investigator.code];
          if (investigator === 'defeated') {
            return (
              status !== InvestigatorResolutionStatus.ALIVE &&
              status !== InvestigatorResolutionStatus.RESIGNED
            );
          }
          return status !== InvestigatorResolutionStatus.RESIGNED;
        });
      }
      case '$input_value':
        return map(inputValue, idx => investigatorDecks[idx]);
    }
  }
  render() {
    const { id, render, investigator } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState, investigatorDecks }: ScenarioGuideContextType) => {
          const choice = scenarioState.choice(`${id}_investigator`);
          if (investigator === 'choice' && choice === undefined) {
            return (
              <ChooseInvestigatorPrompt
                id={this.props.id}
                title={t`Investigator`}
                defaultLabel={t`None`}
              />
            );
          }
          return render(
            this.investigators(
              scenarioState,
              investigatorDecks,
              choice
            )
          );
        } }
      </ScenarioGuideContext.Consumer>
    )
  }
}
