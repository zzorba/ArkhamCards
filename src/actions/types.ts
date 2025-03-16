import {
  ChaosBag,
  ChaosTokenType,
  FactionCodeType,
  SkillCodeType,
  SlotCodeType,
} from '@app_constants';
import { CardFilterData, FilterState } from '@lib/filters';
import Card, { InvestigatorChoice } from '@data/types/Card';
import { LEAD_INVESTIGATOR_STEP_ID } from '@data/scenario/fixedSteps';
import {
  Campaign_Difficulty_Enum,
  Chaos_Bag_Tarot_Mode_Enum,
} from '@generated/graphql/apollo-schema';
import { CustomizationChoice } from '@data/types/CustomizationOption';

export const SORT_BY_TYPE = 'type';
export const SORT_BY_TYPE_SLOT = 'type_slot';
export const SORT_BY_CYCLE = 'cycle';
export const SORT_BY_FACTION = 'faction';
export const SORT_BY_FACTION_PACK = 'faction_pack';
export const SORT_BY_FACTION_XP = 'faction_xp';
export const SORT_BY_COST = 'cost';
export const SORT_BY_PACK = 'pack';
export const SORT_BY_TITLE = 'title';
export const SORT_BY_ENCOUNTER_SET = 'encounter_set';
export const SORT_BY_XP = 'xp';
export const SORT_BY_CARD_ID = 'id';
export const SORT_BY_SLOT = 'slot';

export const BROWSE_CARDS = 'BROWSE_CARDS';
export const BROWSE_DECKS = 'BROWSE_DECKS';
export const BROWSE_CAMPAIGNS = 'BROWSE_CAMPAIGNS';
export const BROWSE_SETTINGS = 'BROWSE_SETTINGS';


export type AttachableDefinition = {
  code: string;
  icon: string;
  limit?: number;
  name: string;
  buttonLabel: string;
  requiredCards?: Slots;
  targetSize: number;
  traits?: string[];
  filter?: (card: Card) => boolean;
};

export type StartingTabType =
  | typeof BROWSE_CARDS
  | typeof BROWSE_DECKS
  | typeof BROWSE_CAMPAIGNS
  | typeof BROWSE_SETTINGS;
export type SortType =
  | typeof SORT_BY_TYPE
  | typeof SORT_BY_FACTION
  | typeof SORT_BY_COST
  | typeof SORT_BY_PACK
  | typeof SORT_BY_TITLE
  | typeof SORT_BY_XP
  | typeof SORT_BY_CYCLE
  | typeof SORT_BY_CARD_ID
  | typeof SORT_BY_SLOT
  | typeof SORT_BY_ENCOUNTER_SET;

export type ExtendedSortType =
  | SortType
  | typeof SORT_BY_TYPE_SLOT
  | typeof SORT_BY_FACTION_PACK
  | typeof SORT_BY_FACTION_XP;

export const DEFAULT_SORT: SortType[] = [SORT_BY_TYPE, SORT_BY_SLOT];
export const DEFAULT_MYTHOS_SORT: SortType[] = [SORT_BY_ENCOUNTER_SET];

export interface Slots {
  [code: string]: number;
}
export interface ChecklistSlots {
  [code: string]: number[] | undefined;
}

export const INVESTIGATOR_PROBLEM = 'investigator';
export const TOO_MANY_COPIES = 'too_many_copies';
export const INVALID_CARDS = 'invalid_cards';
export const TOO_FEW_CARDS = 'too_few_cards';
export const TOO_MANY_CARDS = 'too_many_cards';
export const DECK_OPTIONS_LIMIT = 'deck_options_limit';

export type DeckProblemType =
  | typeof INVESTIGATOR_PROBLEM
  | typeof TOO_MANY_COPIES
  | typeof INVALID_CARDS
  | typeof TOO_FEW_CARDS
  | typeof TOO_MANY_CARDS
  | typeof DECK_OPTIONS_LIMIT;

export type DeckInvestigatorProblemType = 'required' | 'limit' | 'atleast';

export interface DeckProblem {
  reason: DeckProblemType;
  investigatorReason?: DeckInvestigatorProblemType;
  problems?: string[];
  invalidCards: Card[];
}
export interface DeckMeta {
  faction_selected?: FactionCodeType;
  deck_size_selected?: string;
  option_selected?: string;
  alternate_front?: string;
  alternate_back?: string;
  extra_deck?: string;
  transform_into?: string;
  card_pool?: string; // comma separated list of new style packs
  // Other types:
  // attachmens_{code}: id1,id2,id3 etc
  [key: string]: string | undefined;
}

export interface LocalDeckId {
  id: undefined;
  local: true;
  uuid: string;
  serverId?: number;
  arkhamdb_user: undefined;
}
export interface ArkhamDbDeckId {
  id: number;
  local: false;
  uuid: string;
  serverId?: number;
  arkhamdb_user: number;
}
export type DeckId = LocalDeckId | ArkhamDbDeckId;

export interface ArkhamDbApiDeck {
  id: number;
  name: string;
  description_md?: string;
  taboo_id?: number;
  investigator_code: string;
  meta?: DeckMeta;
  date_update: string;
  date_creation: string;
  scenarioCount?: number;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  sideSlots?: Slots;
  user_id: number;
  exile_string?: string;
  problem?: DeckProblemType;
  version?: string;
  xp?: number;
  xp_adjustment?: number;
  xp_spent?: number;
  next_deck?: number;
  previous_deck?: number;
  tags?: string;
}

interface BaseDeck {
  name: string;
  description_md?: string;
  taboo_id?: number;
  investigator_code: string;
  meta?: DeckMeta;
  date_update: string;
  date_creation: string;
  scenarioCount?: number;
  slots?: Slots;
  sideSlots?: Slots;
  ignoreDeckLimitSlots: Slots;
  exile_string?: string;
  problem?: DeckProblemType;
  version?: string;
  xp?: number;
  xp_adjustment?: number;
  spentXp?: number;
  nextDeckId?: DeckId;
  previousDeckId?: DeckId;
  tags?: string;
}

export interface ArkhamDbDeck extends BaseDeck {
  id: number;
  local: undefined;
  uuid: undefined;
  user_id: number;
}

export interface LocalDeck extends BaseDeck {
  local: true;
  uuid: string;
}

export function getDeckId(deck: Deck): DeckId {
  if (deck.local) {
    return {
      id: undefined,
      arkhamdb_user: undefined,
      local: true,
      uuid: deck.uuid,
    };
  }
  return {
    id: deck.id,
    arkhamdb_user: deck.user_id,
    local: false,
    uuid: `${deck.id}`,
  };
}

export type Deck = ArkhamDbDeck | LocalDeck;

export interface LegacyDeck extends BaseDeck {
  id: number;
  local?: string;
  uuid?: string;
}

export interface DecksMap {
  [uuid: string]: Deck;
}

export type FactionCounts = {
  [faction in FactionCodeType]?: [number, number];
};

export type SkillCounts = {
  [skill in SkillCodeType]?: number;
};

export type SlotCounts = {
  [slot in SlotCodeType]?: number;
};

export interface SpecialDiscount {
  code: string;
  available: number;
  used: number;
}

export interface DeckChanges {
  added: Slots;
  removed: Slots;
  upgraded: Slots;
  exiled: Slots;
  customized: Slots;
  spentXp: number;
  specialDiscounts: {
    usedFreeCards: number;
    totalFreeCards: number;
    cards: SpecialDiscount[];
  };
}

export interface CardId {
  id: string;
  quantity: number;
  invalid: boolean;
  limited: boolean;
  ignoreCount?: boolean;
}

export interface AssetGroup {
  type: string;
  data: CardId[];
}

export interface SplitCards {
  Assets?: AssetGroup[];
  Event?: CardId[];
  Skill?: CardId[];
  Treachery?: CardId[];
  Enemy?: CardId[];
}
export type CardSplitType = keyof SplitCards;

export interface CustomizationDecision {
  index: number;
  spent_xp: number;
  choice?: string;
}

export interface Customizations {
  [code: string]: CustomizationChoice[] | undefined;
}

export interface ParsedDeck {
  id?: DeckId;
  deck?: Deck;
  customizations: Customizations;

  faction: FactionCodeType;
  investigator: InvestigatorChoice;
  slots: Slots;
  deckSize: number;
  extraDeckSize: number | undefined;
  normalCardCount: number;
  extraNormalCardCount: number | undefined;
  totalCardCount: number;
  experience: number;
  availableExperience: number;
  packs: number;
  factionCounts: FactionCounts;
  costHistogram: number[];
  skillIconCounts: SkillCounts;
  deckCards: Card[];
  slotCounts: SlotCounts;
  normalCards: SplitCards;
  specialCards: SplitCards;
  sideCards: SplitCards;
  extraCards?: SplitCards;

  lockedPermanents: Slots;

  ignoreDeckLimitSlots: Slots;
  changes?: DeckChanges;
  problem?: DeckProblem;
  extraProblem?: DeckProblem;
  limitedSlots: boolean;
  customContent: boolean;
}

export interface Pack {
  id: string;
  name: string;
  code: string;
  position: number;
  cycle_position: number;
  available?: string;
  known: number;
  total: number;
  url?: string;
}

export interface Trauma {
  physical?: number;
  mental?: number;
  killed?: boolean;
  insane?: boolean;
}

export interface TraumaAndCardData extends Trauma {
  specialXp?: {
    [key: string]: number | undefined;
  };
  availableXp?: number;
  spentXp?: number;
  storyAssets?: string[];
  ignoreStoryAssets?: string[];
  addedCards?: string[];
  removedCards?: string[];
  exiledCards?: string[];
  cardCounts?: Slots;
}

export interface InvestigatorData {
  [code: string]: TraumaAndCardData | undefined;
}

export interface InvestigatorTraumaData {
  [code: string]: Trauma | undefined;
}

export interface WeaknessSet {
  packCodes: string[];
  assignedCards: Slots;
}

export interface CampaignNoteSection {
  title: string;
  notes: string[];
  custom?: boolean;
}

export interface CampaignNoteCount {
  title: string;
  count: number;
  custom?: boolean;
}

export interface InvestigatorCampaignNoteSection {
  title: string;
  notes: {
    [investigator_code: string]: string[];
  };
  custom?: boolean;
}

export interface InvestigatorCampaignNoteCount {
  title: string;
  counts: {
    [investigator_code: string]: number;
  };
  custom?: boolean;
}

export const NEW_CHAOS_BAG_RESULTS = {
  drawnTokens: [],
  sealedTokens: [],
  blessTokens: 0,
  curseTokens: 0,
  totalDrawnTokens: 0,
};
export const FIXED_CHAOS_BAG_ID = '11111111-1111-1111-1111-111111111111';
export const FIXED_CHAOS_BAG_CAMPAIGN_ID: LocalCampaignId = {
  campaignId: FIXED_CHAOS_BAG_ID,
};

export interface SealedToken {
  id: string;
  icon: ChaosTokenType;
}

export interface ChaosBagHistory {
  type: 'draw' | 'add' | 'remove' | 'seal' | 'release';
  tokens: ChaosTokenType[];
  active?: boolean;
}
export interface ChaosBagResults {
  drawnTokens: ChaosTokenType[];
  sealedTokens: SealedToken[];
  blessTokens?: number;
  curseTokens?: number;
  totalDrawnTokens: number;
  tarot?: Chaos_Bag_Tarot_Mode_Enum;
  difficulty?: Campaign_Difficulty_Enum;
  history?: ChaosBagHistory[];
}

export interface ScenarioResult {
  scenario: string;
  scenarioCode: string;
  resolution: string;
  xp?: number;
  scenarioPack?: string;
  interlude?: boolean;
}

export interface LegacyBackupState {
  version: undefined;
  campaigns: LegacyCampaign[];
  decks: LegacyDeck[];
  guides: { [id: string]: LegacyCampaignGuideState };
  deckIds: { [id: string]: string };
  campaignIds: { [id: string]: string };
}

export interface BackupState {
  version: 1;
  campaigns: Campaign[];
  decks: LocalDeck[];
  guides: CampaignGuideState[];
}

export enum CampaignDifficulty {
  EASY = 'easy',
  STANDARD = 'standard',
  HARD = 'hard',
  EXPERT = 'expert',
}

export const DIFFICULTIES: CampaignDifficulty[] = [
  CampaignDifficulty.EASY,
  CampaignDifficulty.STANDARD,
  CampaignDifficulty.HARD,
  CampaignDifficulty.EXPERT,
];

export const CUSTOM = 'custom';
export const CORE = 'core';
export const RTNOTZ = 'rtnotz';
export const DWL = 'dwl';
export const RTDWL = 'rtdwl';
export const PTC = 'ptc';
export const RTPTC = 'rtptc';
export const TFA = 'tfa';
export const RTTFA = 'rttfa';
export const TCU = 'tcu';
export const RTTCU = 'rttcu';
export const TDE = 'tde';
export const TDEA = 'tdea';
export const TDEB = 'tdeb';
export const TIC = 'tic';
export const TDC = 'tdc';
export const RTTIC = 'rttic';
export const EOE = 'eoe';
export const TSK = 'tskc';
export const FHV = 'fhv';
export const GOB = 'gob';
export const FOF = 'fof';
export const STANDALONE = 'standalone';
export const DARK_MATTER = 'zdm';
export const ALICE_IN_WONDERLAND = 'zaw';
export const OZ = 'zoz';
export const AGES_UNWOUND = 'zau';
export const CROWN_OF_EGIL = 'zce';
export const CALL_OF_THE_PLAGUEBEARER = 'zcp';
export const CYCLOPEAN_FOUNDATIONS = 'zcf';
export const HEART_OF_DARKNESS = 'zhod';

export type CampaignCycleCode =
  | typeof CUSTOM
  | typeof CORE
  | typeof RTNOTZ
  | typeof DWL
  | typeof RTDWL
  | typeof PTC
  | typeof RTPTC
  | typeof TFA
  | typeof RTTFA
  | typeof TCU
  | typeof RTTCU
  | typeof TDE
  | typeof TDEA
  | typeof TDEB
  | typeof TIC
  | typeof EOE
  | typeof TSK
  | typeof FHV
  | typeof TDC
  | typeof GOB
  | typeof FOF
  | typeof STANDALONE
  | typeof DARK_MATTER
  | typeof CYCLOPEAN_FOUNDATIONS
  | typeof ALICE_IN_WONDERLAND
  | typeof OZ
  | typeof AGES_UNWOUND
  | typeof CROWN_OF_EGIL
  | typeof HEART_OF_DARKNESS
  | typeof CALL_OF_THE_PLAGUEBEARER
  | typeof RTTIC;

export const ALL_CAMPAIGNS: CampaignCycleCode[] = [
  CORE,
  RTNOTZ,
  DWL,
  RTDWL,
  PTC,
  RTPTC,
  TFA,
  RTTFA,
  TCU,
  RTTCU,
  TDE,
  TDEA,
  TDEB,
  TIC,
  EOE,
  TSK,
  FHV,
  // TDC,
];
export const STANDALONE_CAMPAGINS: CampaignCycleCode[] = [GOB, FOF];
export const CUSTOM_CAMPAIGNS: CampaignCycleCode[] = [
  ALICE_IN_WONDERLAND,
  DARK_MATTER,
  CROWN_OF_EGIL,
  CALL_OF_THE_PLAGUEBEARER,
  CYCLOPEAN_FOUNDATIONS,
  HEART_OF_DARKNESS,
  RTTIC,
  OZ,
  AGES_UNWOUND,
];

export const GUIDED_CAMPAIGNS = new Set([
  CORE,
  DWL,
  PTC,
  TFA,
  TCU,
  RTNOTZ,
  RTDWL,
  RTPTC,
  RTTFA,
  RTTCU,
  TDE,
  TDEA,
  TDEB,
  TIC,
  EOE,
  TSK,
  FHV,
  GOB,
  FOF,
  ALICE_IN_WONDERLAND,
  DARK_MATTER,
  CROWN_OF_EGIL,
  CALL_OF_THE_PLAGUEBEARER,
  CYCLOPEAN_FOUNDATIONS,
  HEART_OF_DARKNESS,
  RTTIC,
  OZ,
  AGES_UNWOUND,
  // TDC,
]);

export const INCOMPLETE_GUIDED_CAMPAIGNS = new Set<CampaignCycleCode>([]);
export const NEW_GUIDED_CAMPAIGNS = new Set<CampaignCycleCode>([
  OZ,
  // TDC,
]);

export interface CustomCampaignLog {
  sections?: string[];
  counts?: string[];
  investigatorSections?: string[];
  investigatorCounts?: string[];
}

export interface InvestigatorNotes {
  sections?: InvestigatorCampaignNoteSection[];
  counts?: InvestigatorCampaignNoteCount[];
}

export interface CampaignNotes {
  sections?: CampaignNoteSection[];
  counts?: CampaignNoteCount[];
  investigatorNotes?: InvestigatorNotes;
}

export interface LocalCampaignId {
  campaignId: string;
  serverId?: undefined;
}

export interface UploadedCampaignId {
  campaignId: string;
  serverId: number;
}

export type CampaignId = LocalCampaignId | UploadedCampaignId;

export interface TarotReading {
  cards: { [scenario: string]: string | undefined };
  inverted: { [scenario: string]: boolean | undefined };
}

interface BaseCampaign {
  serverId?: number;
  name: string;
  difficulty?: CampaignDifficulty;
  cycleCode: CampaignCycleCode;
  standaloneId?: StandaloneId;
  lastUpdated: Date | string;
  showInterludes?: boolean;
  deckIds?: DeckId[];
  nonDeckInvestigators?: string[];
  guided?: boolean;
  guideVersion?: number;
  adjustedInvestigatorData?: InvestigatorData;
  tarotReading?: TarotReading | null;
  archived?: boolean;

  // All 'objects' might be optional
  investigatorData?: InvestigatorData;
  chaosBag?: ChaosBag;
  weaknessSet?: WeaknessSet;
  campaignNotes?: CampaignNotes;
  scenarioResults?: ScenarioResult[];
  // Used for Dream-Eaters and other nonsense.
  linkUuid?: {
    campaignIdA: string;
    campaignIdB: string;
  };
  linkedCampaignUuid?: string;
}

export interface Campaign extends BaseCampaign {
  uuid: string;
}

export function getCampaignId(campaign: Campaign): CampaignId {
  return {
    campaignId: campaign.uuid,
    serverId: campaign.serverId,
  };
}

export function getLastUpdated(campaign: {
  lastUpdated?: Date | string | number;
}): number {
  if (!campaign.lastUpdated) {
    return 0;
  }
  if (typeof campaign.lastUpdated === 'string') {
    return new Date(Date.parse(campaign.lastUpdated)).getTime();
  }
  if (typeof campaign.lastUpdated === 'number') {
    return new Date(campaign.lastUpdated).getTime();
  }
  return campaign.lastUpdated.getTime();
}

export function getCampaignLastUpdated(
  campaign: Campaign,
  guide?: { lastUpdated?: Date | string | number }
): Date {
  if (campaign.guided && guide) {
    return new Date(Math.min(getLastUpdated(campaign), getLastUpdated(guide)));
  }
  return new Date(getLastUpdated(campaign));
}

export interface LegacyCampaign extends BaseCampaign {
  id: number;
  latestDeckIds?: number[]; // deprecated
  baseDeckIds?: number[];
  uuid: string | undefined;
  linkedCampaignId?: number;
  link?: {
    campaignIdA: number;
    campaignIdB: number;
  };
}

export interface SingleCampaign extends Campaign {
  latestScenario?: ScenarioResult;
  finishedScenarios: string[];
}

export const SET_THEME = 'SET_THEME';
export interface SetThemeAction {
  type: typeof SET_THEME;
  theme: 'dark' | 'light' | 'system';
}

export const SET_FONT_SCALE = 'SET_FONT_SCALE';
export interface SetFontScaleAction {
  type: typeof SET_FONT_SCALE;
  fontScale: number;
}

export const SET_TABOO_SET = 'SET_TABOO_SET';
export interface SetTabooSetAction {
  type: typeof SET_TABOO_SET;
  tabooId?: number;
  currentTabooId?: number;
  useCurrentTabooSet?: boolean;
}

export const SET_CURRENT_TABOO_SET = 'SET_CURRENT_TABOO_SET';
export interface SetCurrentTabooSetAction {
  type: typeof SET_CURRENT_TABOO_SET;
  tabooId?: number;
}

export const SET_MISC_SETTING = 'SET_MISC_SETTING';

export type MiscRemoteSetting =
  | 'single_card'
  | 'alphabetize'
  | 'colorblind'
  | 'sort_quotes'
  | 'ignore_collection'
  | 'custom_content'
  | 'campaign_show_deck_id';
export type MiscLocalSetting =
  | 'justify'
  | 'hide_campaign_decks'
  | 'hide_arkhamdb_decks'
  | 'android_one_ui_fix'
  | 'card_grid'
  | 'beta1'
  | 'draft_grid'
  | 'map_list'
  | 'draft_from_collection'
  | 'low_memory'
  | 'search_english';
export type MiscSetting = MiscRemoteSetting | MiscLocalSetting;
export interface SetMiscSettingAction {
  type: typeof SET_MISC_SETTING;
  setting: MiscSetting;
  value: boolean;
}

export const CHANGE_TAB = 'CHANGE_TAB';
export interface ChangeTabAction {
  type: typeof CHANGE_TAB;
  tab: StartingTabType;
}

export const SET_PLAYBACK_RATE = 'SET_PLAYBACK_RATE';
export interface SetPlaybackRateAction {
  type: typeof SET_PLAYBACK_RATE;
  rate: number;
}

export const PACKS_FETCH_START = 'PACKS_FETCH_START';
export interface PacksFetchStartAction {
  type: typeof PACKS_FETCH_START;
}
export const PACKS_FETCH_ERROR = 'PACKS_FETCH_ERROR';
export interface PacksFetchErrorAction {
  type: typeof PACKS_FETCH_ERROR;
  error: string;
}
export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export interface PacksAvailableAction {
  type: typeof PACKS_AVAILABLE;
  packs: Pack[];
  lang: string;
  timestamp: Date;
  lastModified?: string;
}

export const CUSTOM_PACKS_AVAILABLE = 'CUSTOM_PACKS_AVAILABLE';
export interface CustomPacksAvailableAction {
  type: typeof CUSTOM_PACKS_AVAILABLE;
  packs: Pack[];
  lang: string;
}

export interface CardCache {
  cardCount?: number;
  lastModified?: string;
  lastModifiedTranslation?: string;
  lastAttemptedSync?: string;
}

export interface TabooCache {
  tabooCount: number;
  lastModified?: string;
}

export const PACKS_CACHE_HIT = 'PACKS_CACHE_HIT';
export interface PacksCacheHitAction {
  type: typeof PACKS_CACHE_HIT;
  timestamp: Date;
}

export const CARD_SET_SCHEMA_VERSION = 'CARD_SET_SCHEMA_VERSION';
export interface CardSetSchemaVersionAction {
  type: typeof CARD_SET_SCHEMA_VERSION;
  schemaVersion: number;
}

export const CARD_FETCH_START = 'CARD_FETCH_START';
export interface CardFetchStartAction {
  type: typeof CARD_FETCH_START;
}

export const SET_LANGUAGE_CHOICE = 'SET_LANGUAGE_CHOICE';
export interface SetLanguageChoiceAction {
  type: typeof SET_LANGUAGE_CHOICE;
  choiceLang: string;
}

export const SET_AUDIO_LANGUAGE_CHOICE = 'SET_AUDIO_LANGUAGE_CHOICE';
export interface SetAudioLanguageChoiceAction {
  type: typeof SET_AUDIO_LANGUAGE_CHOICE;
  choiceLang: string;
}

export const SYNC_DISMISS_ONBOARDING = 'SYNC_DISMISS_ONBOARDING';
export interface SyncDismissOnboardingAction {
  type: typeof SYNC_DISMISS_ONBOARDING;
  updates: { [onboarding: string]: boolean };
}

export const CARD_FETCH_SUCCESS = 'CARD_FETCH_SUCCESS';
export interface CardFetchSuccessAction {
  type: typeof CARD_FETCH_SUCCESS;
  cache?: CardCache;
  tabooCache?: TabooCache;
  cardLang: string;
  choiceLang: string;
}

export const CARD_REQUEST_FETCH = 'CARD_REQUEST_FETCH';
export interface CardRequestFetchAction {
  type: typeof CARD_REQUEST_FETCH;
  cardLang: string;
  choiceLang: string;
}

export const CARD_FETCH_ERROR = 'CARD_FETCH_ERROR';
export interface CardFetchErrorAction {
  type: typeof CARD_FETCH_ERROR;
  error: string;
}

export const UPDATE_PROMPT_DISMISSED = 'UPDATE_PROMPT_DISMISSED';
export interface UpdatePromptDismissedAction {
  type: typeof UPDATE_PROMPT_DISMISSED;
  timestamp: Date;
}

export const NEW_DECK_AVAILABLE = 'NEW_DECK_AVAILABLE';
export interface NewDeckAvailableAction {
  type: typeof NEW_DECK_AVAILABLE;
  id: DeckId;
  deck: Deck;
}
export const REPLACE_LOCAL_DECK = 'REPLACE_LOCAL_DECK';
export interface ReplaceLocalDeckAction {
  type: typeof REPLACE_LOCAL_DECK;
  localId: DeckId;
  deck: ArkhamDbDeck;
}
export const UPDATE_DECK = 'UPDATE_DECK';
export interface UpdateDeckAction {
  type: typeof UPDATE_DECK;
  id: DeckId;
  deck: Deck;
  isWrite: boolean;
}

export const CAMPAIGN_SYNC_REQUIRED = 'CAMPAIGN_SYNC_REQUIRED';
export interface CampaignSyncRequiredAction {
  type: typeof CAMPAIGN_SYNC_REQUIRED;
  campaignId: CampaignId;
}

export interface UploadedDeck {
  deckId: DeckId;
  hash: string;
  nextDeckId: DeckId | undefined;
  campaignId: UploadedCampaignId[];
}
export interface GroupedUploadedDecks {
  [uuid: string]: UploadedDeck | undefined;
}
export const UPLOAD_DECK = 'UPLOAD_DECK';
export interface UploadDeckAction {
  type: typeof UPLOAD_DECK;
  deckId: DeckId;
  nextDeckId: DeckId | undefined;
  hash: string;
  campaignId: UploadedCampaignId;
}

export const REMOVE_UPLOAD_DECK = 'REMOVE_UPLOAD_DECK';
export interface RemoveUploadDeckAction {
  type: typeof REMOVE_UPLOAD_DECK;
  deckId: DeckId;
  campaignId: UploadedCampaignId;
}

export const SET_UPLOADED_DECKS = 'SET_UPLOADED_DECKS';
export interface SetUploadedDecksAction {
  type: typeof SET_UPLOADED_DECKS;
  uploadedDecks: GroupedUploadedDecks;
}

export const DELETE_DECK = 'DELETE_DECK';
export interface DeleteDeckAction {
  type: typeof DELETE_DECK;
  id: DeckId;
  deleteAllVersions: boolean;
}
export const CLEAR_DECKS = 'CLEAR_DECKS';
export interface ClearDecksAction {
  type: typeof CLEAR_DECKS;
}

export interface DraftState {
  size?: number;
  current?: string[];
}
export const SET_CURRENT_DRAFT = 'SET_CURRENT_DRAFT';
export interface SetCurrentDraftAction {
  type: typeof SET_CURRENT_DRAFT;
  id: DeckId;
  current: string[];
  mode: 'extra' | undefined;
}

export const CLEAR_CURRENT_DRAFT = 'CLEAR_CURRENT_DRAFT';
export interface ClearCurrentDraftAction {
  type: typeof CLEAR_CURRENT_DRAFT;
  id: DeckId;
}

export const SET_CURRENT_DRAFT_SIZE = 'SET_CURRENT_DRAFT_SIZE';
export interface SetCurrentDraftSizeAction {
  type: typeof SET_CURRENT_DRAFT_SIZE;
  id: DeckId;
  size: number;
  mode: 'extra' | undefined;
}

export interface EditDeckState {
  nameChange?: string;
  descriptionChange?: string;
  tabooSetChange?: number;
  tagsChange?: string;
  xpAdjustment: number;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  side: Slots;
  meta: DeckMeta;
  mode: 'edit' | 'upgrade' | 'view';
  editable: boolean;
}
export const START_DECK_EDIT = 'START_DECK_EDIT';
export interface StartDeckEditAction {
  type: typeof START_DECK_EDIT;
  id: DeckId;
  deck?: Deck;
  mode?: 'edit' | 'upgrade' | 'view';
  editable: boolean;
}

export const UPDATE_DECK_EDIT = 'UPDATE_DECK_EDIT';
export interface UpdateDeckEditAction {
  type: typeof UPDATE_DECK_EDIT;
  id: DeckId;
  updates: Partial<EditDeckState>;
}

export const UPDATE_DECK_EDIT_COUNTS = 'UPDATE_DECK_EDIT_COUNTS';

type BasicUpdateDeckEditCountsSetAction<T> = {
  type: typeof UPDATE_DECK_EDIT_COUNTS;
  id: DeckId;
  code: string;
  operation: 'set';
  value: number;
} & T;

type UpdateDeckEditCountsSetAction = BasicUpdateDeckEditCountsSetAction<{
  countType:
    | 'slots'
    | 'ignoreDeckLimitSlots'
    | 'side'
    | 'extra'
    | 'xpAdjustment';
}> | BasicUpdateDeckEditCountsSetAction<{
  countType: 'attachment';
  attachment_code: string;
}>;

type BasicUpdateDeckEditCountsAdjustAction<T> = {
  type: typeof UPDATE_DECK_EDIT_COUNTS;
  id: DeckId;
  code: string;
  operation: 'inc' | 'dec';
  limit?: number;
} & T;

type UpdateDeckEditCountsAdjustAction = BasicUpdateDeckEditCountsAdjustAction<{
  countType:
    | 'slots'
    | 'ignoreDeckLimitSlots'
    | 'side'
    | 'extra'
    | 'xpAdjustment';
}> | BasicUpdateDeckEditCountsAdjustAction<{
  countType: 'attachment';
  attachment_code: string;
}>;

export type UpdateDeckEditCountsAction =
  | UpdateDeckEditCountsSetAction
  | UpdateDeckEditCountsAdjustAction;

export const FINISH_DECK_EDIT = 'FINISH_DECK_EDIT';
export interface FinishDeckEditAction {
  type: typeof FINISH_DECK_EDIT;
  id: DeckId;
}

export const SET_MY_DECKS = 'SET_MY_DECKS';
export interface SetMyDecksAction {
  type: typeof SET_MY_DECKS;
  decks: ArkhamDbDeck[];
  lastModified: string;
  timestamp: Date;
}
export const MY_DECKS_START_REFRESH = 'MY_DECKS_START_REFRESH';
export interface MyDecksStartRefreshAction {
  type: typeof MY_DECKS_START_REFRESH;
}

export const MY_DECKS_CACHE_HIT = 'MY_DECKS_CACHE_HIT';
export interface MyDecksCacheHitAction {
  type: typeof MY_DECKS_CACHE_HIT;
  timestamp: Date;
}
export const MY_DECKS_ERROR = 'MY_DECKS_ERROR';
export interface MyDecksErrorAction {
  type: typeof MY_DECKS_ERROR;
  error: string;
}
export const SYNC_IN_COLLECTION = 'SYNC_IN_COLLECTION';
export interface SyncInCollectionAction {
  type: typeof SYNC_IN_COLLECTION;
  updates: { [key: string]: boolean };
}
export const SYNC_PACK_SPOILER = 'SYNC_PACK_SPOILER';
export interface SyncPackSpoilerAction {
  type: typeof SYNC_PACK_SPOILER;
  updates: { [key: string]: boolean };
}

export const SET_PACK_DRAFT = 'SET_PACK_DRAFT';
export interface SetPackDraftAction {
  type: typeof SET_PACK_DRAFT;
  code?: string;
  cycle_code?: string;
  value: boolean;
}

export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export interface NewCampaignAction {
  type: typeof NEW_CAMPAIGN;
  uuid: string;
  now: Date;
  name: string;
  difficulty?: CampaignDifficulty;
  cycleCode: CampaignCycleCode;
  deckIds: DeckId[];
  investigatorIds: string[];
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignLog: CustomCampaignLog;
  guided: boolean;
}

export interface StandaloneId {
  campaignId: string;
  scenarioId: string;
}

export const NEW_STANDALONE = 'NEW_STANDALONE';
export interface NewStandaloneCampaignAction {
  type: typeof NEW_STANDALONE;
  uuid: string;
  now: Date;
  name: string;
  standaloneId: StandaloneId;
  deckIds: DeckId[];
  investigatorIds: string[];
  weaknessSet: WeaknessSet;
}
export const NEW_LINKED_CAMPAIGN = 'NEW_LINKED_CAMPAIGN';
export interface NewLinkedCampaignAction {
  type: typeof NEW_LINKED_CAMPAIGN;
  uuid: string;
  uuidA: string;
  uuidB: string;
  now: Date;
  name: string;
  weaknessSet: WeaknessSet;
  cycleCode: CampaignCycleCode;
  cycleCodeA: CampaignCycleCode;
  cycleCodeB: CampaignCycleCode;
  guided: true;
}

export const RESTORE_COMPLEX_BACKUP = 'RESTORE_COMPLEX_BACKUP';
export interface RestoreComplexBackupAction {
  type: typeof RESTORE_COMPLEX_BACKUP;
  campaigns: Campaign[];
  decks: Deck[];
  guides: CampaignGuideState[];
}

export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';
type CampaignUpdate = Partial<Campaign>;

export interface UpdateCampaignAction {
  type: typeof UPDATE_CAMPAIGN;
  id: CampaignId;
  campaign: CampaignUpdate;
  now: Date;
}

export const UPDATE_CAMPAIGN_TRAUMA = 'UPDATE_CAMPAIGN_TRAUMA';

export interface UpdateCampaignTraumaAction {
  type: typeof UPDATE_CAMPAIGN_TRAUMA;
  id: CampaignId;
  investigator: string;
  trauma: TraumaAndCardData;
  now: Date;
}

export const UPDATE_CAMPAIGN_XP = 'UPDATE_CAMPAIGN_XP';
export interface UpdateCampaignXpAction {
  type: typeof UPDATE_CAMPAIGN_XP;
  id: CampaignId;
  investigator: string;
  operation: 'set';
  xpType: 'spentXp' | 'availableXp';
  value: number;
  now: Date;
}

export const UPDATE_CHAOS_BAG_RESULTS = 'UPDATE_CHAOS_BAG_RESULTS';
export interface UpdateChaosBagResultsAction {
  type: typeof UPDATE_CHAOS_BAG_RESULTS;
  id: CampaignId;
  chaosBagResults: ChaosBagResults;
  now: Date;
}

export const ADJUST_BLESS_CURSE = 'ADJUST_BLESS_CURSE';
export interface AdjustBlessCurseAction {
  type: typeof ADJUST_BLESS_CURSE;
  id: CampaignId;
  bless: number;
  curse: number;
  now: Date;
}

export const CLEAN_BROKEN_CAMPAIGNS = 'CLEAN_BROKEN_CAMPAIGNS';
export interface CleanBrokenCampaignsAction {
  type: typeof CLEAN_BROKEN_CAMPAIGNS;
}

export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export interface DeleteCampaignAction {
  type: typeof DELETE_CAMPAIGN;
  id: CampaignId;
}

export const CAMPAIGN_ADD_INVESTIGATOR = 'CAMPAIGN_ADD_INVESTIGATOR';
export interface CampaignAddInvestigatorAction {
  type: typeof CAMPAIGN_ADD_INVESTIGATOR;
  id: CampaignId;
  investigator: string;
  deckId?: DeckId;
  now: Date;
}

export const CAMPAIGN_REMOVE_INVESTIGATOR = 'CAMPAIGN_REMOVE_INVESTIGATOR';
export interface CampaignRemoveInvestigatorAction {
  type: typeof CAMPAIGN_REMOVE_INVESTIGATOR;
  id: CampaignId;
  investigator: string;
  removeDeckId?: DeckId;
  now: Date;
}

export const SET_CAMPAIGN_NOTES = 'SET_CAMPAIGN_NOTES';
export interface SetCampaignNotesAction {
  type: typeof SET_CAMPAIGN_NOTES;
  campaignId: CampaignId;
  campaignNotes: CampaignNotes;
  now: Date;
}
export const NEW_WEAKNESS_SET = 'NEW_WEAKNESS_SET';
export const EDIT_WEAKNESS_SET = 'EDIT_WEAKNESS_SET';
export const DELETE_WEAKNESS_SET = 'DELETE_WEAKNESS_SET';

export const ARKHAM_CARDS_LOGIN = 'ARKHAM_CARDS_LOGIN';
interface ArkhamCardsLoginAction {
  type: typeof ARKHAM_CARDS_LOGIN;
  user: string;
}

export const ARKHAM_CARDS_LOGOUT = 'ARKHAM_CARDS_LOGOUT';
interface ArkhamCardsLogoutAction {
  type: typeof ARKHAM_CARDS_LOGOUT;
}

export const ARKHAMDB_LOGIN_STARTED = 'ARKHAMDB_LOGIN_STARTED';
interface ArkhamDbLoginStartedAction {
  type: typeof ARKHAMDB_LOGIN_STARTED;
}

export const ARKHAMDB_LOGIN = 'ARKHAMDB_LOGIN';
interface ArkhamDbLoginAction {
  type: typeof ARKHAMDB_LOGIN;
}

export const ARKHAMDB_LOGIN_ERROR = 'ARKHAMDB_LOGIN_ERROR';
interface ArkhamDbLoginErrorAction {
  type: typeof ARKHAMDB_LOGIN_ERROR;
  error: Error | string;
}

export const ARKHAMDB_LOGIN_WITH_ARKHAM_CARDS =
  'ARKHAMDB_LOGIN_WITH_ARKHAMCARDS';
interface ArkhamDbLoginWithArkhamCardsAction {
  type: typeof ARKHAMDB_LOGIN_WITH_ARKHAM_CARDS;
}

export const ARKHAMDB_LOGOUT = 'ARKHAMDB_LOGOUT';
interface ArkhamDbLogoutAction {
  type: typeof ARKHAMDB_LOGOUT;
}

export const CLEAR_FILTER = 'CLEAR_FILTER';
export interface ClearFilterAction {
  type: typeof CLEAR_FILTER;
  id: string;
  clearTraits?: string[];
}
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export interface ToggleFilterAction {
  type: typeof TOGGLE_FILTER;
  id: string;
  key: keyof FilterState;
  value: boolean;
}

export const UPDATE_FILTER = 'UPDATE_FILTER';
export interface UpdateFilterAction {
  type: typeof UPDATE_FILTER;
  id: string;
  key: keyof FilterState;
  value: any;
}
export const TOGGLE_MYTHOS = 'TOGGLE_MYTHOS';
export interface ToggleMythosAction {
  type: typeof TOGGLE_MYTHOS;
  id: string;
  value: boolean;
}

export type CardScreenType =
  | 'browse'
  | 'investigator'
  | 'deck'
  | 'checklist'
  | 'pack';

export const UPDATE_CARD_SORT = 'UPDATE_CARD_SORT';
export interface UpdateCardSortAction {
  type: typeof UPDATE_CARD_SORT;
  cardScreen: CardScreenType;
  mythosMode: boolean;
  sorts: SortType[];
}

export const ADD_FILTER_SET = 'ADD_FILTER_SET';
export interface AddFilterSetAction {
  type: typeof ADD_FILTER_SET;
  id: string;
  filters: FilterState;
  mythosToggle?: boolean;
  cardData: CardFilterData;
}

export const REMOVE_FILTER_SET = 'REMOVE_FILTER_SET';
export interface RemoveFilterSetAction {
  type: typeof REMOVE_FILTER_SET;
  id: string;
}

export const SYNC_DECK = 'SYNC_DECK';
export interface SyncDeckAction {
  type: typeof SYNC_DECK;
  campaignId: UploadedCampaignId;
  investigator: string;
  uploading: boolean;
}

interface BasicInput {
  scenario?: string;
}

export interface GuideSuppliesInput extends BasicInput {
  type: 'supplies';
  step: string;
  supplies: {
    [code: string]: {
      [id: string]: number;
    };
  };
}

export interface GuideDecisionInput extends BasicInput {
  type: 'decision';
  step: string;
  decision: boolean;
}

export interface DelayedDeckEdits {
  userId: string;
  xp: number;
  storyCounts: Slots;
  ignoreStoryCounts: Slots;
  exileCounts: Slots;
  resolved?: boolean;
  type?: 'save';
}

export interface GuideNumberChoicesInput extends BasicInput {
  type: 'choice_list';
  step: string;
  choices: NumberChoices;
  deckId?: DeckId;
  deckEdits?: DelayedDeckEdits;
}

export interface GuideStringChoicesInput extends BasicInput {
  type: 'string_choices';
  step: string;
  choices: StringChoices;
}

export interface GuideCountInput extends BasicInput {
  type: 'count';
  step: string;
  count: number;
}

export interface GuideStringInput extends BasicInput {
  type: 'text';
  step: string;
  text: string;
}

export interface GuideChoiceInput extends BasicInput {
  type: 'choice';
  step: string;
  choice: number;
}

export interface EmbarkData {
  previousScenarioId: string;
  departure?: string;
  destination: string;
  time: number;
  nextScenario: string;
  fast: boolean;
  transit: boolean;
}

export interface GuideStartScenarioInput extends BasicInput {
  type: 'start_scenario';
  step: undefined;
  embarkData?: EmbarkData;
}

export interface GuideInterScenarioInput extends BasicInput {
  type: 'inter_scenario';
  investigatorData: InvestigatorTraumaData;
  campaignLogEntries?: string[];
  step: undefined;
}

interface StartSideScenarioInput extends BasicInput {
  type: 'start_side_scenario';
  scenario: string;
  previousScenarioId: string;
  step: undefined;
  embarkData?: EmbarkData;
}
export interface GuideStartSideScenarioInput extends StartSideScenarioInput {
  sideScenarioType: 'official';
}

export interface GuideStartCustomSideScenarioInput
  extends StartSideScenarioInput {
  sideScenarioType: 'custom';
  name: string;
  xpCost: number;
}

export interface GuideCampaignLinkInput extends BasicInput {
  type: 'campaign_link';
  step: string;
  decision: string;
}

export const SYSTEM_BASED_GUIDE_INPUT_IDS = new Set([
  LEAD_INVESTIGATOR_STEP_ID,
]);
export const SYSTEM_BASED_GUIDE_INPUT_TYPES = new Set([
  'campaign_link',
  'inter_scenario',
]);

export type GuideInput =
  | GuideSuppliesInput
  | GuideDecisionInput
  | GuideNumberChoicesInput
  | GuideStringChoicesInput
  | GuideCountInput
  | GuideChoiceInput
  | GuideStringInput
  | GuideStartScenarioInput
  | GuideCampaignLinkInput
  | GuideStartSideScenarioInput
  | GuideStartCustomSideScenarioInput
  | GuideInterScenarioInput;

export function guideInputToId(input: GuideInput) {
  return `${input.scenario || ''}***${input.step || ''}***${
    input.type
  }`.replace(/[.$[\]#\\/]/g, '_');
}

export function guideAchievementToId(input: GuideAchievement) {
  return `${input.id}***${input.type}`.replace(/[.$[\]#\\/]/g, '_');
}

export const GUIDE_RESET_SCENARIO = 'GUIDE_RESET_SCENARIO';
export interface GuideResetScenarioAction {
  type: typeof GUIDE_RESET_SCENARIO;
  campaignId: CampaignId;
  scenarioId: string;
  now: Date;
}

export const GUIDE_SET_INPUT = 'GUIDE_SET_INPUT';
export interface GuideSetInputAction {
  type: typeof GUIDE_SET_INPUT;
  campaignId: CampaignId;
  input: GuideInput;
  now: Date;
}

export const GUIDE_UNDO_INPUT = 'GUIDE_UNDO_INPUT';
export interface GuideUndoInputAction {
  type: typeof GUIDE_UNDO_INPUT;
  campaignId: CampaignId;
  scenarioId: string;
  now: Date;
}

export const GUIDE_UPDATE_ACHIEVEMENT = 'GUIDE_UPDATE_ACHIEVEMENT';
export interface GuideUpdateAchievementAction {
  type: typeof GUIDE_UPDATE_ACHIEVEMENT;
  campaignId: CampaignId;
  id: string;
  operation: 'set' | 'clear' | 'set_value';
  value?: number;
  now: Date;
}

export interface SupplyCounts {
  [code: string]: {
    [id: string]: number;
  };
}

export interface NumberChoices {
  [code: string]: number[];
}

export interface StringChoices {
  [code: string]: string[];
}

export interface GuideBinaryAchievement {
  id: string;
  type: 'binary';
  value: boolean;
}
export interface GuideCountAchievement {
  id: string;
  type: 'count';
  value: number;
}
export type GuideAchievement = GuideBinaryAchievement | GuideCountAchievement;

interface BaseCampaignGuideState {
  inputs: GuideInput[];
  undo?: string[];
  achievements?: GuideAchievement[];
  lastUpdated?: Date;
}
export interface CampaignGuideState extends BaseCampaignGuideState {
  uuid: string;
}
export interface LegacyCampaignGuideState extends BaseCampaignGuideState {
  uuid: undefined;
}

export const ENSURE_UUID = 'ENSURE_UUID';
export interface EnsureUuidAction {
  type: typeof ENSURE_UUID;
}

export const RESET_DECK_CHECKLIST = 'RESET_DECK_CHECKLIST';
export interface ResetDeckChecklistAction {
  type: typeof RESET_DECK_CHECKLIST;
  id: DeckId;
}

export const SET_DECK_CHECKLIST_CARD = 'SET_DECK_CHECKLIST_CARD';
export interface SetDeckChecklistCardAction {
  type: typeof SET_DECK_CHECKLIST_CARD;
  id: DeckId;
  card: string;
  value: number;
  toggle: boolean;
}

export const REDUX_MIGRATION = 'REDUX_MIGRATION';
interface ReduxMigrationV1Action {
  type: typeof REDUX_MIGRATION;
  version: 1;
  campaigns: Campaign[];
  decks: Deck[];
  guides: CampaignGuideState[];
  chaosBags: {
    [uuid: string]: ChaosBagResults;
  };
}

export const SET_INVESTIGATOR_SORT = 'SET_INVESTIGATOR_SORT';
export interface SetInvestigatorSortAction {
  type: typeof SET_INVESTIGATOR_SORT;
  sort: SortType;
}

export type ReduxMigrationAction = ReduxMigrationV1Action;

export type SettingsActions = SetCurrentTabooSetAction;
export type FilterActions =
  | ClearFilterAction
  | ToggleFilterAction
  | UpdateFilterAction
  | AddFilterSetAction
  | RemoveFilterSetAction
  | ToggleMythosAction
  | UpdateCardSortAction;

export type PacksActions =
  | PacksFetchStartAction
  | PacksFetchErrorAction
  | PacksCacheHitAction
  | PacksAvailableAction
  | CustomPacksAvailableAction
  | SyncInCollectionAction
  | SyncPackSpoilerAction
  | SetPackDraftAction
  | UpdatePromptDismissedAction;

export type SignInActions =
  | ArkhamCardsLoginAction
  | ArkhamCardsLogoutAction
  | ArkhamDbLoginAction
  | ArkhamDbLoginWithArkhamCardsAction
  | ArkhamDbLoginStartedAction
  | ArkhamDbLoginErrorAction
  | ArkhamDbLogoutAction;

export type DecksActions =
  | ArkhamDbLogoutAction
  | RestoreComplexBackupAction
  | MyDecksStartRefreshAction
  | MyDecksCacheHitAction
  | MyDecksErrorAction
  | SetMyDecksAction
  | NewDeckAvailableAction
  | DeleteDeckAction
  | UpdateDeckAction
  | ClearDecksAction
  | ReplaceLocalDeckAction
  | EnsureUuidAction
  | ReduxMigrationAction
  | UploadDeckAction
  | RemoveUploadDeckAction
  | SetUploadedDecksAction
  | SetCurrentDraftAction
  | ClearCurrentDraftAction
  | SetCurrentDraftSizeAction
  | UpdateDeckEditAction
  | SetPackDraftAction
  | SyncInCollectionAction;

export type DeckEditsActions =
  | DeleteDeckAction
  | ReplaceLocalDeckAction
  | ResetDeckChecklistAction
  | SetDeckChecklistCardAction
  | DeleteDeckAction
  | UpdateDeckAction
  | StartDeckEditAction
  | UpdateDeckEditAction
  | FinishDeckEditAction
  | UpdateDeckEditCountsAction
  | SyncDeckAction;

export type CampaignActions =
  | ArkhamDbLogoutAction
  | RestoreComplexBackupAction
  | ReplaceLocalDeckAction
  | CleanBrokenCampaignsAction
  | NewCampaignAction
  | NewStandaloneCampaignAction
  | NewLinkedCampaignAction
  | UpdateCampaignAction
  | UpdateCampaignXpAction
  | UpdateCampaignTraumaAction
  | DeleteCampaignAction
  | UpdateChaosBagResultsAction
  | CampaignAddInvestigatorAction
  | CampaignRemoveInvestigatorAction
  | SetCampaignNotesAction
  | AdjustBlessCurseAction
  | EnsureUuidAction
  | ReduxMigrationAction;

export type GuideActions =
  | DeleteCampaignAction
  | RestoreComplexBackupAction
  | ArkhamDbLogoutAction
  | GuideSetInputAction
  | GuideUndoInputAction
  | GuideResetScenarioAction
  | GuideUpdateAchievementAction
  | ReduxMigrationAction;

export const DISSONANT_VOICES_LOGIN_STARTED = 'DISSONANT_VOICES_LOGIN_STARTED';
interface DissonantVoicesLoginStartedAction {
  type: typeof DISSONANT_VOICES_LOGIN_STARTED;
}

export const DISSONANT_VOICES_LOGIN = 'DISSONANT_VOICES_LOGIN';
interface DissonantVoicesLoginAction {
  type: typeof DISSONANT_VOICES_LOGIN;
}

export const DISSONANT_VOICES_LOGIN_ERROR = 'DISSONANT_VOICES_LOGIN_ERROR';
interface DissonantVoicesLoginErrorAction {
  type: typeof DISSONANT_VOICES_LOGIN_ERROR;
  error: Error | string;
}

export const DISSONANT_VOICES_LOGOUT = 'DISSONANT_VOICES_LOGOUT';
interface DissonantVoicesLogoutAction {
  type: typeof DISSONANT_VOICES_LOGOUT;
}

export type DissonantVoicesActions =
  | DissonantVoicesLoginAction
  | DissonantVoicesLoginStartedAction
  | DissonantVoicesLoginErrorAction
  | DissonantVoicesLogoutAction;

export const TRACKED_QUERIES_ADD = 'TRACKED_QUERIES_ADD';
export const TRACKED_QUERIES_REMOVE = 'TRACKED_QUERIES_REMOVE';

export interface TrackedQuery {
  contextJSON: string;
  id: string;
  name: string;
  variablesJSON: string;
}

export interface TrackedQueriesAddAction {
  type: typeof TRACKED_QUERIES_ADD;
  payload: TrackedQuery;
}

export interface TrackedQueriesRemoveAction {
  type: typeof TRACKED_QUERIES_REMOVE;
  payload: string;
}

export type TrackedQueriesAction =
  | TrackedQueriesAddAction
  | TrackedQueriesRemoveAction;
