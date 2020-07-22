import React from 'react';
import { keys, slice } from 'lodash';

import InvestigatorCheckListComponent from '@components/campaignguide/prompts/InvestigatorCheckListComponent';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from '@components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { investigatorChoiceInputChoices } from '@data/scenario/inputHelper';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceInput;
  campaignLog: GuidedCampaignLog;
}

export default class InvestigatorChoiceInputComponent extends React.Component<Props> {
  iteration(): number {
    const { step } = this.props;
    if (step.id.indexOf('#') === -1) {
      return 0;
    }
    const iteration = parseInt(step.id.split('#')[1], 10);
    return iteration;
  }

  render() {
    const { step, input, campaignLog } = this.props;
    if (input.special_mode === 'sequential') {
      const investigatorOffset = this.iteration();
      return (
        <InvestigatorChoicePrompt
          id={step.id}
          text={step.text}
          bulletType={step.bullet_type}
          options={investigatorChoiceInputChoices(input, campaignLog)}
          detailed
          investigators={slice(
            campaignLog.investigators(false),
            investigatorOffset,
            investigatorOffset + 1
          )}
          optional={input.investigator === 'choice'}
        />
      );
    }
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
    if (input.choices.length === 1 && (
      input.investigator === 'all' ||
      input.investigator === 'choice'
    )) {
      const choices = investigatorChoiceInputChoices(input, campaignLog);
      const choice = input.choices[0];
      return (
        <>
          { !!step.text && (
            <SetupStepWrapper bulletType={step.bullet_type}>
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
