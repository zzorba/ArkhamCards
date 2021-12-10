import { Alert } from 'react-native';
import { t } from 'ttag';
import uuid from 'react-native-uuid';

import {
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  GuideInput,
  NumberChoices,
  StringChoices,
  SupplyCounts,
  InvestigatorTraumaData,
  Trauma,
  DeckId,
  SYSTEM_BASED_GUIDE_INPUT_TYPES,
  SYSTEM_BASED_GUIDE_INPUT_IDS,
  DelayedDeckEdits,
} from '@actions/types';
import { ScenarioId, StepId } from '@data/scenario';
import Card, { CardsMap } from '@data/types/Card';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';

export interface CampaignGuideActions {
  showChooseDeck: (singleInvestigator?: Card, callback?: (code: string) => Promise<void>) => void;
  removeDeck: (deckId: DeckId, investigator: string) => void;
  removeInvestigator: (investigator: Card) => void;
  setDecision: (id: string, value: boolean, scenarioId?: string) => void;
  setCount: (id: string, value: number, scenarioId?: string) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts, scenarioId?: string) => void;
  setNumberChoices: (id: string, choices: NumberChoices, deckId?: DeckId, deckEdits?: DelayedDeckEdits, scenarioId?: string) => Promise<void>;
  setStringChoices: (id: string, choices: StringChoices, scenarioId?: string) => void;
  setChoice: (id: string, choice: number, scenarioId?: string) => void;
  setText: (id: string, text: string, scenarioId?: string) => void;
  setCampaignLink: (id: string, value: string, scenarioId?: string) => void;
  setInterScenarioData: (investigatorData: InvestigatorTraumaData, scenarioId: undefined | string, campaignLogEntries?: string[]) => void;
  startScenario: (scenarioId: string) => void;
  startSideScenario: (
    scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
  ) => void;
  resetScenario: (scenarioId: string) => void;
  undo: (scenarioId: string) => void;
  setBinaryAchievement: (achievementId: string, value: boolean) => void;
  incCountAchievement: (achievementId: string, max?: number) => void;
  decCountAchievement: (achievementId: string, max?: number) => void;
}

export default class CampaignStateHelper {
  state: CampaignGuideStateT;
  investigators: CardsMap;
  actions: CampaignGuideActions;

  linkedState?: CampaignGuideStateT;
  guideVersion: number;

  constructor(
    state: CampaignGuideStateT,
    investigators: CardsMap,
    actions: CampaignGuideActions,
    guideVersion: number,
    linkedState?: CampaignGuideStateT
  ) {
    this.guideVersion = guideVersion;
    this.state = state;
    this.investigators = investigators;
    this.actions = actions;
    this.linkedState = linkedState;
  }

  lastUpdated(): Date {
    return this.state.lastUpdated() || new Date();
  }

  showChooseDeck(singleInvestigator?: Card, callback?: (code: string) => Promise<void>) {
    this.actions.showChooseDeck(singleInvestigator, callback);
  }

  removeDeck(deckId: DeckId, investigator: string) {
    this.actions.removeDeck(deckId, investigator);
  }

  removeInvestigator(investigator: Card) {
    this.actions.removeInvestigator(investigator);
  }

  startScenario(scenarioId: string) {
    this.actions.startScenario(scenarioId);
  }

  closeOnUndo(scenarioId: string) {
    return this.state.countInput(input => (
      input.scenario === scenarioId &&
      !SYSTEM_BASED_GUIDE_INPUT_TYPES.has(input.type) &&
      !(input.step && SYSTEM_BASED_GUIDE_INPUT_IDS.has(input.step))
    )) === 1;
  }

  sideScenario(previousScenarioId: string): GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput | undefined {
    const matchingEntry = this.state.findInput(input =>
      input.type === 'start_side_scenario' && input.previousScenarioId === previousScenarioId
    );
    if (matchingEntry && matchingEntry.type === 'start_side_scenario') {
      return matchingEntry;
    }
    return undefined;
  }

  startOfficialSideScenario(
    scenarioId: string,
    previousScenarioId: ScenarioId
  ) {
    this.actions.startSideScenario({
      type: 'start_side_scenario',
      previousScenarioId: previousScenarioId.encodedScenarioId,
      sideScenarioType: 'official',
      scenario: scenarioId,
      step: undefined,
    });
  }

  startCustomSideScenario(
    previousScenarioId: ScenarioId,
    name: string,
    xpCost: number
  ) {
    this.actions.startSideScenario({
      type: 'start_side_scenario',
      previousScenarioId: previousScenarioId.encodedScenarioId,
      sideScenarioType: 'custom',
      scenario: uuid.v4(),
      name,
      xpCost,
      step: undefined,
    });
  }

  resetScenario(scenarioId: string) {
    this.actions.resetScenario(scenarioId);
  }

  setChoice(id: string, value: number, scenarioId?: string) {
    this.actions.setChoice(id, value, scenarioId);
  }

  setText(id: string, value: string, scenarioId?: string) {
    this.actions.setText(id, value, scenarioId);
  }

  setNumberChoices(id: string, value: NumberChoices, deckId?: DeckId, deckEdits?: DelayedDeckEdits, scenarioId?: string) {
    return this.actions.setNumberChoices(id, value, deckId, deckEdits, scenarioId);
  }

  setStringChoices(id: string, value: StringChoices, scenarioId?: string) {
    this.actions.setStringChoices(id, value, scenarioId);
  }

  setSupplies(id: string, value: SupplyCounts, scenarioId?: string) {
    this.actions.setSupplies(id, value, scenarioId);
  }

  setDecision(id: string, value: boolean, scenarioId?: string) {
    this.actions.setDecision(id, value, scenarioId);
  }

  setCount(id: string, value: number, scenarioId?: string) {
    this.actions.setCount(id, value, scenarioId);
  }

  setInterScenarioInvestigatorData(investigator: string, trauma: Trauma, scenarioId: undefined | string) {
    const investigatorData = {
      ...(this.interScenarioInvestigatorData(scenarioId) || {}),
      [investigator]: trauma,
    };
    this.actions.setInterScenarioData(investigatorData, scenarioId, this.interScenarioCampaignLogEntries(scenarioId));
  }

  setInterScenarioCampaignLogEntries(campaignLogEntries: string[], scenarioId: undefined | string) {
    this.actions.setInterScenarioData(this.interScenarioInvestigatorData(scenarioId) || {}, scenarioId, campaignLogEntries);
  }

  binaryAchievement(achievementId: string): boolean {
    return this.state.binaryAchievement(achievementId);
  }
  countAchievement(achievementId: string): number {
    return this.state.countAchievement(achievementId);
  }

  setBinaryAchievement(achievementId: string, value: boolean) {
    this.actions.setBinaryAchievement(achievementId, value);
  }

  incCountAchievement(achievementId: string, max?: number) {
    this.actions.incCountAchievement(achievementId, max);
  }

  decCountAchievement(achievementId: string) {
    this.actions.decCountAchievement(achievementId);
  }

  undo(scenarioId: string) {
    const latestInput = this.state.findLastInput(input =>
      input.scenario === scenarioId && !SYSTEM_BASED_GUIDE_INPUT_TYPES.has(input.type)
    );
    if (latestInput &&
      latestInput.type === 'choice_list' &&
      (latestInput.step.startsWith('$upgrade_decks#') || latestInput.step.startsWith('$save_standalone_decks#')) &&
      !!latestInput.deckId
    ) {
      const isUpgrade = latestInput.step.startsWith('$upgrade_decks#');
      // This is a deck upgrade action.
      Alert.alert(
        isUpgrade ? t`Undo deck upgrade?` : t`Undo deck change?`,
        isUpgrade ?
          t`Looks like you are trying to undo a deck upgrade.\n\nNote that the app will NOT delete your latest deck upgrade from ArkhamDB, so your deck will still have the earlier changes applied.\n\nYou can view the deck and delete the most recent 'upgrade' to put things back the way they were.` :
          t`Looks like you are trying to undo a deck save.\n\nThe app will NOT be able to undo these changes, so if you proceed again the changes might be applied twice. You should view the deck and manually undo the edits before reapplying the changes.`,
        [
          {
            text: t`Undo anyway`,
            onPress: () => {
              this.actions.undo(scenarioId);
            },
            style: 'destructive',
          },
          {
            text: t`Cancel`,
            style: 'cancel',
          },
        ],
      );
    } else {
      this.actions.undo(scenarioId);
    }
  }

  private entry(type: string, step?: string, scenario?: string): GuideInput | undefined {
    return this.state.findLastInput(input => (
      input.type === type &&
      // tslint:disable-next-line
      ((!input.scenario && !scenario) || input.scenario === scenario) && (
        input.type === 'start_scenario' ||
        input.type === 'start_side_scenario' ||
        // tslint:disable-next-line: strict-comparisons
        ((!step && !input.step) || step === input.step)
      )
    ));
  }

  private linkedEntry(
    type: string,
    step?: string
  ): GuideInput | undefined {
    return this.linkedState?.findLastInput(input => (
      input.type === type && (
        input.type === 'start_scenario' ||
        input.type === 'start_side_scenario' ||
        // tslint:disable-next-line
        input.step === step
      )
    ));
  }

  startedScenario(scenario: string): boolean {
    return !!this.entry(
      'start_scenario',
      undefined,
      scenario
    ) || !!this.entry(
      'start_side_scenario',
      undefined,
      scenario
    );
  }

  choice(id: string, scenario?: string): number | undefined {
    const entry = this.entry('choice', id, scenario);
    if (entry && entry.type === 'choice') {
      return entry.choice;
    }
    return undefined;
  }

  interScenarioInvestigatorData(scenarioId: string | undefined): InvestigatorTraumaData | undefined {
    const entry = this.entry('inter_scenario', undefined, scenarioId);
    if (entry && entry.type === 'inter_scenario') {
      return entry.investigatorData;
    }
    return undefined;
  }

  interScenarioCampaignLogEntries(scenarioId: string | undefined): string[] | undefined {
    const entry = this.entry('inter_scenario', undefined, scenarioId);
    if (entry && entry.type === 'inter_scenario') {
      return entry.campaignLogEntries;
    }
    return undefined;
  }

  text(id: string, scenario?: string): string | undefined {
    const entry = this.entry('text', id, scenario);
    if (entry && entry.type === 'text') {
      return entry.text;
    }
    return undefined;
  }

  nextDelayedDeckEdit(investigator: string, userId: string): StepId | undefined {
    const nextInput = this.state.findInput(input => !!(
      input.type === 'choice_list' &&
      input.deckEdits &&
      !input.deckEdits.resolved &&
      input.step.endsWith(`#${investigator}`) &&
      input.deckEdits.userId === userId
    ));

    return nextInput?.step ? {
      id: nextInput.step,
      scenario: nextInput.scenario,
    } : undefined;
  }

  numberChoices(id: string, scenario?: string): [NumberChoices | undefined, DeckId | undefined, DelayedDeckEdits | undefined] {
    const entry = this.entry('choice_list', id, scenario);
    if (entry && entry.type === 'choice_list') {
      return [entry.choices, entry.deckId, entry.deckEdits];
    }
    return [undefined, undefined, undefined];
  }

  stringChoices(id: string, scenario?: string): StringChoices | undefined {
    const entry = this.entry('string_choices', id, scenario);
    if (entry && entry.type === 'string_choices') {
      return entry.choices;
    }
    return undefined;
  }

  supplies(id: string, scenario?: string): SupplyCounts | undefined {
    const entry = this.entry('supplies', id, scenario);
    if (entry && entry.type === 'supplies') {
      return entry.supplies;
    }
    return undefined;
  }

  decision(id: string, scenario?: string): boolean | undefined {
    const entry = this.entry('decision', id, scenario);
    if (entry && entry.type === 'decision') {
      return entry.decision;
    }
    return undefined;
  }

  count(id: string, scenario?: string): number | undefined {
    const entry = this.entry('count', id, scenario);
    if (entry && entry.type === 'count') {
      return entry.count;
    }
    return undefined;
  }

  campaignLink(
    sendOrReceive: 'send' | 'receive',
    id: string,
    scenario?: string
  ): string | undefined {
    switch (sendOrReceive) {
      case 'send': {
        const entry = this.entry('campaign_link', id, scenario);
        if (entry && entry.type === 'campaign_link') {
          return entry.decision;
        }
        return undefined;
      }
      case 'receive': {
        if (!this.linkedState) {
          return undefined;
        }
        const entry = this.linkedEntry('campaign_link', id);
        if (entry && entry.type === 'campaign_link') {
          return entry.decision;
        }
        return undefined;
      }
    }
  }

  setCampaignLink(
    id: string,
    decision: string,
    scenarioId?: string
  ) {
    this.actions.setCampaignLink(
      id,
      decision,
      scenarioId
    );
  }
}
