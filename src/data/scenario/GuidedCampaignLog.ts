import {
  cloneDeep,
  flatMap,
  find,
  findIndex,
  filter,
  forEach,
  keys,
  map,
  sumBy,
  uniq,
  zip,
} from 'lodash';

import { Slots, TraumaAndCardData } from 'actions/types';
import { ChaosBag } from 'constants';
import {
  AddRemoveChaosTokenEffect,
  AddCardEffect,
  CampaignDataEffect,
  CampaignLogEffect,
  CampaignLogCountEffect,
  CampaignLogCardsEffect,
  Difficulty,
  EarnXpEffect,
  Effect,
  EffectsWithInput,
  InvestigatorStatus,
  InvestigatorSelector,
  RemoveCardEffect,
  ReplaceCardEffect,
  ScenarioDataEffect,
  ScenarioStatus,
  TraumaEffect,
} from './types';
import CampaignGuide from './CampaignGuide';
import Card, { CardsMap } from 'data/Card';

interface BasicEntry {
  id: string;
}

interface CampaignLogCard {
  card: string;
  count: number;
}
interface CampaignLogCardEntry extends BasicEntry {
  type: 'card';
  cards: CampaignLogCard[];
}

interface CampaignLogCountEntry extends BasicEntry {
  type: 'count';
  count: number;
}

interface CampaignLogBasicEntry extends BasicEntry {
  type: 'basic';
}

export type CampaignLogEntry = CampaignLogCountEntry |
  CampaignLogBasicEntry |
  CampaignLogCardEntry;

export interface EntrySection {
  entries: CampaignLogEntry[];
  crossedOut: {
    [key: string]: true | undefined;
  };
  sectionCrossedOut?: boolean;
}

export interface InvestigatorSection {
  [code: string]: EntrySection;
}

interface CountSection {
  count: number;
}

interface PlayingScenarioItem {
  investigator: string;
}
interface ScenarioData {
  resolution?: string;
  leadInvestigator?: string;
  playingScenario?: PlayingScenarioItem[];
  investigatorStatus: {
    [code: string]: InvestigatorStatus;
  };
}

interface CampaignData {
  scenarioStatus: {
    [code: string]: ScenarioStatus | undefined;
  };
  scenarioReplayCount: {
    [code: string]: number | undefined;
  };
  result?: 'win' | 'lose' | 'survived';
  difficulty?: Difficulty;
  nextScenario?: string;
  investigatorData: {
    [code: string]: TraumaAndCardData | undefined;
  };
  lastSavedInvestigatorData: {
    [code: string]: TraumaAndCardData | undefined;
  };
}

export default class GuidedCampaignLog {
  scenarioId?: string;
  sections: {
    [section: string]: EntrySection | undefined;
  };
  countSections: {
    [section: string]: CountSection | undefined;
  };
  investigatorSections: {
    [section: string]: InvestigatorSection | undefined;
  };
  scenarioData: {
    [scenario: string]: ScenarioData | undefined;
  };
  latestScenarioData: ScenarioData;
  campaignData: CampaignData;
  campaignGuide: CampaignGuide;
  chaosBag: ChaosBag;
  investigatorCards: CardsMap;

  static isCampaignLogEffect(effect: Effect): boolean {
    switch (effect.type) {
      case 'campaign_log':
      case 'campaign_log_count':
      case 'campaign_log_cards':
      case 'scenario_data':
      case 'campaign_data':
      case 'add_chaos_token':
      case 'remove_chaos_token':
      case 'trauma':
      case 'add_card':
      case 'remove_card':
      case 'replace_card':
      case 'earn_xp':
      case 'upgrade_decks':
        return true;
      default:
        return false;
    }
  }

  constructor(
    effectsWithInput: EffectsWithInput[],
    campaignGuide: CampaignGuide,
    investigatorCards: CardsMap,
    readThrough?: GuidedCampaignLog,
    scenarioId?: string
  ) {
    this.scenarioId = scenarioId;
    this.campaignGuide = campaignGuide;
    this.investigatorCards = investigatorCards;

    const hasRelevantEffects = !!find(
      effectsWithInput,
      effects => !!find(
        effects.effects,
        effect => GuidedCampaignLog.isCampaignLogEffect(effect)
      )
    );
    if (!readThrough) {
      this.sections = {};
      this.countSections = {};
      this.investigatorSections = {};
      this.scenarioData = {};
      this.campaignData = {
        scenarioStatus: {},
        scenarioReplayCount: {},
        investigatorData: {},
        lastSavedInvestigatorData: {},
      };
      this.chaosBag = {};
      this.latestScenarioData = {
        investigatorStatus: {},
      };
      forEach(campaignGuide.campaign.campaign.campaign_log, log => {
        switch (log.type) {
          case 'count':
            this.countSections[log.id] = { count: 0 };
            break;
          case 'supplies':
            this.investigatorSections[log.id] = {};
            break;
          case 'hidden':
            break;
          default:
            this.sections[log.id] = {
              entries: [],
              crossedOut: {},
            };
            break;
        }
      });
    } else if (!hasRelevantEffects) {
      // No relevant effects, so shallow copy will do.
      this.sections = readThrough.sections;
      this.countSections = readThrough.countSections;
      this.investigatorSections = readThrough.investigatorSections;
      this.scenarioData = readThrough.scenarioData;
      this.campaignData = readThrough.campaignData;
      this.chaosBag = readThrough.chaosBag;
      this.latestScenarioData = readThrough.latestScenarioData;
    } else {
      this.sections = cloneDeep(readThrough.sections);
      this.countSections = cloneDeep(readThrough.countSections);
      this.investigatorSections = cloneDeep(readThrough.investigatorSections);
      this.scenarioData = cloneDeep(readThrough.scenarioData);
      this.chaosBag = cloneDeep(readThrough.chaosBag);
      this.campaignData = cloneDeep(readThrough.campaignData);
      this.latestScenarioData = cloneDeep(readThrough.latestScenarioData);
    }
    if (hasRelevantEffects) {
      forEach(effectsWithInput, ({ effects, input, numberInput }) => {
        forEach(effects, effect => {
          switch (effect.type) {
            case 'campaign_data':
              this.handleCampaignDataEffect(effect);
              break;
            case 'scenario_data':
              this.handleScenarioDataEffect(effect, scenarioId, input, numberInput);
              break;
            case 'campaign_log':
              this.handleCampaignLogEffect(effect, input);
              break;
            case 'campaign_log_count': {
              this.handleCampaignLogCountEffect(
                effect,
                numberInput && numberInput.length ? numberInput[0] : undefined
              );
              break;
            }
            case 'campaign_log_cards':
              this.handleCampaignLogCardsEffect(effect, input, numberInput);
              break;
            case 'add_chaos_token':
            case 'remove_chaos_token':
              this.handleAddRemoveChaosTokenEffect(effect);
              break;
            case 'trauma':
              this.handleTraumaEffect(effect, input);
              break;
            case 'add_card':
              this.handleAddCardEffect(effect, input);
              break;
            case 'remove_card':
              this.handleRemoveCardEffect(effect, input);
              break;
            case 'replace_card':
              this.handleReplaceCardEffect(effect);
              break;
            case 'earn_xp':
              this.handleEarnXpEffect(effect, input, numberInput);
              break;
            case 'upgrade_decks':
              this.handleUpgradeDecksEffect();
              break;
            default:
              break;
          }
        });
      });
    }
  }

  leadInvestigatorChoice(): string {
    if (this.scenarioId === undefined) {
      throw new Error('Lead investigator called outside of a scenario.');
    }
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario || !scenario.leadInvestigator) {
      throw new Error('Lead Investigator called before decision');
    }
    return scenario.leadInvestigator;
  }

  traumaAndCardData(investigator: string): TraumaAndCardData {
    return this.campaignData.investigatorData[investigator] || {};
  }

  isEliminated(investigator: Card) {
    const investigatorData = this.campaignData.investigatorData[investigator.code];
    return investigator.eliminated(investigatorData);
  }

  isKilled(
    investigator: string
  ): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    const card = this.investigatorCards[investigator];
    if (card) {
      return card.killed(investigatorData);
    }
    return !!(investigatorData && investigatorData.killed);
  }

  hasPhysicalTrauma(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(investigatorData && (investigatorData.physical || 0) > 0);
  }

  hasMentalTrauma(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(investigatorData && (investigatorData.mental || 0) > 0);
  }

  isDefeated(investigator: string): boolean {
    const status = this.investigatorResolutionStatus()[investigator];
    return status === 'physical' || status === 'mental' || status === 'eliminated';
  }

  hasCard(investigator: string, card: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(
      investigatorData &&
      find(investigatorData.storyAssets || [], asset => asset === card)
    );
  }

  investigatorResolutionStatus(): { [code: string]: InvestigatorStatus } {
    if (this.scenarioId === undefined) {
      throw new Error('investigatorResolutionStatus called outside of a scenario.');
    }
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario) {
      throw new Error('investigatorResolutionStatus called before decision');
    }
    return scenario.investigatorStatus;
  }

  scenarioStatus(scenarioId: string): ScenarioStatus {
    return this.campaignData.scenarioStatus[scenarioId] || 'not_started';
  }

  nextScenario(): string | undefined {
    if (this.campaignData.nextScenario) {
      // The campaign told us where to go next!
      return this.campaignData.nextScenario;
    }
    if (this.scenarioId === undefined) {
      // We haven't started yet, so the prologue/first scenario is first.
      return this.campaignGuide.campaign.campaign.scenarios[0];
    }
    const scenarios = this.campaignGuide.campaign.campaign.scenarios;
    const currentIndex = findIndex(
      scenarios,
      scenarioId => this.scenarioId === scenarioId
    );
    if (currentIndex !== -1 && currentIndex + 1 < scenarios.length) {
      return scenarios[currentIndex + 1];
    }
    return undefined;
  }

  sectionExists(sectionId: string): boolean {
    const section = this.sections[sectionId];
    if (!section) {
      return false;
    }
    return !section.sectionCrossedOut;
  }

  check(sectionId: string, id: string): boolean {
    const section = this.sections[sectionId];
    if (!section) {
      return false;
    }
    if (section.crossedOut[id]) {
      return false;
    }
    const entry = find(section.entries, entry => entry.id === id);
    return !!entry;
  }

  resolution(): string {
    const playing = this.latestScenarioData.playingScenario;
    if (!playing || !this.latestScenarioData.resolution) {
      throw new Error('Resolution accessed before it was set.');
    }
    return this.latestScenarioData.resolution;
  }

  playerCount(): number {
    const playing = this.latestScenarioData.playingScenario;
    if (!playing) {
      throw new Error('Player count accessed before it was set.');
    }
    return playing.length;
  }

  investigatorCodesSafe() {
    const playing = this.latestScenarioData.playingScenario;
    if (!playing) {
      return [];
    }
    return map(playing, ({ investigator }) => investigator);
  }

  investigatorCodes(
    includeEliminated: boolean
  ): string[] {
    const playing = this.latestScenarioData.playingScenario;
    if (!playing) {
      throw new Error('Investigator codes accessed before they were set.');
    }
    return filter(
      map(playing, ({ investigator }) => investigator),
      code => {
        if (includeEliminated) {
          return true;
        }
        const card = this.investigatorCards[code];
        return !!card && !this.isEliminated(card);
      }
    );
  }

  investigators(includeEliminated: boolean): Card[] {
    return flatMap(
      this.investigatorCodes(includeEliminated),
      code => this.investigatorCards[code]
    );
  }

  count(sectionId: string, id: string): number {
    if (id === '$count') {
      const section = this.countSections[sectionId];
      if (section) {
        return section.count;
      }
      return 0;
    }

    const section = this.sections[sectionId];
    if (section) {
      if (id === '$num_entries') {
        return sumBy(
          section.entries,
          entry => section.crossedOut[entry.id] ? 0 : 1
        );
      }
      if (section.crossedOut[id]) {
        return 0;
      }
      const entry = find(section.entries, entry => entry.id === id);
      if (entry && entry.type === 'count') {
        return entry.count;
      }
    }
    return 0;
  }

  private getInvestigators(
    investigator: InvestigatorSelector,
    input?: string[]
  ): string[] {
    switch (investigator) {
      case 'lead_investigator':
        return [this.leadInvestigatorChoice()];
      case 'all':
        if (!this.latestScenarioData) {
          throw new Error('All investigators called before being set');
        }
        return this.investigatorCodes(false);
      case 'defeated':
      case 'not_resigned': {
        const result: string[] = [];
        forEach(this.investigatorResolutionStatus(), (status, code) => {
          switch (status) {
            case 'alive':
              if (investigator === 'not_resigned') {
                result.push(code);
              }
              break;
            case 'physical':
            case 'mental':
            case 'eliminated':
              result.push(code);
              break;
            case 'resigned':
              break;
          }
        });
        return result;
      }
      case '$input_value':
        return input || [];
      case 'any':
      case 'choice':
        // These are rewritten in ScenarioStep
        throw new Error('should not happen');
    }
  }

  earnedXp(code: string): number {
    const data = this.campaignData.investigatorData[code] || {};
    const lastSavedData = this.campaignData.lastSavedInvestigatorData[code] || {};
    return (data.availableXp || 0) - (lastSavedData.availableXp || 0);
  }

  private storyAssetSlots(data: TraumaAndCardData): Slots {
    const slots: Slots = {};
    forEach(data.storyAssets || {}, asset => {
      if (!slots[asset]) {
        slots[asset] = 0;
      }
      slots[asset] = slots[asset] + 1;
    });
    return slots;
  }

  storyAssets(code: string): Slots {
    return this.storyAssetSlots(this.campaignData.investigatorData[code] || {});
  }

  storyAssetChanges(code: string): Slots {
    const currentSlots = this.storyAssets(code);
    const previousSlots = this.storyAssetSlots(this.campaignData.lastSavedInvestigatorData[code] || {});

    const slotDelta: Slots = {};
    forEach(
      uniq([...keys(currentSlots), ...keys(previousSlots)]),
      code => {
        const previousCount = previousSlots[code] || 0;
        const newCount = currentSlots[code] || 0;
        const delta = (newCount - previousCount);
        if (delta !== 0) {
          slotDelta[code] = delta;
        }
      }
    );
    return slotDelta;
  }

  private handleUpgradeDecksEffect() {
    this.campaignData.lastSavedInvestigatorData = cloneDeep(this.campaignData.investigatorData);
  }

  private handleEarnXpEffect(
    effect: EarnXpEffect,
    input?: string[],
    numberInput?: number[]
  ) {
    const baseXp = numberInput ? numberInput[0] : 0;
    const totalXp = baseXp + (effect.bonus || 0);
    forEach(
      this.getInvestigators(effect.investigator, input),
      investigator => {
        const data = this.campaignData.investigatorData[investigator] || {};
        this.campaignData.investigatorData[investigator] = {
          ...data,
          availableXp: (data.availableXp || 0) + totalXp,
        };
      }
    );
  }

  private handleAddCardEffect(
    effect: AddCardEffect,
    input?: string[]
  ) {
    const investigators = this.getInvestigators(
      effect.investigator,
      input
    );
    forEach(investigators, investigator => {
      const data = this.campaignData.investigatorData[investigator] || {};
      const assets = data.storyAssets || [];
      assets.push(effect.card);
      data.storyAssets = uniq(assets);
      this.campaignData.investigatorData[investigator] = data;
    });
  }

  private handleReplaceCardEffect(
    effect: ReplaceCardEffect
  ) {
    forEach(
      keys(this.campaignData.investigatorData),
      investigator => {
        const data = this.campaignData.investigatorData[investigator];
        if (data) {
          this.campaignData.investigatorData[investigator] = {
            ...data,
            storyAssets: map(
              data.storyAssets || [],
              card => card === effect.old_card ? effect.new_card : card
            ),
          };
        }
      }
    );
  }

  private handleRemoveCardEffect(
    effect: RemoveCardEffect,
    input?: string[]
  ) {
    const cards = new Set(effect.card === '$input_value' ? input : [effect.card]);
    const investigatorRestriction = effect.investigator ?
      new Set(this.getInvestigators(effect.investigator, input)) :
      undefined;
    forEach(
      keys(this.campaignData.investigatorData),
      investigator => {
        const data = this.campaignData.investigatorData[investigator];
        if (data) {
          if (!investigatorRestriction || investigatorRestriction.has(investigator)) {
            this.campaignData.investigatorData[investigator] = {
              ...data,
              storyAssets: filter(data.storyAssets || [], card => !cards.has(card)),
            };
          }
        }
      }
    );
  }

  private handleTraumaEffect(
    effect: TraumaEffect,
    input?: string[]
  ) {
    const investigators = this.getInvestigators(effect.investigator, input);
    forEach(investigators, code => {
      const trauma: TraumaAndCardData = this.campaignData.investigatorData[code] || {};
      if (effect.killed) {
        trauma.killed = true;
      }
      if (effect.insane) {
        trauma.insane = true;
      }
      if (effect.physical) {
        trauma.physical = (trauma.physical || 0) + effect.physical;
      }
      if (effect.mental) {
        trauma.mental = (trauma.mental || 0) + effect.mental;
      }
      if (effect.mental_or_physical) {
        throw new Error('These should be filtered out before it reaches campaign log');
      }

      this.campaignData.investigatorData[code] = trauma;
    });
  }

  private handleAddRemoveChaosTokenEffect(effect: AddRemoveChaosTokenEffect) {
    forEach(effect.tokens, token => {
      const currentCount = this.chaosBag[token] || 0;
      if (effect.type === 'add_chaos_token') {
        this.chaosBag[token] = currentCount + 1;
      } else {
        this.chaosBag[token] = Math.max(0, currentCount - 1);
      }
      if (this.chaosBag[token] === 0) {
        delete this.chaosBag[token];
      }
    });
  }

  private handleCampaignDataEffect(effect: CampaignDataEffect) {
    switch (effect.setting) {
      case 'result':
        this.campaignData.result = effect.value;
        break;
      case 'difficulty':
        this.campaignData.difficulty = effect.value;
        break;
      case 'skip_scenario':
        this.campaignData.scenarioStatus[effect.scenario] = 'skipped';
        break;
      case 'replay_scenario': {
        const replayCount = this.campaignData.scenarioReplayCount[effect.scenario] || 0;
        this.campaignData.scenarioReplayCount[effect.scenario] = replayCount + 1;
        break;
      }
      case 'next_scenario':
        this.campaignData.nextScenario = effect.scenario;
        break;
    }
  }

  private handleScenarioDataEffect(
    effect: ScenarioDataEffect,
    scenarioId?: string,
    input?: string[]
  ) {
    if (scenarioId === undefined) {
      throw new Error(`Cannot set scenario_data effects outside of scenarios.`);
    }
    if (effect.setting === 'scenario_status') {
      if (this.campaignData.nextScenario === scenarioId && effect.status === 'started') {
        this.campaignData.nextScenario = undefined;
      }
      this.campaignData.scenarioStatus[scenarioId] = effect.status;

      if (effect.status === 'resolution') {
        const scenario = this.scenarioData[scenarioId] || {
          investigatorStatus: {},
        };
        scenario.resolution = effect.resolution;
        this.scenarioData[scenarioId] = scenario;
        this.latestScenarioData = scenario;
      }
      return;
    }
    // All investigator status from here on out.
    const scenario = this.scenarioData[scenarioId] || {
      investigatorStatus: {},
    };

    if (effect.investigator !== '$input_value') {
      throw new Error('investigator_status should always be $input_value');
    }
    if (!input) {
      throw new Error('input required for scenarioData effect');
    }
    switch (effect.setting) {
      case 'investigator_status':
        forEach(input, code => {
          scenario.investigatorStatus[code] = effect.investigator_status;
        });
        break;
      case 'playing_scenario': {
        const playing: PlayingScenarioItem[] = map(
          input || [],
          investigator => {
            return {
              investigator,
            };
          }
        );
        scenario.playingScenario = playing;
        break;
      }
      case 'lead_investigator':
        scenario.leadInvestigator = input[0];
        break;
    }
    this.scenarioData[scenarioId] = scenario;
    this.latestScenarioData = scenario;
  }

  private handleCampaignLogEffect(effect: CampaignLogEffect, input?: string[]) {
    const section: EntrySection = this.sections[effect.section] || {
      entries: [],
      crossedOut: {},
    };
    const ids = (effect.id === '$input_value') ? input : [effect.id];
    forEach(ids, id => {
      if (effect.cross_out) {
        section.crossedOut[id] = true;
      } else {
        section.entries.push({
          type: 'basic',
          id,
        });
      }
    });
    this.sections[effect.section] = section;
  }

  private updateSectionWithCount(
    section: EntrySection,
    id: string,
    effect: CampaignLogCountEffect,
    value: number
  ): EntrySection {
    // Normal entry
    const entry = find(section.entries, entry => entry.id === effect.id);
    const count = (entry && entry.type === 'count') ? entry.count : 0;
    switch (effect.operation) {
      case 'add':
      case 'add_input':
        if (entry && entry.type === 'count') {
          entry.count = count + value;
        } else {
          section.entries.push({
            type: 'count',
            id,
            count: count + value,
          });
        }
        break;
      case 'set':
      case 'set_input':
        if (entry && entry.type === 'count') {
          entry.count = value;
        } else {
          section.entries.push({
            type: 'count',
            id,
            count: value,
          });
        }
        break;
    }
    return section;
  }

  private handleCampaignLogCountEffect(effect: CampaignLogCountEffect, numberInput?: number) {
    const value: number = (
      (effect.operation === 'add_input' || effect.operation === 'set_input') ?
        numberInput :
        effect.value
    ) || 0;
    if (!effect.id) {
      // Section entry
      const section = this.countSections[effect.section] || {
        count: 0,
      };
      const count = section.count;
      switch (effect.operation) {
        case 'add':
        case 'add_input':
          section.count = count + value;
          break;
        case 'set':
        case 'set_input':
          section.count = value;
          break;
      }
      this.countSections[effect.section] = section;
    } else if (effect.investigator) {
      const investigatorSection = this.investigatorSections[effect.section] || {};
      const section = investigatorSection[effect.investigator] || {
        entries: [],
        crossedOut: {},
      };
      investigatorSection[effect.investigator] = this.updateSectionWithCount(
        section,
        effect.id,
        effect,
        value
      );
      this.investigatorSections[effect.section] = investigatorSection;
    } else {
      const section = this.sections[effect.section] || {
        entries: [],
        crossedOut: {},
      };

      this.sections[effect.section] = this.updateSectionWithCount(
        section,
        effect.id,
        effect,
        value
      );
    }
  }

  private cardsIds(effect: CampaignLogCardsEffect, input?: string[]): string[] | undefined {
    if (effect.id === '$input_value') {
      if (input === undefined) {
        throw new Error(`Cannot read unset $input_value: ${effect.id}`);
      }
      return input;
    }
    if (effect.id) {
      return [effect.id];
    }
    return undefined;
  }

  private handleCampaignLogCardsEffect(
    effect: CampaignLogCardsEffect,
    input?: string[],
    numberInput?: number[]
  ) {
    const sectionIds: string[] = effect.section === '$input_value' ? (
      input || []
    ) : [effect.section];
    const ids: string[] | undefined = this.cardsIds(effect, input);
    forEach(sectionIds, sectionId => {
      const section: EntrySection = this.sections[sectionId] || {
        entries: [],
        crossedOut: {},
      };
      if (!ids) {
        // Section entry, probably just a cross out.
        if (effect.cross_out) {
          section.sectionCrossedOut = true;
        }
      } else {
        forEach(ids, id => {
          const cards: CampaignLogCard[] = [];
          if (effect.section === '$input_value') {
            cards.push({
              card: sectionId,
              count: 1,
            });
          } else if (effect.id === '$input_value') {
            cards.push({
              card: id,
              count: 1,
            });
          } else if (effect.cards) {
            switch (effect.cards) {
              case '$input_value':
                if (input && numberInput) {
                  forEach(zip(input, numberInput),
                    ([card, number]) => {
                      if (card && number) {
                        cards.push({
                          card,
                          count: number,
                        });
                      }
                    }
                  );
                } else {
                  forEach(input || [],
                    card => cards.push({
                      card,
                      count: 1,
                    }));
                }
                break;
              case '$lead_investigator':
                forEach(input || [],
                  card => cards.push({
                    card,
                    count: 1,
                  }));
                break;
            }
          } else {
            cards.push({
              card: id,
              count: 1,
            });
          }

          // Normal entry
          if (effect.cross_out) {
            section.crossedOut[id] = true;
          } else {
            const entry = find(section.entries, entry => entry.id === id);
            if (!entry) {
              section.entries.push({
                type: 'card',
                id,
                cards,
              });
            }
          }
        });
      }
      // Update the section
      this.sections[sectionId] = section;
    });
  }
}
