import React, { useContext } from 'react';
import { t } from 'ttag';

import RandomLocationInputComponent from './RandomLocationInputComponent';
import ReceiveCampaignLinkInputComponent from './ReceiveCampaignLinkInputComponent';
import SendCampaignLinkInputComponent from './SendCampaignLinkInputComponent';
import InvestigatorCounterInputComponent from './InvestigatorCounterInputComponent';
import TextBoxInputComponent from './TextBoxInputComponent';
import PlayScenarioComponent from './PlayScenarioComponent';
import UpgradeDecksInput from './UpgradeDecksInput';
import SaveDecksInput from './SaveDecksInput';
import InvestigatorChoiceWithSuppliesInputComponent from './InvestigatorChoiceWithSuppliesInputComponent';
import InvestigatorChoiceInputComponent from './InvestigatorChoiceInputComponent';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import CheckListPrompt from '@components/campaignguide/prompts/CheckListPrompt';
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
import StyleContext from '@styles/StyleContext';
import { s } from '@styles/space';
import PrologueRandomizerPrompt from '@components/campaignguide/prompts/PrologueRandomizerPrompt';
import PartnerTraumaComponent from './PartnerTraumaComponent';
import InvestigatorChoicePartnerComponent from './InvestigatorChoicePartnerComponent';
import PartnerChoiceComponent from './PartnerChoiceComponent';

interface Props {
  step: InputStep;
  componentId: string;
  campaignLog: GuidedCampaignLog;
  switchCampaignScenario: () => void;
}

export default function InputStepComponent({ step, componentId, campaignLog, switchCampaignScenario }: Props) {
  const { campaignId } = useContext(CampaignGuideContext);
  const { width } = useContext(StyleContext);
  switch (step.input.type) {
    case 'choose_one':
      if (step.input.choices.length === 1) {
        return (
          <BinaryPrompt
            id={step.id}
            bulletType={step.bullet_type}
            text={step.input.choices[0].text}
          />
        );
      }
      return (
        <ChooseOnePrompt
          id={step.id}
          bulletType={step.bullet_type}
          text={step.text}
          confirmText={step.input.confirm_text}
          choices={chooseOneInputChoices(step.input.choices, campaignLog)}
          defaultChoice={step.input.default_choice}
        />
      );
    case 'checklist': {
      return (
        <CheckListPrompt
          id={step.id}
          text={step.text}
          bulletType={step.bullet_type}
          input={step.input}
        />
      );
    }
    case 'counter':
      return (
        <NumberPrompt
          id={step.id}
          bulletType={step.bullet_type}
          prompt={step.input.text}
          longLived={!!step.input.long_lived}
          delta={!!step.input.delta}
          confirmText={step.input.confirm_text}
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
          width={width - s * 2}
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
        <UpgradeDecksInput
          id={step.id}
          componentId={componentId}
          skipDeckSave={step.input.skip_decks}
          specialXp={step.input.special_xp}
          storyCards={step.input.story_cards}
          investigatorCounter={step.input.counter}
        />
      );
    case 'save_decks':
      return (
        <SaveDecksInput
          id={step.id}
          componentId={componentId}
        />
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
            confirmText={t`Investigators`}
            defaultState
            min={step.input.choose_none_steps ? 0 : 1}
            max={4}
            allowNewDecks
            includeLeadInvestigator={!!step.input.lead_investigator_effects}
          />
        </>
      );
    case 'text_box':
      return (
        <TextBoxInputComponent
          id={step.id}
          prompt={step.text}
          showUndo={!!step.input.undo}
        />
      );
    case 'send_campaign_link':
      return (
        <SendCampaignLinkInputComponent
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
        />
      );
    case 'prologue_randomizer':
      return (
        <PrologueRandomizerPrompt id={step.id} input={step.input} />
      )
    case 'tarot_reading':
      return null;
    case 'partner_trauma':
      return <PartnerTraumaComponent id={step.id} input={step.input} text={step.text} />;
    case 'investigator_choice_partner':
      return <InvestigatorChoicePartnerComponent id={step.id} input={step.input} text={step.text} bulletType={step.bullet_type} />;
    case 'partner_choice':
      return <PartnerChoiceComponent id={step.id} input={step.input} />;
  }
}
