import React, { useMemo } from 'react';
import { filter, keys, slice, map } from 'lodash';

import InvestigatorCheckListComponent from '@components/campaignguide/prompts/InvestigatorCheckListComponent';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import ChooseInvestigatorPrompt from '@components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorChoicePrompt from '@components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep, InvestigatorChoiceInput } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { investigatorChoiceInputChoices } from '@data/scenario/inputHelper';
import { investigatorChoiceConditionResult } from '@data/scenario/conditionHelper';

interface Props {
  step: InputStep;
  input: InvestigatorChoiceInput;
  campaignLog: GuidedCampaignLog;
  min?: number;
  max?: number;
}

export default function InvestigatorChoiceInputComponent({ step, input, campaignLog, min, max }: Props) {
  const [investigators, investigatorCodes] = useMemo(() => {
    const allInvestigators = campaignLog.investigators(false)
    if (!input.condition) {
      const selectedInvestigators = filter(allInvestigators, c => {
        switch (input.investigator) {
          case 'resigned': return campaignLog.resigned(c.code);
          case 'defeated': return campaignLog.isDefeated(c.code);
          case 'not_defeated': return !campaignLog.isDefeated(c.code);
          default: return true;
        }
      })
      return [selectedInvestigators, map(selectedInvestigators, c => c.code)];
    }
    const result = investigatorChoiceConditionResult(input.condition, campaignLog);
    const codes = new Set(keys(result.investigatorChoices));
    return [
      filter(allInvestigators, i => codes.has(i.code)),
      keys(result.investigatorChoices),
    ];
  }, [input, campaignLog]);
  const iteration: number = useMemo(() => {
    if (step.id.indexOf('#') === -1) {
      return 0;
    }
    const iteration = parseInt(step.id.split('#')[1], 10);
    return iteration;
  }, [step]);

  if (input.special_mode === 'sequential') {
    const investigatorOffset = iteration;
    return (
      <>
        { !!step.text && (
          <SetupStepWrapper bulletType={step.bullet_type}>
            <CampaignGuideTextComponent text={step.text} />
          </SetupStepWrapper>
        ) }
        <InvestigatorChoicePrompt
          id={step.id}
          text={step.text}
          promptType={step.prompt_type}
          confirmText={input.confirm_text}
          bulletType={step.bullet_type}
          options={investigatorChoiceInputChoices(input, campaignLog)}
          hideInvestigatorSection
          detailed
          investigator={investigators[investigatorOffset]}
          investigators={slice(
            investigators,
            investigatorOffset,
            investigatorOffset + 1
          )}
          optional={input.investigator === 'choice'}
        />
      </>
    );
  }
  if (input.investigator === 'any') {
    const choice = input.choices[0];
    return (
      <>
        { !!step.text && (
          <SetupStepWrapper bulletType={step.bullet_type}>
            <CampaignGuideTextComponent text={step.text} />
          </SetupStepWrapper>
        ) }
        <ChooseInvestigatorPrompt
          id={step.id}
          title={choice.text}
          choiceId={choice.id}
          investigators={investigatorCodes}
          required
        />
      </>
    );
  }
  if (input.choices.length === 1 && (
    input.investigator === 'not_defeated' ||
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
          confirmText={choice.selected_text}
          investigators={choices.type === 'personalized' ? keys(choices.perCode) : investigatorCodes}
          min={min || (input.investigator === 'choice' && !input.optional ? 1 : 0)}
          max={max || 4}
        />
      </>
    );
  }
  const options = investigatorChoiceInputChoices(input, campaignLog);
  return (
    <>
      { !!step.text && (
        <SetupStepWrapper bulletType={step.bullet_type}>
          <CampaignGuideTextComponent text={step.text} />
        </SetupStepWrapper>
      ) }
      <InvestigatorChoicePrompt
        id={step.id}
        text={step.text}
        promptType={step.prompt_type}
        bulletType={step.bullet_type}
        investigators={investigators}
        options={options}
        detailed={input.special_mode === 'detailed'}
        optional={input.investigator === 'choice'}
        unique={input.unique}
      />
    </>
  );
}
