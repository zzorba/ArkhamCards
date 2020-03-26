import React from 'react';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import CampaignLogContext, { CampaignLogContextType } from './CampaignLogContext';
import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { InvestigatorSelector } from 'data/scenario/types';
import { InvestigatorDeck } from 'data/scenario';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  id: string;
  investigator: InvestigatorSelector;
  inputValue?: number[];
  render: (investigatorDecks: InvestigatorDeck[]) => React.ReactNode;
}

export default class InvestigatorSelectorWrapper extends React.Component<Props> {
  investigators(
    investigatorDecks: InvestigatorDeck[],
    campaignLog: GuidedCampaignLog,
    choice?: number
  ): InvestigatorDeck[] {
    const { investigator, inputValue } = this.props;
    switch (investigator) {
      case 'lead_investigator':
        const leadInvestigator = campaignLog.leadInvestigatorChoice();
        return filter(
          investigatorDecks,
          ({ investigator }) => investigator.code === leadInvestigator);
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
        const allStatus = campaignLog.investigatorResolutionStatus();
        return filter(investigatorDecks, (id) => {
          const status = allStatus[id.investigator.code];
          switch (investigator) {
            case 'defeated':
              return status !== 'alive' && status !== 'resigned';
            case 'not_resigned':
              return status !== 'resigned';
          }
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
                id={`${this.props.id}_investigator`}
                title={t`Investigator`}
                defaultLabel={t`None`}
              />
            );
          }
          return (
            <CampaignLogContext.Consumer>
              { ({ campaignLog }: CampaignLogContextType) => {
                const investigators = this.investigators(investigatorDecks, campaignLog, choice);
                return render(investigators);
              } }
            </CampaignLogContext.Consumer>
          );
        } }
      </ScenarioGuideContext.Consumer>
    )
  }
}
