import React from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import InvestigatorChoiceInputComponent from './InvestigatorChoiceInputComponent';
import InvestigatorCheckListComponent from 'components/campaignguide/prompts/InvestigatorCheckListComponent';
import UseSuppliesPrompt from 'components/campaignguide/prompts/UseSuppliesPrompt';
import CardTextComponent from 'components/card/CardTextComponent';
import SetupStepWrapper from 'components/campaignguide/SetupStepWrapper';
import CardChoicePrompt from 'components/campaignguide/prompts/CardChoicePrompt';
import ChooseInvestigatorPrompt from 'components/campaignguide/prompts/ChooseInvestigatorPrompt';
import InvestigatorCounterComponent from 'components/campaignguide/prompts/InvestigatorCounterComponent';
import ChooseOnePrompt from 'components/campaignguide/prompts/ChooseOnePrompt';
import BinaryPrompt from 'components/campaignguide/prompts/BinaryPrompt';
import NumberPrompt from 'components/campaignguide/prompts/NumberPrompt';
import SuppliesPrompt from 'components/campaignguide/prompts/SuppliesPrompt';
import InvestigatorChoicePrompt from 'components/campaignguide/prompts/InvestigatorChoicePrompt';
import { InputStep } from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import typography from 'styles/typography';

interface Props {
  step: InputStep;
  campaignLog: GuidedCampaignLog;
}

export default class InputStepComponent extends React.Component<Props> {
  renderPrompt(): React.ReactNode {
    const { step, campaignLog } = this.props;
    switch (step.input.type) {
      case 'choose_one':
        if (step.input.choices.length === 1) {
          return (
            <BinaryPrompt
              id={step.id}
              bulletType={step.bullet_type}
              text={step.input.choices[0].text}
              trueResult={step.input.choices[0]}
            />
          );
        }
        return (
          <ChooseOnePrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            input={step.input}
          />
        );
      case 'counter':
        return (
          <NumberPrompt
            id={step.id}
            bulletType={step.bullet_type}
            prompt={step.input.text}
            effects={step.input.effects}
            max={step.input.max}
            text={step.text}
          />
        );
      case 'choose_many':
        return <Text>Choose Many</Text>;
      case 'investigator_counter':
        return (
          <>
            <SetupStepWrapper bulletType={step.bullet_type}>
              { !!step.text && <CardTextComponent text={step.text} /> }
            </SetupStepWrapper>
            <InvestigatorCounterComponent
              id={step.id}
            />
          </>
        );
      case 'supplies':
        return (
          <SuppliesPrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.text}
            input={step.input}
          />
        );
      case 'card_choice':
        return (
          <CardChoicePrompt
            id={step.id}
            text={step.text}
            input={step.input}
          />
        );
      case 'use_supplies':
        return (
          <UseSuppliesPrompt
            id={step.id}
            text={step.text}
            input={step.input}
            campaignLog={campaignLog}
          />
        );
      case 'investigator_choice':
        return (
          <InvestigatorChoiceInputComponent
            step={step}
            input={step.input}
            campaignLog={campaignLog}
          />
        );
      case 'scenario_investigators':
        return (
          <>
            { !!step.text && (
              <SetupStepWrapper>
                <CardTextComponent text={step.text} />
              </SetupStepWrapper>
            ) }
            <InvestigatorCheckListComponent
              id={step.id}
              checkText={t`Choose Investigators`}
              defaultState
              min={1}
              max={4}
              allowNewDecks
            />
          </>
        );
      }
  }

  render() {
    const { step } = this.props;
    return (
      <>
        { !!step.title && (
          <Text style={[typography.bigGameFont, typography.center]}>
            { step.title }
          </Text>
        ) }
        { this.renderPrompt() }
      </>
    );
  }
}
