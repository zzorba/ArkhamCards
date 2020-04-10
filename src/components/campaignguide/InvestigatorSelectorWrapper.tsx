import React from 'react';
import { filter, keys, head } from 'lodash';
import { t } from 'ttag';

import ScenarioStepContext, { ScenarioStepContextType } from './ScenarioStepContext';
import ChooseInvestigatorPrompt from './prompts/ChooseInvestigatorPrompt';
import { InvestigatorSelector } from 'data/scenario/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import Card from 'data/Card';

interface Props<T> {
  id: string;
  investigator: InvestigatorSelector;
  optional?: boolean;
  description?: string;
  input?: string[];
  render: (investigators: Card[], extraArg: T) => React.ReactNode;
  extraArg: T;
}

export default class InvestigatorSelectorWrapper<T = undefined> extends React.Component<Props<T>> {
  investigators(
    investigators: Card[],
    campaignLog: GuidedCampaignLog,
    choice?: string
  ): Card[] {
    const { investigator, input, optional } = this.props;
    switch (investigator) {
      case 'lead_investigator': {
        const leadInvestigator = campaignLog.leadInvestigatorChoice();
        if (!optional) {
          return filter(
            investigators,
            investigator => investigator.code === leadInvestigator
          );
        }
        if (choice === undefined) {
          return [];
        }
        return filter(
          investigators,
          investigator => investigator.code === choice
        );
      }
      case 'all':
        return investigators;
      case 'any':
      case 'choice':
        if (choice === undefined) {
          return [];
        }
        return filter(
          investigators,
          investigator => investigator.code === choice
        );
      case 'defeated':
      case 'not_resigned': {
        const allStatus = campaignLog.investigatorResolutionStatus();
        return filter(investigators, card => {
          const status = allStatus[card.code];
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
          investigators,
          investigator => codes.has(investigator.code)
        );
      }
    }
  }

  renderContent(
    scenarioState: ScenarioStateHelper,
    campaignLog: GuidedCampaignLog,
    scenarioInvestigators: Card[]
  ) {
    const {
      id,
      render,
      investigator,
      description,
      extraArg,
      optional,
    } = this.props;
    const choice = scenarioState.stringChoices(`${id}_investigator`);
    if (choice === undefined && (
      investigator === 'choice' ||
      investigator === 'any' ||
      (investigator === 'lead_investigator' && optional)
    )) {
      return (
        <ChooseInvestigatorPrompt
          id={`${id}_investigator`}
          title={t`Choose Investigator`}
          choiceId="chosen_investigator"
          description={description}
          investigators={investigator === 'lead_investigator' ?
            [campaignLog.leadInvestigatorChoice()] :
            []
          }
          defaultLabel={t`No one`}
          required={investigator === 'any'}
        />
      );
    }
    const investigators = this.investigators(
      scenarioInvestigators,
      campaignLog,
      head(keys(choice))
    );
    return render(investigators, extraArg);
  }

  render() {
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState, campaignLog }: ScenarioStepContextType) => {
          return this.renderContent(scenarioState, campaignLog, campaignLog.investigators(false));
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}
