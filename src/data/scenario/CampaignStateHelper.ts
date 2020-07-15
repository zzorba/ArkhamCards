import { sumBy, filter, find, findLast } from 'lodash';
import { Alert } from 'react-native';
import { t } from 'ttag';
import uuid from 'react-native-uuid';

import {
  Deck,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  GuideInput,
  NumberChoices,
  StringChoices,
  CampaignGuideState,
  SupplyCounts,
} from 'actions/types';
import { ScenarioId } from '@data/scenario';
import Card, { CardsMap } from '@data/Card';

export interface CampaignGuideActions {
  showChooseDeck: (singleInvestigator?: Card, callback?: (code: string) => void) => void;
  removeDeck: (deck: Deck) => void;
  removeInvestigator: (investigator: Card) => void;
  setDecision: (id: string, value: boolean, scenarioId?: string) => void;
  setCount: (id: string, value: number, scenarioId?: string) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts, scenarioId?: string) => void;
  setNumberChoices: (id: string, choices: NumberChoices, scenarioId?: string) => void;
  setStringChoices: (id: string, choices: StringChoices, scenarioId?: string) => void;
  setChoice: (id: string, choice: number, scenarioId?: string) => void;
  setText: (id: string, text: string, scenarioId?: string) => void;
  setCampaignLink: (id: string, value: string, scenarioId?: string) => void;
  startScenario: (scenarioId: string) => void;
  startSideScenario: (
    scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
  ) => void;
  resetScenario: (scenarioId: string) => void;
  undo: (scenarioId: string) => void;
}

export default class CampaignStateHelper {
  state: CampaignGuideState;
  investigators: CardsMap;
  actions: CampaignGuideActions;

  linkedState?: CampaignGuideState;
  guideVersion: number;

  constructor(
    state: CampaignGuideState,
    investigators: CardsMap,
    actions: CampaignGuideActions,
    guideVersion: number,
    linkedState?: CampaignGuideState
  ) {
    this.guideVersion = guideVersion;
    this.state = state;
    this.investigators = investigators;
    this.actions = actions;
    this.linkedState = linkedState;
  }

  showChooseDeck(singleInvestigator?: Card, callback?: (code: string) => void) {
    this.actions.showChooseDeck(singleInvestigator, callback);
  }

  removeDeck(deck: Deck) {
    this.actions.removeDeck(deck);
  }

  removeInvestigator(investigator: Card) {
    this.actions.removeInvestigator(investigator);
  }

  startScenario(scenarioId: string) {
    this.actions.startScenario(scenarioId);
  }

  closeOnUndo(scenarioId: string) {
    return sumBy(
      filter(this.state.inputs, input => input.type !== 'campaign_link'),
      input => input.scenario === scenarioId ? 1 : 0
    ) === 1;
  }

  sideScenario(
    previousScenarioId: string
  ): GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput | undefined {
    const matchingEntry = find(
      this.state.inputs,
      input => input.type === 'start_side_scenario' && input.previousScenarioId === previousScenarioId
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

  setNumberChoices(id: string, value: NumberChoices, scenarioId?: string) {
    this.actions.setNumberChoices(id, value, scenarioId);
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

  undo(scenarioId: string) {
    const latestInput = findLast(this.state.inputs,
      input => input.scenario === scenarioId);
    if (latestInput &&
      latestInput.type === 'choice_list' &&
      latestInput.step.startsWith('$upgrade_decks#') &&
      !!latestInput.choices.deckId
    ) {
      // This is a deck upgrade action.
      Alert.alert(
        t`Undo deck upgrade`,
        t`Looks like you are trying to undo a deck upgrade.\n\nNote that the app will NOT delete your latest deck upgrade from ArkhamDB, so your deck will still have the earlier changes applied.\n\nYou can view the deck and delete the most recent 'upgrade' to put things back the way they were.`,
        [
          {
            text: t`Undo`,
            onPress: () => {
              this.actions.undo(scenarioId);
            },
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
    return findLast(
      this.state.inputs,
      input => (
        input.type === type &&
        input.scenario === scenario && (
          input.type === 'start_scenario' ||
          input.type === 'start_side_scenario' ||
          input.step === step
        )
      )
    );
  }

  private linkedEntry(
    type: string,
    step?: string
  ): GuideInput | undefined {
    return findLast(
      this.linkedState ? this.linkedState.inputs : [],
      input => (
        input.type === type && (
          input.type === 'start_scenario' ||
          input.type === 'start_side_scenario' ||
          input.step === step
        )
      )
    );
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

  text(id: string, scenario?: string): string | undefined {
    const entry = this.entry('text', id, scenario);
    if (entry && entry.type === 'text') {
      return entry.text;
    }
    return undefined;
  }

  numberChoices(id: string, scenario?: string): NumberChoices | undefined {
    const entry = this.entry('choice_list', id, scenario);
    if (entry && entry.type === 'choice_list') {
      return entry.choices;
    }
    return undefined;
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
