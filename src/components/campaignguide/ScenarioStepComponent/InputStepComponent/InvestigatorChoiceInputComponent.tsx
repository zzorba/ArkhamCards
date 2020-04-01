import React from 'react';
import { keys } from 'lodash';

import InvestigatorCheckListComponent from 'components/campaignguide/prompts/InvestigatorCheckListComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from 'components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import { InvestigatorDeck } from 'data/scenario';
import { investigatorChoiceInputChoices } from 'data/scenario/inputHelper';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorChoiceInputComponent extends React.Component<Props> {
  render() {
    const { step, input, campaignLog } = this.props;
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
            investigators={keys(
              investigatorChoiceInputChoices(input, campaignLog).perCode
            )}
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
        options={investigatorChoiceInputChoices(input, campaignLog)}
        detailed={input.detailed}
        optional={input.investigator === 'choice'}
      />
    );
  }
}
