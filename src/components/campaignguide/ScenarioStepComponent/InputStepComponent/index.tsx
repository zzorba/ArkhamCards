import React from 'react';
import { t } from 'ttag';

import RandomLocationInputComponent from './RandomLocationInputComponent';
import ReceiveCampaignLinkInputComponent from './ReceiveCampaignLinkInputComponent';
import SendCampaignLinkInputComponent from './SendCampaignLinkInputComponent';
import InvestigatorCounterInputComponent from './InvestigatorCounterInputComponent';
import TextBoxInputComponent from './TextBoxInputComponent';
import PlayScenarioComponent from './PlayScenarioComponent';
import UpgradeDecksInput from './UpgradeDecksInput';
import InvestigatorChoiceWithSuppliesInputComponent from './InvestigatorChoiceWithSuppliesInputComponent';
import InvestigatorChoiceInputComponent from './InvestigatorChoiceInputComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import InvestigatorCheckListComponent from '@components/campaignguide/prompts/InvestigatorCheckListComponent';
import UseSuppliesPrompt from '@components/campaignguide/prompts/UseSuppliesPrompt';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CardChoicePrompt from '@components/campaignguide/prompts/CardChoicePrompt';
import ChooseOnePrompt from '@components/campaignguide/prompts/ChooseOnePrompt';
import BinaryPrompt from '@components/campaignguide/prompts/BinaryPrompt';
import NumberPrompt from '@components/campaignguide/prompts/NumberPrompt';
import SuppliesPrompt from '@components/campaignguide/prompts/SuppliesPrompt';
import { InputStep } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { chooseOneInputChoices } from '@data/scenario/inputHelper';

interface Props {
  step: InputStep;
  componentId: string;
  campaignLog: GuidedCampaignLog;
  fontScale: number;
  switchCampaignScenario: () => void;
}

export default class InputStepComponent extends React.Component<Props> {
  renderContent(
    campaignId: number
  ): React.ReactNode {
    const {
      step,
      campaignLog,
      componentId,
      fontScale,
      switchCampaignScenario,
    } = this.props;
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
            choices={chooseOneInputChoices(step.input.choices, campaignLog)}
            picker={step.input.style === 'picker'}
          />
        );
      case 'counter':
        return (
          <NumberPrompt
            id={step.id}
            bulletType={step.bullet_type}
            prompt={step.input.text}
            longLived={!!step.input.long_lived}
            delta={!!step.input.delta}
            confirmText={step.input.confirm_text}
            effects={step.input.effects}
            min={step.input.min}
            max={step.input.max}
            text={step.text}
          />
        );
      case 'investigator_counter': {
        return (
          <InvestigatorCounterInputComponent
            step={step}
            input={step.input}
            campaignLog={campaignLog}
          />
        );
      }
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
            componentId={componentId}
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
      case 'investigator_choice_supplies':
        return (
          <InvestigatorChoiceWithSuppliesInputComponent
            step={step}
            input={step.input}
            campaignLog={campaignLog}
          />
        );
      case 'upgrade_decks':
        return (
          <CampaignGuideContext.Consumer>
            { ({ latestDecks, campaignState }: CampaignGuideContextType) => (
              <UpgradeDecksInput
                id={step.id}
                componentId={componentId}
                fontScale={fontScale}
                latestDecks={latestDecks}
                campaignState={campaignState}
              />
            ) }
          </CampaignGuideContext.Consumer>
        );
      case 'play_scenario':
        return (
          <PlayScenarioComponent
            id={step.id}
            campaignId={campaignId}
            componentId={componentId}
            input={step.input}
          />
        );
      case 'scenario_investigators':
        return (
          <>
            { !!step.text && (
              <SetupStepWrapper>
                <CampaignGuideTextComponent text={step.text} />
              </SetupStepWrapper>
            ) }
            <InvestigatorCheckListComponent
              id={step.id}
              choiceId="chosen"
              checkText={t`Choose Investigators`}
              defaultState
              min={1}
              max={4}
              allowNewDecks
            />
          </>
        );
      case 'text_box':
        return (
          <TextBoxInputComponent
            id={step.id}
            prompt={step.text}
          />
        );
      case 'send_campaign_link':
        return (
          <SendCampaignLinkInputComponent
            id={step.id}
            input={step.input}
            campaignLog={campaignLog}
            bulletType={step.bullet_type}
            text={step.text}
          />
        );
      case 'receive_campaign_link':
        return (
          <ReceiveCampaignLinkInputComponent
            componentId={componentId}
            id={step.id}
            input={step.input}
            campaignLog={campaignLog}
            switchCampaignScenario={switchCampaignScenario}
          />
        );
      case 'random_location':
        return (
          <RandomLocationInputComponent
            input={step.input}
            fontScale={fontScale}
          />
        );
      default: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const _exhaustiveCheck: never = step.input;
        return null;
      }
    }
  }

  render() {
    return (
      <CampaignGuideContext.Consumer>
        { ({ campaignId }: CampaignGuideContextType) => (
          this.renderContent(campaignId)
        ) }
      </CampaignGuideContext.Consumer>
    );
  }
}
