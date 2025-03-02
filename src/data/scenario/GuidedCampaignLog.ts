import {
  cloneDeep,
  flatMap,
  find,
  findLast,
  filter,
  forEach,
  keys,
  map,
  sortBy,
  sumBy,
  uniq,
  zip,
  last,
  pick,
  concat,
  dropRight,
} from 'lodash';

import {
  CampaignDifficulty,
  InvestigatorData,
  Slots,
  TraumaAndCardData,
  WeaknessSet,
} from '@actions/types';
import { ChaosBag, CHAOS_BAG_TOKEN_COUNTS } from '@app_constants';
import { traumaDelta } from '@lib/trauma';
import {
  AddRemoveChaosTokenEffect,
  AddCardEffect,
  CampaignDataEffect,
  CampaignLogEffect,
  CampaignLogCountEffect,
  CampaignLogCardsEffect,
  EarnXpEffect,
  Effect,
  EffectsWithInput,
  FreeformCampaignLogEffect,
  InvestigatorStatus,
  InvestigatorSelector,
  RemoveCardEffect,
  ReplaceCardEffect,
  ScenarioDataEffect,
  ScenarioStatus,
  TraumaEffect,
  GainSuppliesEffect,
  LoseSuppliesEffect,
  CampaignLogInvestigatorCountEffect,
  PartnerStatusEffect,
  Partner,
  PartnerStatus,
  SetCardCountEffect,
  ScarletKeyEffect,
  SaveDecksEffect,
  BackupStateEffect,
} from './types';
import CampaignGuide, { CAMPAIGN_SETUP_ID } from './CampaignGuide';
import Card, { CardsMap } from '@data/types/Card';
import { LatestDecks } from '@data/scenario';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import {
  INVESTIGATOR_PARTNER_CAMPAIGN_LOG_ID_PREFIX,
  PLAY_SCENARIO_STEP_ID,
  SELECTED_PARTNERS_CAMPAIGN_LOG_ID,
} from './fixedSteps';

interface BasicEntry {
  id: string;
  crossedOut?: boolean;
}

interface CampaignLogCard {
  card: string;
  count: number;
}
export interface CampaignLogCardEntry extends BasicEntry {
  type: 'card';
  cards: CampaignLogCard[];
}

interface CampaignLogCountEntry extends BasicEntry {
  type: 'count';
  count: number;
  otherCount?: number;
}

interface CampaignLogBasicEntry extends BasicEntry {
  type: 'basic';
}

const EMPTY_TRAUMA: TraumaAndCardData = {};

export interface CampaignLogFreeformEntry extends BasicEntry {
  type: 'freeform';
  text: string;
  interScenario?: {
    scenarioId: string;
    index: number;
  };
}

export type CampaignLogEntry =
  | CampaignLogCountEntry
  | CampaignLogBasicEntry
  | CampaignLogCardEntry
  | CampaignLogFreeformEntry;

export interface EntrySection {
  entries: CampaignLogEntry[];
  decoration?: {
    [key: string]: 'circle' | undefined;
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

interface KeyStatus {
  investigator?: string;
  enemy?: string;
}
interface ScenarioData {
  resolution?: string;
  leadInvestigator?: string;
  playScenarioStepId?: string;
  playingScenario?: PlayingScenarioItem[];
  investigatorStatus: {
    [code: string]: InvestigatorStatus;
  };
  partners?: {
    [code: string]: string;
  };
}

interface CampaignData {
  standalone: boolean;
  scenarios?: string[];
  scenarioStatus: {
    [code: string]: ScenarioStatus | undefined;
  };
  scenarioReplayCount: {
    [code: string]: number | undefined;
  };
  result?: 'win' | 'lose' | 'survived';
  difficulty?: CampaignDifficulty;
  nextScenario: string[];
  noSideScenario?: boolean;
  investigatorData: InvestigatorData;
  everyStoryAsset: string[];
  lastSavedInvestigatorData: {
    [code: string]: TraumaAndCardData | undefined;
  };
  redirect_experience: string;

  scarlet: {
    // TSK stuff;
    showMap?: boolean;
    embark?: boolean;
    location?: string;
    visitedLocations: string[];
    unlockedLocations: string[];
    unlockedDossiers: string[];
    keyStatus: { [key: string]: KeyStatus | undefined };
  };
}

export interface VisibleCalendarEntry {
  symbol: string;
  time: number;
}

type CampaignLogSections = {
  [section: string]: EntrySection | undefined;
};

type CampaignLogCountsSections = {
  [section: string]: CountSection | undefined;
};
type CampaignLogInvestigatorSections = {
  [section: string]: InvestigatorSection | undefined;
};

interface GuidedCampaignLogState {
  scenarioId?: string;
  sections: CampaignLogSections;
  countSections: CampaignLogCountsSections;
  investigatorSections: CampaignLogInvestigatorSections;
  scenarioData: {
    [scenario: string]: ScenarioData | undefined;
  };
  latestScenarioData: ScenarioData;
  campaignData: CampaignData;
  chaosBag: ChaosBag;
  swapChaosBag: ChaosBag;
}

export default class GuidedCampaignLog implements GuidedCampaignLogState {
  campaignGuide: CampaignGuide;
  linked: boolean;
  guideVersion: number;

  backupState?: GuidedCampaignLogState;

  // State
  scenarioId?: string;
  sections: CampaignLogSections;
  countSections: CampaignLogCountsSections;
  investigatorSections: CampaignLogInvestigatorSections;
  scenarioData: {
    [scenario: string]: ScenarioData | undefined;
  };
  latestScenarioData: ScenarioData;
  campaignData: CampaignData;
  chaosBag: ChaosBag;
  swapChaosBag: ChaosBag;

  static isCampaignLogEffect(effect: Effect): boolean {
    switch (effect.type) {
      case 'campaign_log':
      case 'campaign_log_count':
      case 'campaign_log_investigator_count':
      case 'campaign_log_cards':
      case 'freeform_campaign_log':
      case 'scenario_data':
      case 'campaign_data':
      case 'add_chaos_token':
      case 'remove_chaos_token':
      case 'trauma':
      case 'add_card':
      case 'set_card_count':
      case 'remove_card':
      case 'replace_card':
      case 'earn_xp':
      case 'upgrade_decks':
      case 'save_decks':
      case 'gain_supplies':
      case 'lose_supplies':
      case 'partner_status':
      case 'scarlet_key':
      case 'backup_state':
        return true;
      default:
        return false;
    }
  }

  constructor(
    effectsWithInput: EffectsWithInput[],
    campaignGuide: CampaignGuide,
    public campaignState: CampaignStateHelper,
    standalone: boolean,
    readThrough?: GuidedCampaignLog,
    scenarioId?: string
  ) {
    this.scenarioId = scenarioId;
    this.campaignGuide = campaignGuide;
    this.linked = !!campaignState.linkedState;
    this.guideVersion =
      campaignState.guideVersion === -1
        ? campaignGuide.campaignVersion()
        : campaignState.guideVersion;
    this.backupState = readThrough?.backupState;

    const hasRelevantEffects = !!find(
      effectsWithInput,
      (effects) =>
        !!find(effects.effects, (effect) =>
          GuidedCampaignLog.isCampaignLogEffect(effect)
        )
    );
    if (!readThrough) {
      this.sections = {};
      this.countSections = {};
      this.investigatorSections = {};
      this.scenarioData = {};
      this.campaignData = {
        standalone,
        nextScenario: [],
        scenarioStatus: {},
        scenarioReplayCount: {},
        investigatorData: {},
        lastSavedInvestigatorData: {},
        everyStoryAsset: [],
        redirect_experience: '',
        scarlet: {
          visitedLocations: [],
          unlockedLocations: [],
          unlockedDossiers: [],
          keyStatus: {},
        },
      };
      this.chaosBag = {};
      this.swapChaosBag = {};
      this.latestScenarioData = {
        investigatorStatus: {},
      };
      forEach(campaignGuide.campaignLogSections(), (log) => {
        if (!log.hidden) {
          switch (log.type) {
            case 'count':
              this.countSections[log.id] = { count: 0 };
              break;
            case 'supplies':
              this.investigatorSections[log.id] = {};
              break;
            default:
              this.sections[log.id] = {
                entries: [],
              };
              break;
          }
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
      this.swapChaosBag = readThrough.swapChaosBag;
      this.latestScenarioData = readThrough.latestScenarioData;
    } else {
      this.sections = cloneDeep(readThrough.sections);
      this.countSections = cloneDeep(readThrough.countSections);
      this.investigatorSections = cloneDeep(readThrough.investigatorSections);
      this.scenarioData = cloneDeep(readThrough.scenarioData);
      this.chaosBag = cloneDeep(readThrough.chaosBag);
      this.swapChaosBag = cloneDeep(readThrough.swapChaosBag);
      this.campaignData = cloneDeep(readThrough.campaignData);
      this.latestScenarioData = cloneDeep(readThrough.latestScenarioData);

      if (
        scenarioId &&
        this.campaignData.nextScenario.length &&
        last(this.campaignData.nextScenario) === scenarioId
      ) {
        this.campaignData.nextScenario = dropRight(
          this.campaignData.nextScenario,
          1
        );
      }
    }
    if (hasRelevantEffects) {
      forEach(effectsWithInput, ({ effects, input, numberInput }) => {
        forEach(effects, (effect) => {
          switch (effect.type) {
            case 'backup_state':
              this.handleBackupState(effect);
              break;
            case 'lose_supplies':
              this.handleLoseSuppliesEffect(effect);
              break;
            case 'gain_supplies':
              this.handleGainSuppliesEffect(effect, input);
              break;
            case 'campaign_data':
              this.handleCampaignDataEffect(effect);
              break;
            case 'scenario_data':
              this.handleScenarioDataEffect(effect, scenarioId, input);
              break;
            case 'freeform_campaign_log':
              this.handleFreeformCampaignLogEffect(effect, input);
              break;
            case 'campaign_log':
              this.handleCampaignLogEffect(effect, input);
              break;
            case 'campaign_log_investigator_count':
              this.handleCampaignLogInvestigatorCountEffect(
                effect,
                input,
                numberInput && numberInput.length ? numberInput[0] : undefined
              );
              break;
            case 'campaign_log_count':
              this.handleCampaignLogCountEffect(
                effect,
                numberInput && numberInput.length ? numberInput[0] : undefined
              );
              break;
            case 'campaign_log_cards':
              this.handleCampaignLogCardsEffect(effect, input, numberInput);
              break;
            case 'add_chaos_token':
            case 'remove_chaos_token':
              this.handleAddRemoveChaosTokenEffect(effect);
              break;
            case 'trauma':
              this.handleTraumaEffect(effect, input, numberInput);
              break;
            case 'set_card_count':
              this.handleSetCardCountEffect(effect, input);
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
              if (this.campaignData.redirect_experience) {
                const count_effect: CampaignLogInvestigatorCountEffect = {
                  type: 'campaign_log_investigator_count',
                  section: this.campaignData.redirect_experience,
                  id: '$count',
                  investigator: effect.investigator,
                  fixed_investigator: effect.fixed_investigator,
                  operation: 'add',
                  value:
                    (effect.bonus || 0) +
                    (numberInput?.length ? numberInput[0] : 0),
                };
                this.handleCampaignLogInvestigatorCountEffect(count_effect);
              } else {
                this.handleEarnXpEffect(effect, input, numberInput);
              }
              break;
            case 'upgrade_decks':
              this.handleUpgradeDecksEffect();
              break;
            case 'save_decks':
              this.handleSaveDecksEffect(effect);
              break;
            case 'partner_status':
              this.handlePartnerStatusEffect(effect, input);
              break;
            case 'scarlet_key':
              this.handleScarletKeyEffect(effect, input);
              break;
            default:
              break;
          }
        });
      });
    }
  }

  handleBackupState(effect: BackupStateEffect) {
    switch (effect.operation) {
      case 'save':
        this.backupState = {
          scenarioId: this.scenarioId,
          sections: cloneDeep(this.sections),
          countSections: cloneDeep(this.countSections),
          investigatorSections: cloneDeep(this.investigatorSections),
          scenarioData: cloneDeep(this.scenarioData),
          latestScenarioData: cloneDeep(this.latestScenarioData),
          campaignData: cloneDeep(this.campaignData),
          chaosBag: cloneDeep(this.chaosBag),
          swapChaosBag: cloneDeep(this.swapChaosBag),
        };
        break;
      case 'restore':
        if (this.backupState) {
          this.scenarioId = this.backupState.scenarioId;
          this.sections = cloneDeep(this.backupState.sections);
          this.countSections = cloneDeep(this.backupState.countSections);
          this.investigatorSections = cloneDeep(
            this.backupState.investigatorSections
          );
          this.scenarioData = cloneDeep(this.backupState.scenarioData);
          this.latestScenarioData = cloneDeep(
            this.backupState.latestScenarioData
          );
          this.campaignData = cloneDeep(this.backupState.campaignData);
          this.chaosBag = cloneDeep(this.backupState.chaosBag);
          this.swapChaosBag = cloneDeep(this.backupState.swapChaosBag);
        }
        this.backupState = undefined;
        break;
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

  private leadInvestigatorChoiceSafe(): string | undefined {
    if (this.scenarioId === undefined) {
      return undefined;
    }
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario || !scenario.leadInvestigator) {
      return undefined;
    }
    return scenario.leadInvestigator;
  }

  hasInvestigatorPlayedScenario(investigator: Card) {
    return !!find(this.scenarioData, (scenarioData, scenario) => {
      if (scenario === CAMPAIGN_SETUP_ID) {
        // campaign setup is probably okay?
        return false;
      }
      return !!find(
        (scenarioData && scenarioData.playingScenario) || [],
        (playing) => playing.investigator === investigator.code
      );
    });
  }

  traumaAndCardData(investigator: string): TraumaAndCardData {
    return this.campaignData.investigatorData[investigator] || EMPTY_TRAUMA;
  }

  hasPartnerStatus(
    sectionId: string,
    partner: Partner,
    status: PartnerStatus
  ): boolean {
    const trauma = this.traumaAndCardData(partner.code);
    switch (status) {
      case 'eliminated':
      case 'alive': {
        const resolute = !!find(
          trauma.storyAssets || [],
          (s) => s === 'resolute'
        );
        const health = (resolute && partner.resolute_health) || partner.health;
        const sanity = (resolute && partner.resolute_sanity) || partner.sanity;

        const eliminated =
          trauma.killed ||
          (trauma.physical || 0) >= health ||
          (trauma.mental || 0) >= sanity;
        return status === 'eliminated' ? eliminated : !eliminated;
      }
      case 'has_damage':
        return (trauma.physical || 0) > 0;
      case 'has_horror':
        return (trauma.mental || 0) > 0;
      case 'mia':
      case 'safe':
      case 'resolute':
      case 'victim':
      case 'cannot_take':
        return !!find(trauma.storyAssets || [], (s) => s === status);
      case 'investigator_selected': {
        const entry = findLast(
          this.sections[sectionId]?.entries,
          (entry) =>
            entry.id === SELECTED_PARTNERS_CAMPAIGN_LOG_ID &&
            entry.type === 'card'
        );
        const cards = map(
          entry?.type === 'card' ? entry.cards : [],
          (card) => card.card
        );
        return !!find(cards, (code) => code === partner.code);
      }
      case 'investigator_defeated': {
        const investigators = filter(
          this.investigatorCodes(true),
          (investigator) => this.isDefeated(investigator)
        );
        return !!find(investigators, (investigator) => {
          const entry = findLast(
            this.sections[sectionId]?.entries || [],
            (entry) =>
              entry.id ===
                `${INVESTIGATOR_PARTNER_CAMPAIGN_LOG_ID_PREFIX}${investigator}` &&
              entry.type === 'card'
          );
          return !!find(
            entry?.type === 'card' ? entry.cards : [],
            (c) => c.card === partner.code
          );
        });
      }
    }
  }

  isEliminated(investigator: Card) {
    const investigatorData =
      this.campaignData.investigatorData[investigator.code];
    const actualInvestigator = this.campaignState.investigatorCard(investigator.code) ?? investigator;
    return actualInvestigator.eliminated(investigatorData);
  }

  isKilled(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    const card = this.campaignState.investigatorCard(investigator);
    if (card) {
      return card.killed(investigatorData);
    }
    return !!(investigatorData && investigatorData.killed);
  }

  isInsane(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    const card = this.campaignState.investigatorCard(investigator);
    if (card) {
      return card.insane(investigatorData);
    }
    return !!(investigatorData && investigatorData.insane);
  }

  hasPhysicalTrauma(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(investigatorData && (investigatorData.physical || 0) > 0);
  }

  hasMentalTrauma(investigator: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(investigatorData && (investigatorData.mental || 0) > 0);
  }

  resigned(investigator: string): boolean {
    const status = this.investigatorResolutionStatus()[investigator];
    return status === 'resigned';
  }

  isAlive(investigator: string): boolean {
    const status = this.investigatorResolutionStatus()[investigator];
    return status === 'alive';
  }

  isDefeated(investigator: string): boolean {
    const status = this.investigatorResolutionStatus()[investigator];
    return status !== 'alive' && status !== 'resigned';
  }

  hasCard(investigator: string, card: string): boolean {
    const investigatorData = this.campaignData.investigatorData[investigator];
    return !!(
      investigatorData &&
      find(investigatorData.storyAssets || [], (asset) => asset === card)
    );
  }

  investigatorResolutionStatus(): { [code: string]: InvestigatorStatus } {
    if (this.scenarioId === undefined) {
      throw new Error(
        'investigatorResolutionStatus called outside of a scenario.'
      );
    }
    const scenario = this.scenarioData[this.scenarioId];
    if (!scenario) {
      throw new Error('investigatorResolutionStatus called before decision');
    }
    return scenario.investigatorStatus;
  }

  currentPlayScenarioStepId(): string {
    if (!this.scenarioId) {
      return PLAY_SCENARIO_STEP_ID;
    }
    const scenario = this.scenarioData[this.scenarioId] || {
      investigatorStatus: {},
    };
    return scenario.playScenarioStepId ?? PLAY_SCENARIO_STEP_ID;
  }

  scenarioStatus(scenarioId: string): ScenarioStatus {
    return this.campaignData.scenarioStatus[scenarioId] || 'not_started';
  }

  campaignNextScenarioId(): string | undefined {
    if (this.campaignData.nextScenario.length) {
      const scenario = last(this.campaignData.nextScenario);
      if (this.scenarioId !== scenario) {
        // The campaign told us where to go next!
        return scenario;
      }
    }

    if (!this.scenarioId) {
      return CAMPAIGN_SETUP_ID;
    }
    if (this.scenarioId === CAMPAIGN_SETUP_ID) {
      // We haven't started yet, so the prologue/first scenario is first.
      return this.campaignGuide.prologueScenarioId(this.campaignData.scenarios);
    }

    const { scenarioId, replayAttempt } = this.campaignGuide.parseScenarioId(
      this.scenarioId
    );
    const newReplayCount = this.campaignData.scenarioReplayCount[scenarioId];
    if (newReplayCount && (!replayAttempt || replayAttempt < newReplayCount)) {
      return `${scenarioId}#${newReplayCount}`;
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

  allCards(sectionId: string, id?: string): string[] | undefined {
    const section = this.sections[sectionId];
    if (!section || section.sectionCrossedOut) {
      return undefined;
    }
    if (!id) {
      return flatMap(section.entries, (entry) => {
        if (entry.type === 'card') {
          return map(entry.cards || [], (card) => card.card);
        }
        return [];
      });
    }
    return flatMap(section.entries, (entry) => {
      if (entry.id === id && entry.type === 'card' && !entry.crossedOut) {
        return map(entry.cards || [], (card) => card.card);
      }
      return [];
    });
  }

  allCardCounts(sectionId: string, id?: string): number[] | undefined {
    const section = this.sections[sectionId];
    if (!section || section.sectionCrossedOut) {
      return undefined;
    }
    if (!id) {
      return flatMap(section.entries, (entry) => {
        if (entry.type === 'card') {
          return map(entry.cards || [], (card) => card.count);
        }
        return [];
      });
    }
    return flatMap(section.entries, (entry) => {
      if (entry.id === id && entry.type === 'card' && !entry.crossedOut) {
        return map(entry.cards || [], (card) => card.count);
      }
      return [];
    });
  }

  check(sectionId: string, id: string): boolean {
    const section = this.sections[sectionId];
    if (!section || section.sectionCrossedOut) {
      return false;
    }
    const entry = find(
      section.entries,
      (entry) => entry.id === id && !entry.crossedOut
    );
    return !!entry;
  }

  scenarioResolution(scenarioId: string): string | undefined {
    const data = this.scenarioData[scenarioId];
    return data && data.resolution;
  }

  hasResolution(): boolean {
    return !!this.latestScenarioData.resolution;
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
      throw new Error(
        `Player count accessed before it was set: ${this.scenarioId}`
      );
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

  investigatorCodes(includeEliminated: boolean): string[] {
    const playing = this.latestScenarioData.playingScenario;
    if (!playing) {
      throw new Error('Investigator codes accessed before they were set.');
    }
    const leadInvestigatorCode = this.leadInvestigatorChoiceSafe();
    return sortBy(
      filter(
        map(playing, ({ investigator }) => investigator),
        (code) => {
          if (includeEliminated) {
            return true;
          }
          const card = this.campaignState.investigatorCard(code);
          return !!card && !this.isEliminated(card);
        }
      ),
      (code) => (code === leadInvestigatorCode ? 0 : 1)
    );
  }

  investigators(includeEliminated: boolean): Card[] {
    return flatMap(
      this.investigatorCodes(includeEliminated),
      (code) => this.campaignState.investigatorCard(code) ?? []
    );
  }

  calendarEntries(sectionId: string): VisibleCalendarEntry[] {
    const result: VisibleCalendarEntry[] = [];
    const section = find(
      this.campaignGuide.campaignLogSections(),
      (section) => section.id === sectionId
    );
    if (!section || section.type !== 'count' || !section.calendar) {
      return result;
    }
    forEach(section.calendar, (c) => {
      if (c.time) {
        result.push({
          time: c.time,
          symbol: c.symbol,
        });
      } else if (c.entry) {
        const count = this.count('hidden', c.entry);
        if (count) {
          result.push({
            time: count,
            symbol: c.symbol,
          });
        }
      }
    });
    return result;
  }

  count(sectionId: string, id: string): number {
    if (this.sections[sectionId]?.sectionCrossedOut) {
      return 0;
    }
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
        return sumBy(section.entries, (entry) => (entry.crossedOut ? 0 : 1));
      }
      const entry = find(
        section.entries,
        (entry) => entry.id === id && !entry.crossedOut
      );
      if (entry && entry.type === 'count') {
        return entry.count;
      }
    }
    return 0;
  }

  getInvestigators(
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
      case 'defeated': {
        const result: string[] = [];
        forEach(this.investigatorResolutionStatus(), (status, code) => {
          if (status !== 'alive' && status !== 'resigned') {
            result.push(code);
          }
        });
        return result;
      }
      case 'not_defeated': {
        const result: string[] = [];
        forEach(this.investigatorResolutionStatus(), (status, code) => {
          if (status === 'alive' || status === 'resigned') {
            result.push(code);
          }
        });
        return result;
      }
      case 'resigned': {
        const result: string[] = [];
        forEach(this.investigatorResolutionStatus(), (status, code) => {
          if (status === 'resigned') {
            result.push(code);
          }
        });
        return result;
      }
      case 'not_resigned': {
        const result: string[] = [];
        forEach(this.investigatorResolutionStatus(), (status, code) => {
          if (status !== 'resigned') {
            result.push(code);
          }
        });
        return result;
      }
      case '$input_value':
        return input || [];
      case 'any':
      case 'any_resigned':
      case 'choice':
      case '$fixed_investigator':
        // These are rewritten in ScenarioStep
        throw new Error(`should not happen: ${investigator}`);
    }
  }

  specialXp(code: string, special_xp: string): number {
    const specialXp =
      (this.campaignData.investigatorData[code] ?? {}).specialXp ?? {};
    return specialXp[special_xp] || 0;
  }

  totalXp(code: string): number {
    const data = this.campaignData.investigatorData[code] ?? {};
    return data.availableXp || 0;
  }

  earnedXp(code: string): number {
    const data = this.campaignData.investigatorData[code] ?? {};
    const lastSavedData =
      this.campaignData.lastSavedInvestigatorData[code] ?? {};
    const earnedXp = (data.availableXp || 0) - (lastSavedData.availableXp ?? 0);
    return earnedXp;
  }

  private baseSlots(): Slots {
    const slots: Slots = {};
    forEach(this.campaignData.everyStoryAsset, (asset) => {
      slots[asset] = 0;
    });
    return slots;
  }

  private storyAssetSlots(data: TraumaAndCardData): Slots {
    const slots: Slots = this.baseSlots();
    forEach(data.storyAssets || [], (asset) => {
      slots[asset] = data.cardCounts?.[asset] || 1;
    });
    return slots;
  }

  private ignoreStoryAssetSlots(data: TraumaAndCardData): Slots {
    const slots: Slots = this.baseSlots();
    forEach(data.ignoreStoryAssets || {}, (asset) => {
      if (!slots[asset]) {
        slots[asset] = 0;
      }
      slots[asset] = slots[asset] + 1;
    });
    return slots;
  }

  effectiveWeaknessSet(
    campaignInvestigators: Card[] | undefined,
    latestDecks: LatestDecks,
    campaignWeaknessSet: WeaknessSet,
    cards: CardsMap,
    unsavedAssignments: string[]
  ): WeaknessSet {
    const assignedCards: Slots = {};
    forEach(campaignInvestigators, (investigator) => {
      const investigatorAssignedCards: Slots = {};
      const deck = latestDecks[investigator.code];
      if (deck) {
        forEach(deck.deck.slots, (count, code) => {
          const card = cards[code];
          if (card && card.isBasicWeakness()) {
            investigatorAssignedCards[code] = count;
          }
        });
      }

      const storyAssets = this.storyAssets(investigator.code);
      forEach(storyAssets, (count, code) => {
        const card = cards[code];
        if (card && card.isBasicWeakness()) {
          if ((investigatorAssignedCards[code] || 0) <= count) {
            investigatorAssignedCards[code] = count;
          }
        }
      });

      forEach(investigatorAssignedCards, (count, code) => {
        assignedCards[code] = (assignedCards[code] || 0) + count;
      });
    });
    forEach(unsavedAssignments, (code) => {
      assignedCards[code] = (assignedCards[code] || 0) + 1;
    });

    return {
      ...campaignWeaknessSet,
      assignedCards,
    };
  }

  baseTrauma(code: string): TraumaAndCardData {
    return this.campaignData.lastSavedInvestigatorData[code] ?? {};
  }

  traumaChanges(code: string): TraumaAndCardData {
    const currentTrauma = this.traumaAndCardData(code);
    const previousTrauma = this.baseTrauma(code);
    return traumaDelta(currentTrauma, previousTrauma);
  }

  ignoreStoryAssets(code: string): Slots {
    return this.ignoreStoryAssetSlots(
      this.campaignData.investigatorData[code] ?? {}
    );
  }

  storyAssets(code: string): Slots {
    return this.storyAssetSlots(this.campaignData.investigatorData[code] ?? {});
  }

  exileCodes(code: string): string[] {
    return this.campaignData.investigatorData[code]?.exiledCards || [];
  }

  private nonStoryCardSlots(data: TraumaAndCardData): Slots {
    const slots: Slots = {};
    const addedCards: string[] = data.addedCards ?? [];
    forEach(addedCards, (card) => {
      slots[card] = (slots[card] ?? 0) + 1;
    });
    const removeCards: string[] = data.removedCards ?? [];
    forEach(removeCards, (card) => {
      slots[card] = (slots[card] ?? 0) - 1;
    });
    return slots;
  }

  private nonStoryCards(code: string): Slots {
    return this.nonStoryCardSlots(
      this.campaignData.investigatorData[code] ?? {}
    );
  }

  storyAssetChanges(code: string): Slots {
    const currentSlots = this.storyAssets(code);
    const previousSlots = this.storyAssetSlots(
      this.campaignData.lastSavedInvestigatorData[code] ?? {}
    );
    const currentNonStorySlots = this.nonStoryCards(code);
    const previousNonStorySlots = this.nonStoryCardSlots(
      this.campaignData.lastSavedInvestigatorData[code] || {}
    );
    const slotDelta: Slots = {};
    forEach(
      uniq([
        ...keys(currentSlots),
        ...keys(previousSlots),
        ...keys(currentNonStorySlots),
        ...keys(previousNonStorySlots),
      ]),
      (code) => {
        const previousCount =
          (previousSlots[code] || 0) + (previousNonStorySlots[code] || 0);
        const newCount =
          (currentSlots[code] || 0) + (currentNonStorySlots[code] || 0);
        const delta = newCount - previousCount;
        if (delta !== 0) {
          slotDelta[code] = delta;
        }
      }
    );
    return slotDelta;
  }

  private handleSaveDecksEffect(effect: SaveDecksEffect) {
    const investigatorData = cloneDeep(
      this.campaignData.lastSavedInvestigatorData || {}
    );
    forEach(this.campaignData.investigatorData, (data, code) => {
      const updatedData: TraumaAndCardData = {
        ...(investigatorData[code] ?? {}),
        storyAssets: [...(data?.storyAssets ?? [])],
        ignoreStoryAssets: [...(data?.ignoreStoryAssets ?? [])],
        addedCards: [...(data?.addedCards ?? [])],
        removedCards: [...(data?.removedCards ?? [])],
      };
      if (effect.adjust_xp) {
        updatedData.availableXp = data?.availableXp;
      }
      investigatorData[code] = updatedData;
    });
    this.campaignData.lastSavedInvestigatorData = investigatorData;
  }

  private handleUpgradeDecksEffect() {
    this.campaignData.lastSavedInvestigatorData = cloneDeep(
      this.campaignData.investigatorData
    );
  }

  private handleEarnXpEffect(
    effect: EarnXpEffect,
    input?: string[],
    numberInput?: number[]
  ) {
    if (
      effect.side_scenario_cost &&
      this.campaignGuide.campaignNoSideScenarioXp()
    ) {
      // This one is a freebie, because its paid for in other ways.
      return;
    }
    const baseXp =
      (effect.input_scale ?? 1) * (numberInput ? numberInput[0] : 0);
    const totalXp = baseXp + (effect.bonus ?? 0);
    forEach(
      this.getInvestigators(effect.investigator, input),
      (investigator) => {
        const data = this.campaignData.investigatorData[investigator] ?? {};
        if (effect.transfer_special_xp) {
          const specialXp = data.specialXp ?? {};
          const availableSpecialXp = specialXp[effect.transfer_special_xp] ?? 0;
          this.campaignData.investigatorData[investigator] = {
            ...data,
            availableXp: (data.availableXp ?? 0) + availableSpecialXp,
            specialXp: {
              ...specialXp,
              [effect.transfer_special_xp]: 0,
            },
          };
        } else if (effect.special_xp) {
          const specialXp = data.specialXp ?? {};
          const availableSpecialXp =
            (specialXp[effect.special_xp] ?? 0) + totalXp;
          if (availableSpecialXp >= 0) {
            this.campaignData.investigatorData[investigator] = {
              ...data,
              specialXp: {
                ...specialXp,
                [effect.special_xp]: availableSpecialXp,
              },
            };
          } else {
            // We try to spend special XP first, but then spend regular XP.
            this.campaignData.investigatorData[investigator] = {
              ...data,
              specialXp: {
                ...specialXp,
                [effect.special_xp]: 0,
              },
              availableXp: (data.availableXp ?? 0) + availableSpecialXp,
            };
          }
        } else {
          this.campaignData.investigatorData[investigator] = {
            ...data,
            availableXp: (data.availableXp ?? 0) + totalXp,
          };
        }
      }
    );
  }

  private handleSetCardCountEffect(
    effect: SetCardCountEffect,
    input?: string[]
  ) {
    this.campaignData.everyStoryAsset = uniq([
      ...this.campaignData.everyStoryAsset,
      effect.card,
    ]);
    const investigators = this.getInvestigators(effect.investigator, input);
    forEach(investigators, (investigator) => {
      const data = this.campaignData.investigatorData[investigator] ?? {};
      const counts = data.cardCounts ?? {};
      counts[effect.card] = Math.max(
        0,
        (counts[effect.card] ?? 0) + effect.quantity
      );
      data.cardCounts = counts;
      if ((counts[effect.card] ?? 0) > 0) {
        data.storyAssets = uniq([...(data.storyAssets ?? []), effect.card]);
      } else {
        data.storyAssets = filter(
          data.storyAssets,
          (code) => code !== effect.card
        );
      }
      this.campaignData.investigatorData[investigator] = data;
    });
  }

  private handleAddCardEffect(effect: AddCardEffect, input?: string[]) {
    this.campaignData.everyStoryAsset = uniq([
      ...this.campaignData.everyStoryAsset,
      effect.card,
    ]);
    const investigators = this.getInvestigators(effect.investigator, input);
    forEach(investigators, (investigator) => {
      const data = this.campaignData.investigatorData[investigator] ?? {};
      if (effect.non_story) {
        const assets = data.addedCards ?? [];
        assets.push(effect.card);
        data.addedCards = assets;
      } else {
        const assets = data.storyAssets ?? [];
        assets.push(effect.card);
        data.storyAssets = uniq(assets);
        if (effect.ignore_deck_limit) {
          const assets = data.ignoreStoryAssets ?? [];
          assets.push(effect.card);
          data.ignoreStoryAssets = uniq(assets);
        }
      }
      this.campaignData.investigatorData[investigator] = data;
    });
  }

  private handleReplaceCardEffect(effect: ReplaceCardEffect) {
    this.campaignData.everyStoryAsset = uniq([
      ...this.campaignData.everyStoryAsset,
      effect.new_card,
    ]);
    const investigatorRestriction = effect.investigator
      ? new Set(this.getInvestigators(effect.investigator))
      : undefined;
    forEach(keys(this.campaignData.investigatorData), (investigator) => {
      if (
        !investigatorRestriction ||
        investigatorRestriction.has(investigator)
      ) {
        const data: TraumaAndCardData =
          this.campaignData.investigatorData[investigator] ?? {};
        if (
          !effect.has_card ||
          find(data.storyAssets || [], (card) => card === effect.has_card)
        ) {
          this.campaignData.investigatorData[investigator] = {
            ...data,
            storyAssets: map(data.storyAssets ?? [], (card) =>
              card === effect.old_card ? effect.new_card : card
            ),
          };
        }
      }
    });
  }

  private handleRemoveCardEffect(effect: RemoveCardEffect, input?: string[]) {
    const allCards = effect.card === '$input_value' ? input : [effect.card];
    const cards = new Set(allCards);
    const investigatorRestriction = effect.investigator
      ? new Set(this.getInvestigators(effect.investigator, input))
      : undefined;
    forEach(
      uniq(
        concat(
          keys(this.campaignData.investigatorData),
          this.investigatorCodes(true)
        )
      ),
      (investigator) => {
        if (
          !investigatorRestriction ||
          investigatorRestriction.has(investigator)
        ) {
          const data: TraumaAndCardData =
            this.campaignData.investigatorData[investigator] ?? {};
          if (effect.non_story) {
            let addedCards = data.addedCards ?? [];
            const removedCards = data.removedCards ?? [];
            const exiledCards = data.exiledCards ?? [];
            forEach(allCards, (card) => {
              if (effect.exile) {
                exiledCards.push(card);
              } else if (find(addedCards, card)) {
                addedCards = filter(
                  addedCards,
                  (existingCard) => existingCard === card
                );
              } else {
                removedCards.push(card);
              }
            });
            data.addedCards = addedCards;
            data.removedCards = removedCards;
            data.exiledCards = exiledCards;
          } else {
            data.storyAssets = filter(
              data.storyAssets ?? [],
              (card) => !cards.has(card)
            );
          }
          this.campaignData.investigatorData[investigator] = data;
        }
      }
    );
  }

  private handleScarletKeyEffect(effect: ScarletKeyEffect, input?: string[]) {
    const inputValue = (input || [])[0];
    switch (effect.bearer_type) {
      case 'investigator':
        if (inputValue) {
          this.campaignData.scarlet.keyStatus[effect.scarlet_key] = {
            investigator: inputValue,
          };
        }
        break;
      case 'enemy':
        if (effect.enemy_code) {
          this.campaignData.scarlet.keyStatus[effect.scarlet_key] = {
            enemy: effect.enemy_code,
          };
        }
        break;
      case 'steal':
        if (inputValue) {
          this.campaignData.scarlet.keyStatus[effect.scarlet_key] = {
            investigator:
              this.campaignData.scarlet.keyStatus[effect.scarlet_key]
                ?.investigator,
            enemy: inputValue,
          };
        }
        break;
      case 'return':
        this.campaignData.scarlet.keyStatus[effect.scarlet_key] = {
          investigator:
            this.campaignData.scarlet.keyStatus[effect.scarlet_key]
              ?.investigator,
          // Drop the enemy from it.
        };
        break;
    }
  }

  private handlePartnerStatusEffect(
    effect: PartnerStatusEffect,
    input?: string[]
  ) {
    const partners =
      (effect.partner === '$fixed_partner' && effect.fixed_partner
        ? [effect.fixed_partner]
        : input) || [];
    forEach(partners, (code) => {
      const data: TraumaAndCardData =
        this.campaignData.investigatorData[code] || {};
      switch (effect.status) {
        case 'cannot_take':
        case 'mia':
        case 'safe':
        case 'resolute':
        case 'the_entity':
        case 'victim':
          // Standard ones, implemented as story assets on the trauma data.
          if (effect.operation === 'add') {
            data.storyAssets = uniq([
              ...(data.storyAssets ?? []),
              effect.status,
            ]);
          } else {
            data.storyAssets = filter(
              data.storyAssets ?? [],
              (x) => x !== effect.status
            );
          }
          break;
        case 'eliminated':
          data.killed = true;
          break;
        case 'heal_damage':
          data.physical = Math.max(0, (data.physical || 0) - 1);
          break;
        case 'heal_horror':
          data.mental = Math.max(0, (data.mental || 0) - 1);
          break;
        default:
          /* eslint-disable @typescript-eslint/no-unused-vars */
          const _exhaustiveCheck: never = effect.status;
          break;
      }
      this.campaignData.investigatorData[code] = data;
    });
  }

  private handleTraumaEffect(
    effect: TraumaEffect,
    input?: string[],
    numberInput?: number[]
  ) {
    const investigators = this.getInvestigators(effect.investigator, input);
    forEach(investigators, (code) => {
      const trauma: TraumaAndCardData =
        this.campaignData.investigatorData[code] ?? {};
      if (effect.heal_input) {
        if (!numberInput) {
          throw new Error('Input expected for "heal_input" type.');
        }
        const value = numberInput[0];
        switch (effect.heal_input) {
          case 'mental':
            trauma.mental = (trauma.mental ?? 0) - value;
            break;
          case 'physical':
            trauma.physical = (trauma.physical ?? 0) - value;
            break;
        }
      }
      if (effect.killed) {
        trauma.killed = true;
      }
      if (effect.insane) {
        trauma.insane = true;
      }
      if (effect.physical) {
        trauma.physical = (trauma.physical ?? 0) + effect.physical;
      }
      if (effect.mental) {
        trauma.mental = (trauma.mental ?? 0) + effect.mental;
      }
      if (effect.set_physical) {
        trauma.physical = effect.set_physical;
      }
      if (effect.set_mental) {
        trauma.mental = effect.set_mental;
      }
      if (effect.mental_or_physical) {
        throw new Error(
          'These should be filtered out before it reaches campaign log'
        );
      }

      this.campaignData.investigatorData[code] = trauma;
    });
  }

  private handleAddRemoveChaosTokenEffect(effect: AddRemoveChaosTokenEffect) {
    forEach(effect.tokens, (token) => {
      const currentCount = this.chaosBag[token] || 0;
      if (effect.type === 'add_chaos_token') {
        this.chaosBag[token] = Math.min(
          currentCount + 1,
          CHAOS_BAG_TOKEN_COUNTS[token] || 0
        );
      } else {
        this.chaosBag[token] = Math.max(0, currentCount - 1);
      }
      if (this.chaosBag[token] === 0) {
        delete this.chaosBag[token];
      }
    });
  }

  private handleLoseSuppliesEffect(effect: LoseSuppliesEffect) {
    if (effect.investigator !== 'all') {
      throw new Error('Unexpected investigator type for lose_supplies effect.');
    }
    const investigators = this.getInvestigators(effect.investigator);
    forEach(investigators, (investigator) => {
      const countEffect: CampaignLogInvestigatorCountEffect = {
        type: 'campaign_log_investigator_count',
        section: effect.section,
        investigator: '$input_value',
        operation: 'cross_out',
        id: effect.supply,
      };
      this.handleCampaignLogInvestigatorCountEffect(countEffect, [
        investigator,
      ]);
    });
  }

  private handleGainSuppliesEffect(
    effect: GainSuppliesEffect,
    input?: string[]
  ) {
    if (effect.investigator !== '$input_value') {
      throw new Error('Unexpected investigator type for gain_supplies effect.');
    }
    if (!input || !input.length) {
      throw new Error('input required for scenarioData effect');
    }
    forEach(input, (investigator) => {
      forEach(effect.supplies, (supply) => {
        const countEffect: CampaignLogInvestigatorCountEffect = {
          type: 'campaign_log_investigator_count',
          section: effect.section,
          investigator: '$input_value',
          operation: 'add',
          id: supply.id,
          value: 1,
        };
        this.handleCampaignLogInvestigatorCountEffect(countEffect, [
          investigator,
        ]);
      });
    });
  }

  private handleCampaignDataEffect(effect: CampaignDataEffect) {
    switch (effect.setting) {
      case 'result':
        this.campaignData.result = effect.value;
        break;
      case 'difficulty':
        switch (effect.value) {
          case 'easy':
            this.campaignData.difficulty = CampaignDifficulty.EASY;
            break;
          case 'standard':
            this.campaignData.difficulty = CampaignDifficulty.STANDARD;
            break;
          case 'hard':
            this.campaignData.difficulty = CampaignDifficulty.HARD;
            break;
          case 'expert':
            this.campaignData.difficulty = CampaignDifficulty.EXPERT;
            break;
        }
        break;
      case 'set_scenarios':
        this.campaignData.scenarios = effect.scenarios;
        break;
      case 'skip_scenario':
        this.campaignData.scenarioStatus[effect.scenario] = 'skipped';
        break;
      case 'replay_scenario': {
        const replayCount =
          this.campaignData.scenarioReplayCount[effect.scenario] || 0;
        this.campaignData.scenarioReplayCount[effect.scenario] =
          replayCount + 1;
        break;
      }
      case 'next_scenario':
        this.campaignData.nextScenario = [
          ...this.campaignData.nextScenario,
          effect.scenario,
        ];
        if (effect.prelude_continuation) {
          this.campaignData.noSideScenario = true;
          this.scenarioData[effect.scenario] = {
            ...pick(this.latestScenarioData || {}, [
              'playingScenario',
              'leadInvestigator',
            ]),
            investigatorStatus: {},
          };
        }
        break;
      case 'swap_chaos_bag': {
        const swap = this.swapChaosBag;
        this.swapChaosBag = this.chaosBag;
        if (effect.initialize) {
          this.chaosBag = {};
        } else {
          this.chaosBag = swap;
        }
        break;
      }
      case 'redirect_experience': {
        this.campaignData.redirect_experience = effect.investigator_count;
        break;
      }
      case 'lock_location':
        this.campaignData.scarlet.unlockedLocations = filter(
          this.campaignData.scarlet.unlockedLocations,
          (id) => id !== effect.value
        );
        break;
      case 'unlock_map':
        this.campaignData.scarlet.showMap = true;
        break;
      case 'unlock_location':
        this.campaignData.scarlet.unlockedLocations = [
          ...this.campaignData.scarlet.unlockedLocations,
          effect.value,
        ];
        break;
      case 'hide_dossier':
        this.campaignData.scarlet.unlockedDossiers = filter(
          this.campaignData.scarlet.unlockedDossiers,
          (x) => x !== effect.value
        );
        break;
      case 'unlock_dossier':
        this.campaignData.scarlet.unlockedDossiers = [
          ...this.campaignData.scarlet.unlockedDossiers,
          effect.value,
        ];
        break;
      case 'embark': {
        if (effect.location) {
          if (!effect.transit) {
            this.campaignData.scarlet.visitedLocations = [
              ...this.campaignData.scarlet.visitedLocations,
              effect.location,
            ];
          }
          if (effect.may_return) {
            // Filter out the 'current location' if you are 'leaving' but can return.
            this.campaignData.scarlet.visitedLocations = filter(
              this.campaignData.scarlet.visitedLocations,
              (loc) => loc !== this.campaignData.scarlet.location
            );
          }
          // Now update current location
          this.campaignData.scarlet.location = effect.location;
          this.campaignData.scarlet.embark = false;
        } else {
          this.campaignData.scarlet.embark = true;
        }
        break;
      }
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
      if (effect.status === 'started') {
        this.campaignData.noSideScenario = false;
        if (
          this.campaignData.nextScenario.length &&
          last(this.campaignData.nextScenario) === scenarioId
        ) {
          this.campaignData.nextScenario = dropRight(
            this.campaignData.nextScenario,
            1
          );
        }
        this.latestScenarioData = this.scenarioData[scenarioId] || {
          investigatorStatus: {},
        };
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
    if (effect.setting === 'play_scenario_step_id') {
      scenario.playScenarioStepId = effect.step_id;
      return;
    }


    if (effect.setting === 'add_investigator') {
      if (effect.investigator !== '$fixed_investigator') {
        throw new Error(
          'add_investigator should always be $fixed_investigator'
        );
      }
      scenario.playingScenario = [
        ...(scenario.playingScenario || []),
        { investigator: effect.fixed_investigator },
      ];
    } else {
      if (effect.investigator !== '$input_value') {
        throw new Error('investigator_status should always be $input_value');
      }
      if (!input) {
        throw new Error('input required for scenarioData effect');
      }
      switch (effect.setting) {
        case 'investigator_status':
          forEach(input, (code) => {
            scenario.investigatorStatus[code] = effect.investigator_status;
          });
          break;
        case 'playing_scenario': {
          const playing: PlayingScenarioItem[] = map(
            input || [],
            (investigator) => {
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
    }

    this.scenarioData[scenarioId] = scenario;
    this.latestScenarioData = scenario;
  }

  private handleFreeformCampaignLogEffect(
    effect: FreeformCampaignLogEffect,
    input?: string[]
  ) {
    const section: EntrySection = this.sections[effect.section] || {
      entries: [],
    };
    if (!input || !input.length) {
      return;
    }
    section.entries.push({
      type: 'freeform',
      id:
        effect.scenario_id && effect.index !== undefined
          ? `${effect.scenario_id}$${effect.index}`
          : input[0],
      text: input[0],
      interScenario:
        effect.scenario_id && effect.index !== undefined
          ? {
            scenarioId: effect.scenario_id,
            index: effect.index,
          }
          : undefined,
    });
  }

  private handleCampaignLogEffect(effect: CampaignLogEffect, input?: string[]) {
    const sectionId =
      effect.section === '$input_value' && input?.length
        ? input[0]
        : effect.section;
    const section: EntrySection = this.sections[sectionId] || {
      entries: [],
    };
    if (!effect.id) {
      if (effect.cross_out !== undefined) {
        section.sectionCrossedOut = effect.cross_out;
      }
    } else {
      const ids = effect.id === '$input_value' ? input : [effect.id];
      forEach(ids, (id) => {
        if (effect.cross_out !== undefined) {
          section.entries = map(section.entries, (entry) => {
            if (entry.id === id) {
              return {
                ...entry,
                crossedOut: effect.cross_out,
              };
            }
            return entry;
          });
        } else if (effect.decorate) {
          section.decoration = {
            ...(section.decoration || {}),
            [id]: effect.decorate,
          };
        } else if (effect.remove) {
          section.entries = filter(section.entries, (entry) => entry.id !== id);
        } else {
          section.entries.push({
            type: 'basic',
            id,
          });
        }
      });
    }
    this.sections[sectionId] = section;
  }

  private updateSectionWithCount(
    section: EntrySection,
    id: string,
    operation:
      | 'add'
      | 'add_input'
      | 'subtract_input'
      | 'set'
      | 'set_input'
      | 'cross_out',
    value: number,
    min?: number,
    alternate?: boolean
  ): EntrySection {
    // Normal entry
    const entry = find(section.entries, (entry) => entry.id === id);
    // eslint-disable-next-line no-nested-ternary
    const count = entry && entry.type === 'count' ? (
      alternate ? (entry.otherCount ?? 0) : entry.count
    ) : 0;
    const applyMin = (value: number) =>
      min !== undefined && min !== null ? Math.max(min, value) : value;
    switch (operation) {
      case 'cross_out':
        section.entries = map(section.entries, (entry) => {
          if (entry.id === id) {
            return {
              ...entry,
              crossedOut: true,
            };
          }
          return entry;
        });
        break;
      case 'subtract_input':
        if (entry && entry.type === 'count') {
          if (alternate) {
            entry.otherCount = count - value;
          } else {
            entry.count = count - value;
          }
        } else {
          if (alternate) {
            section.entries.push({
              type: 'count',
              id,
              count: 0,
              otherCount: applyMin(count - value),
            });
          } else {
            section.entries.push({
              type: 'count',
              id,
              count: applyMin(count - value),
            });
          }
        }
        break;
      case 'add':
      case 'add_input':
        if (entry && entry.type === 'count') {
          if (alternate) {
            entry.otherCount = count + value;
          } else {
            entry.count = count + value;
          }
        } else {
          if (alternate) {
            section.entries.push({
              type: 'count',
              id,
              count: 0,
              otherCount: applyMin(count + value),
            });
          } else {
            section.entries.push({
              type: 'count',
              id,
              count: applyMin(count + value),
            });
          }
        }
        break;
      case 'set':
      case 'set_input':
        if (entry && entry.type === 'count') {
          if (alternate) {
            entry.otherCount = applyMin(value);
          } else {
            entry.count = applyMin(value);
          }
        } else {
          if (alternate) {
            section.entries.push({
              type: 'count',
              id,
              count: 0,
              otherCount: applyMin(value),
            });
          } else {
            section.entries.push({
              type: 'count',
              id,
              count: applyMin(value),
            });
          }
        }
        break;
    }
    return section;
  }

  private handleCampaignLogInvestigatorCountEffect(
    effect: CampaignLogInvestigatorCountEffect,
    input?: string[],
    numberInput?: number
  ) {
    const investigatorSection = this.investigatorSections[effect.section] || {};
    const investigators = this.getInvestigators(effect.investigator, input);
    const value: number =
      (effect.operation === 'add_input' || effect.operation === 'set_input'
        ? numberInput
        : effect.value) || 0;
    forEach(investigators, (investigator) => {
      const section = investigatorSection[investigator] || {
        entries: [],
      };
      investigatorSection[investigator] = this.updateSectionWithCount(
        section,
        effect.id,
        effect.operation,
        value
      );
    });
    this.investigatorSections[effect.section] = investigatorSection;
  }

  private handleCampaignLogCountEffect(
    effect: CampaignLogCountEffect,
    numberInput?: number
  ) {
    if (!effect.id) {
      // Section entry
      const section = this.countSections[effect.section] || {
        count: 0,
      };
      let count = section.count;
      switch (effect.operation) {
        case 'add':
          count = count + (effect.value ?? 0);
          break;
        case 'set':
          count = effect.value ?? 0;
          break;
        case 'add_input':
          count = count + (numberInput ?? 0);
          break;
        case 'subtract_input':
          count = count - (numberInput ?? 0);
          break;
        case 'set_input':
          count = numberInput || 0;
          break;
      }
      if (effect.min !== undefined && effect.min !== null) {
        count = Math.max(count, effect.min);
      }
      section.count = count;
      this.countSections[effect.section] = section;
    } else {
      const value: number =
        (effect.operation === 'add_input' ||
        effect.operation === 'set_input' ||
        effect.operation === 'subtract_input'
          ? numberInput
          : effect.value) ?? 0;
      const section = this.sections[effect.section] || {
        entries: [],
      };
      this.sections[effect.section] = this.updateSectionWithCount(
        section,
        effect.id,
        effect.operation,
        value,
        effect.min,
        effect.alternate
      );
    }
  }

  private cardsIds(
    effect: CampaignLogCardsEffect,
    input?: string[]
  ): string[] | undefined {
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
    const sectionIds: string[] =
      effect.section === '$input_value' ? input || [] : [effect.section];
    const ids: string[] | undefined = this.cardsIds(effect, input);
    forEach(sectionIds, (sectionId) => {
      const section: EntrySection = this.sections[sectionId] || {
        entries: [],
      };
      if (!ids) {
        // Section entry, probably just a cross out.
        if (effect.cross_out !== undefined) {
          section.sectionCrossedOut = effect.cross_out;
        }
      } else {
        forEach(ids, (id) => {
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
                  forEach(zip(input, numberInput), ([card, number]) => {
                    if (card && number) {
                      cards.push({
                        card,
                        count: number,
                      });
                    }
                  });
                } else {
                  forEach(input || [], (card) =>
                    cards.push({
                      card,
                      count: 1,
                    })
                  );
                }
                break;
              case '$lead_investigator':
                cards.push({
                  card: this.leadInvestigatorChoice(),
                  count: 1,
                });
                break;
              case '$all_investigators':
                forEach(this.investigatorCodes(true), (code) => {
                  cards.push({ card: code, count: 1 });
                });
                break;
              case '$not_resigned':
                forEach(this.investigatorCodes(true), (code) => {
                  if (!this.resigned(code)) {
                    cards.push({
                      card: code,
                      count: 1,
                    });
                  }
                });
                break;
              case '$defeated_investigators':
                forEach(this.investigatorCodes(true), (code) => {
                  if (this.isDefeated(code)) {
                    cards.push({
                      card: code,
                      count: 1,
                    });
                  }
                });
                break;
              case '$fixed_codes':
                forEach(effect.codes || [], (code) => {
                  cards.push({
                    card: code,
                    count: 1,
                  });
                });
                break;
            }
          } else {
            cards.push({
              card: id,
              count: 1,
            });
          }

          // Normal entry
          if (effect.cross_out !== undefined) {
            if (cards.length) {
              // Try to cross out 'some' of these card entries that match our codes.
              const removals = new Set(map(cards, (card) => card.card));
              section.entries = map(section.entries, (entry) => {
                if (
                  entry.id === id &&
                  entry.type === 'card' &&
                  find(entry.cards, (card) => removals.has(card.card))
                ) {
                  return {
                    ...entry,
                    crossedOut: effect.cross_out,
                  };
                }
                return entry;
              });
            } else {
              // Cross them all out
              section.entries = map(section.entries, (entry) => {
                if (entry.id === id) {
                  return {
                    ...entry,
                    crossedOut: true,
                  };
                }
                return entry;
              });
            }
          } else if (effect.remove) {
            section.entries = filter(
              section.entries,
              (entry) => entry.id !== id
            );
          } else {
            if (id === SELECTED_PARTNERS_CAMPAIGN_LOG_ID) {
              section.entries.push({
                type: 'card',
                id,
                cards,
              });
            } else {
              forEach(cards, (card) => {
                section.entries.push({
                  type: 'card',
                  id,
                  cards: [card],
                });
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
