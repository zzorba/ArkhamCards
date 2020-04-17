import React from 'react';
import { keys } from 'lodash';

import InvestigatorCheckListComponent from 'components/campaignguide/prompts/InvestigatorCheckListComponent';
import CampaignGuideTextComponent from 'components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from 'components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
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
      const choice = input.choices[0];
      return (
        <ChooseInvestigatorPrompt
          id={step.id}
          title={choice.text}
          choiceId={choice.id}
          required
        />
      );
    }
    if (
      (input.investigator === 'all' || input.investigator === 'choice') &&
      input.choices.length === 1
    ) {
      const choices = investigatorChoiceInputChoices(input, campaignLog);
      const choice = input.choices[0];
      return (
        <>
          { !!step.text && (
            <SetupStepWrapper>
              <CampaignGuideTextComponent text={step.text} />
            </SetupStepWrapper>
          ) }
          <InvestigatorCheckListComponent
            id={step.id}
            choiceId={choice.id}
            checkText={choice.text}
            investigators={choices.type === 'personalized' ? keys(choices.perCode) : undefined}
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
        detailed={input.special_mode === 'detailed'}
        optional={input.investigator === 'choice'}
      />
    );
  }
}
