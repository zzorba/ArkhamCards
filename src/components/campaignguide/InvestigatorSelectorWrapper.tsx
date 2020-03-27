import React from 'react';
import { filter, map } from 'lodash';
import { t } from 'ttag';

import CampaignLogContext, { CampaignLogContextType } from './CampaignLogContext';
import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { InvestigatorSelector } from 'data/scenario/types';
import { InvestigatorDeck } from 'data/scenario';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props<T> {
  id: string;
  investigator: InvestigatorSelector;
  input?: string[];
  render: (investigatorDecks: InvestigatorDeck[], extraArgs: T) => React.ReactNode;
  extraArgs: T;
}

export default class InvestigatorSelectorWrapper<T> extends React.Component<Props<T>> {
  investigators(
    investigatorDecks: InvestigatorDeck[],
    campaignLog: GuidedCampaignLog,
    choice?: number
  ): InvestigatorDeck[] {
    const { investigator, input } = this.props;
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
      case '$input_value': {
        const codes = new Set(input || []);
        return filter(
          investigatorDecks,
          ({ investigator }) => codes.has(investigator.code)
        );
      }
    }
  }
  render() {
    const { id, render, investigator, extraArgs } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState, investigatorDecks }: ScenarioGuideContextType) => {
          const choice = scenarioState.choice(`${id}_investigator`);
          if (investigator === 'choice' && choice === undefined) {
            return (
              <ChooseInvestigatorPrompt
                id={`${this.props.id}_investigator`}
                title={t`Choose Investigator`}
                defaultLabel={t`None`}
              />
            );
          }
          return (
            <CampaignLogContext.Consumer>
              { ({ campaignLog }: CampaignLogContextType) => {
                const investigators = this.investigators(investigatorDecks, campaignLog, choice);
                return render(investigators, extraArgs);
              } }
            </CampaignLogContext.Consumer>
          );
        } }
      </ScenarioGuideContext.Consumer>
    )
  }
}
