import React from 'react';

import InvestigatorCheckListComponent from 'components/campaignguide/prompts/InvestigatorCheckListComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from 'components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { InvestigatorDeck } from 'data/scenario';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorChoiceInputComponent extends React.Component<Props> {
  _filterInvestigator = (
    investigatorDeck: InvestigatorDeck
  ) => {
    return true;
  };

  render() {
    const { step, input } = this.props;
    if (input.investigator === 'any') {
      return (
        <ChooseInvestigatorPrompt
          id={step.id}
          title={input.choices[0].text}
          required
        />
      );
    }
    if (
      (input.investigator === 'all' || input.investigator === 'choice') &&
      input.choices.length === 1
    ) {
      return (
        <>
          { !!step.text && (
            <SetupStepWrapper>
              <CardTextComponent text={step.text} />
            </SetupStepWrapper>
          ) }
          <InvestigatorCheckListComponent
            id={step.id}
            checkText={input.choices[0].text}
            defaultState={input.defaultChoice === 0}
            filter={this._filterInvestigator}
            min={input.investigator === 'choice' ? 1 : 0}
            max={4}
          />
        </>
      );
    }
    return (
      <InvestigatorChoicePrompt
        id={step.id}
        text={step.text}
        bulletType={step.bullet_type}
        choices={input.choices}
        detailed={input.detailed}
        optional={input.investigator === 'choice'}
      />
    );
  }
}
