import { ChaosBag, ChaosTokenType, FactionCodeType, SkillCodeType, SlotCodeType } from '@app_constants';
import { CardFilterData, FilterState } from '@lib/filters';
import Card from '@data/Card';

export const SORT_BY_TYPE = 'type';
export const SORT_BY_FACTION = 'faction';
export const SORT_BY_FACTION_PACK = 'faction_pack';
export const SORT_BY_COST = 'cost';
export const SORT_BY_PACK = 'pack';
export const SORT_BY_TITLE = 'title';
export const SORT_BY_ENCOUNTER_SET = 'encounter_set';

export type SortType =
  typeof SORT_BY_TYPE |
  typeof SORT_BY_FACTION |
  typeof SORT_BY_FACTION_PACK |
  typeof SORT_BY_COST |
  typeof SORT_BY_PACK |
  typeof SORT_BY_TITLE |
  typeof SORT_BY_ENCOUNTER_SET;

export interface Slots {
  [code: string]: number;
}
const INVESTIGATOR = 'investigator';
const TOO_MANY_COPIES = 'too_many_copies';
const INVALID_CARDS = 'invalid_cards';
const TOO_FEW_CARDS = 'too_few_cards';
const TOO_MANY_CARDS = 'too_many_cards';
const DECK_OPTIONS_LIMIT = 'deck_options_limit';

export type DeckProblemType =
  typeof INVESTIGATOR |
  typeof TOO_MANY_COPIES |
  typeof INVALID_CARDS |
  typeof TOO_FEW_CARDS |
  typeof TOO_MANY_CARDS |
  typeof DECK_OPTIONS_LIMIT;

export interface DeckProblem {
  reason: DeckProblemType;
  problems?: string[];
}

export interface DeckMeta {
  faction_selected?: FactionCodeType;
  deck_size_selected?: string;
  alternate_front?: string;
  alternate_back?: string;
}

export interface LocalDeckId {
  id: undefined;
  local: true;
  uuid: string;
}
export interface ArkhamDbDeckId {
  id: number;
  local: false;
  uuid: string;
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
  exile_string?: string;
  problem?: DeckProblemType;
  version?: string;
  xp?: number;
  xp_adjustment?: number;
  spentXp?: number;
  next_deck?: number;
  previous_deck?: number;
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
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  exile_string?: string;
  problem?: DeckProblemType;
  version?: string;
  xp?: number;
  xp_adjustment?: number;
  spentXp?: number;
  nextDeckId?: DeckId;
  previousDeckId?: DeckId;
}

export interface ArkhamDbDeck extends BaseDeck {
  id: number;
  local: undefined;
  uuid: undefined;
}

interface LocalDeck extends BaseDeck {
  local: true;
  uuid: string;
}

export function getDeckId(deck: Deck): DeckId {
  if (deck.local) {
    return {
      id: undefined,
      local: true,
      uuid: deck.uuid,
    };
  }
  return {
    id: deck.id,
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
}

export interface DeckChanges {
  added: Slots;
  removed: Slots;
  upgraded: Slots;
  exiled: Slots;
  spentXp: number;
}

export interface CardId {
  id: string;
  quantity: number;
  invalid: boolean;
  limited: boolean;
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

export interface ParsedDeck {
  id: DeckId;
  investigator: Card;
  deck: Deck;
  slots: Slots;
  normalCardCount: number;
  totalCardCount: number;
  experience: number;
  availableExperience: number;
  packs: number;
  factionCounts: FactionCounts;
  costHistogram: number[];
  skillIconCounts: SkillCounts;
  slotCounts: SlotCounts;
  normalCards: SplitCards;
  specialCards: SplitCards;
  ignoreDeckLimitSlots: Slots;
  changes?: DeckChanges;
  problem?: DeckProblem;
  limitedSlots: boolean;
}

export interface Pack {
  id: string;
  name: string;
  code: string;
  position: number;
  cycle_position: number;
  available: string;
  known: number;
  total: number;
  url: string;
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

export interface ChaosBagResults {
  drawnTokens: ChaosTokenType[];
  sealedTokens: {
    id: string;
    icon: ChaosTokenType;
  }[];
  blessTokens?: number;
  curseTokens?: number;
  totalDrawnTokens: number;
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
  decks: Deck[];
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
export const TDE = 'tde';
export const TDEA = 'tdea';
export const TDEB = 'tdeb';
export const TIC = 'tic';
export const STANDALONE = 'standalone';

export type CampaignCycleCode =
  typeof CUSTOM |
  typeof CORE |
  typeof RTNOTZ |
  typeof DWL |
  typeof RTDWL |
  typeof PTC |
  typeof RTPTC |
  typeof TFA |
  typeof RTTFA |
  typeof TCU |
  typeof TDE |
  typeof TDEA |
  typeof TDEB |
  typeof TIC |
  typeof STANDALONE;

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
  TDE,
  TDEA,
  TDEB,
  TIC,
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
  TDE,
  TDEA,
  TDEB,
  TIC,
]);

export const INCOMPLETE_GUIDED_CAMPAIGNS = new Set([
  TIC,
]);

export interface CustomCampaignLog {
  sections?: string[];
  counts?: string[];
  investigatorSections?: string[];
  investigatorCounts?: string[];
}

export interface InvestigatorNotes {
  sections: InvestigatorCampaignNoteSection[];
  counts: InvestigatorCampaignNoteCount[];
}

export interface CampaignNotes {
  sections: CampaignNoteSection[];
  counts: CampaignNoteCount[];
  investigatorNotes: InvestigatorNotes;
}

export interface CampaignId {
  campaignId: string;
  serverId?: string;
}

interface BaseCampaign {
  serverId?: string;
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
  investigatorData: InvestigatorData;
  adjustedInvestigatorData?: InvestigatorData;
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignNotes: CampaignNotes;
  scenarioResults: ScenarioResult[];
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
}

export const SET_SINGLE_CARD_VIEW = 'SET_SINGLE_CARD_VIEW';
export interface SetSingleCardViewAction {
  type: typeof SET_SINGLE_CARD_VIEW;
  singleCardView: boolean;
}

export const SET_ALPHABETIZE_ENCOUNTER_SETS = 'SET_ALPHABETIZE_ENCOUNTER_SETS';
export interface SetAlphabetizeEncounterSetsAction {
  type: typeof SET_ALPHABETIZE_ENCOUNTER_SETS;
  alphabetizeEncounterSets: boolean;
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

export interface CardCache {
  cardCount: number;
  lastModified?: string;
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

export const CARD_FETCH_SUCCESS = 'CARD_FETCH_SUCCESS';
export interface CardFetchSuccessAction {
  type: typeof CARD_FETCH_SUCCESS;
  cache?: CardCache;
  tabooCache?: TabooCache;
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

export interface EditDeckState {
  nameChange?: string;
  descriptionChange?: string;
  tabooSetChange?: number;
  xpAdjustment: number;
  slots: Slots;
  ignoreDeckLimitSlots: Slots;
  meta: DeckMeta;
  mode: 'edit' | 'upgrade' | 'view';
}
export const START_DECK_EDIT = 'START_DECK_EDIT';
export interface StartDeckEditAction {
  type: typeof START_DECK_EDIT;
  id: DeckId;
  deck?: Deck;
  mode?: 'edit' | 'upgrade' | 'view';
}

export const UPDATE_DECK_EDIT = 'UPDATE_DECK_EDIT';
export interface UpdateDeckEditAction {
  type: typeof UPDATE_DECK_EDIT;
  id: DeckId;
  updates: Partial<EditDeckState>;
}

export const UPDATE_DECK_EDIT_COUNTS = 'UPDATE_DECK_EDIT_COUNTS';

interface UpdateDeckEditCountsSetAction {
  type: typeof UPDATE_DECK_EDIT_COUNTS;
  id: DeckId;
  code: string;
  operation: 'set';
  value: number;
  countType: 'slots' | 'ignoreDeckLimitSlots' | 'xpAdjustment';
}
interface UpdateDeckEditCountsAdjustAction {
  type: typeof UPDATE_DECK_EDIT_COUNTS;
  id: DeckId;
  code: string;
  operation: 'inc' | 'dec';
  limit?: number;
  countType: 'slots' | 'ignoreDeckLimitSlots' | 'xpAdjustment';
}
export type UpdateDeckEditCountsAction = UpdateDeckEditCountsSetAction | UpdateDeckEditCountsAdjustAction;

export const FINISH_DECK_EDIT = 'FINISH_DECK_EDIT';
export interface FinishDeckEditAction {
  type: typeof FINISH_DECK_EDIT;
  id: DeckId;
}

export const SET_MY_DECKS = 'SET_MY_DECKS';
export interface SetMyDecksAction {
  type: typeof SET_MY_DECKS;
  decks: Deck[];
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
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';
export interface SetInCollectionAction {
  type: typeof SET_IN_COLLECTION;
  code?: string;
  cycle_code?: string;
  value: boolean;
}
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';
export interface SetPackSpoilerAction {
  type: typeof SET_PACK_SPOILER;
  code?: string;
  cycle_code?: string;
  value: boolean;
}
export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export interface NewCampaignAction {
  type: typeof NEW_CAMPAIGN;
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
  id: string;
  campaign: CampaignUpdate;
  now: Date;
}

export const UPDATE_CAMPAIGN_SPENT_XP = 'UPDATE_CAMPAIGN_SPENT_XP';
export interface UpdateCampaignSpentXpAction {
  type: typeof UPDATE_CAMPAIGN_SPENT_XP;
  id: string;
  investigator: string;
  operation: 'inc' | 'dec';
  now: Date;
}

export const UPDATE_CHAOS_BAG_RESULTS = 'UPDATE_CHAOS_BAG_RESULTS';
export interface UpdateChaosBagResultsAction {
  type: typeof UPDATE_CHAOS_BAG_RESULTS;
  id: string;
  chaosBagResults: ChaosBagResults;
  now: Date;
}

export const ADJUST_BLESS_CURSE = 'ADJUST_BLESS_CURSE';
export interface AdjustBlessCurseAction {
  type: typeof ADJUST_BLESS_CURSE;
  id: string;
  bless: boolean;
  direction: 'inc' | 'dec';
  now: Date;
}

export const CLEAN_BROKEN_CAMPAIGNS = 'CLEAN_BROKEN_CAMPAIGNS';
export interface CleanBrokenCampaignsAction {
  type: typeof CLEAN_BROKEN_CAMPAIGNS;
}

export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export interface DeleteCampaignAction {
  type: typeof DELETE_CAMPAIGN;
  id: string;
}

export const CAMPAIGN_ADD_INVESTIGATOR = 'CAMPAIGN_ADD_INVESTIGATOR';
export interface CampaignAddInvestigatorAction {
  type: typeof CAMPAIGN_ADD_INVESTIGATOR;
  id: string;
  investigator: string;
  deckId?: DeckId;
  now: Date;
}

export const CAMPAIGN_REMOVE_INVESTIGATOR = 'CAMPAIGN_REMOVE_INVESTIGATOR';
export interface CampaignRemoveInvestigatorAction {
  type: typeof CAMPAIGN_REMOVE_INVESTIGATOR;
  id: string;
  investigator: string;
  removeDeckId?: DeckId;
  now: Date;
}

export const ADD_CAMPAIGN_SCENARIO_RESULT = 'ADD_CAMPAIGN_SCENARIO_RESULT';
export interface AddCampaignScenarioResultAction {
  type: typeof ADD_CAMPAIGN_SCENARIO_RESULT;
  id: string;
  scenarioResult: ScenarioResult;
  campaignNotes?: CampaignNotes;
  now: Date;
}
export const EDIT_CAMPAIGN_SCENARIO_RESULT = 'EDIT_CAMPAIGN_SCENARIO_RESULT';
export interface EditCampaignScenarioResultAction {
  type: typeof EDIT_CAMPAIGN_SCENARIO_RESULT;
  id: string;
  index: number;
  scenarioResult: ScenarioResult;
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
export const UPDATE_CARD_SORT = 'UPDATE_CARD_SORT';
export interface UpdateCardSortAction {
  type: typeof UPDATE_CARD_SORT;
  id: string;
  sort: SortType;
}

export const ADD_FILTER_SET = 'ADD_FILTER_SET';
export interface AddFilterSetAction {
  type: typeof ADD_FILTER_SET;
  id: string;
  filters: FilterState;
  sort?: SortType;
  mythosToggle?: boolean;
  cardData: CardFilterData;
}

export const SYNC_FILTER_SET = 'SYNC_FILTER_SET';
export interface SyncFilterSetAction {
  type: typeof SYNC_FILTER_SET;
  id: string;
  filters: FilterState;
}

export const REMOVE_FILTER_SET = 'REMOVE_FILTER_SET';
export interface RemoveFilterSetAction {
  type: typeof REMOVE_FILTER_SET;
  id: string;
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

export interface GuideNumberChoicesInput extends BasicInput {
  type: 'choice_list';
  step: string;
  choices: NumberChoices;
  deckId?: DeckId;
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

export interface GuideStartScenarioInput extends BasicInput {
  type: 'start_scenario';
  step: undefined;
}

export interface GuideInterScenarioInput extends BasicInput {
  type: 'inter_scenario';
  investigatorData: InvestigatorTraumaData;
  step: undefined;
}

interface StartSideScenarioInput extends BasicInput {
  type: 'start_side_scenario';
  scenario: string;
  previousScenarioId: string;
  step: undefined;
}
export interface GuideStartSideScenarioInput extends StartSideScenarioInput {
  sideScenarioType: 'official';
}

export interface GuideStartCustomSideScenarioInput extends StartSideScenarioInput {
  sideScenarioType: 'custom';
  name: string;
  xpCost: number;
}

export interface GuideCampaignLinkInput extends BasicInput {
  type: 'campaign_link';
  step: string;
  decision: string;
}

export type GuideInput =
  GuideSuppliesInput |
  GuideDecisionInput |
  GuideNumberChoicesInput |
  GuideStringChoicesInput |
  GuideCountInput |
  GuideChoiceInput |
  GuideStringInput |
  GuideStartScenarioInput |
  GuideCampaignLinkInput |
  GuideStartSideScenarioInput |
  GuideStartCustomSideScenarioInput |
  GuideInterScenarioInput;

export function guideInputToId(input: GuideInput) {
  return `${input.scenario || ''}***${input.step || ''}***${input.type}`.replace(/[.$[\]#\\/]/g, '_');
}

export const GUIDE_RESET_SCENARIO = 'GUIDE_RESET_SCENARIO';
export interface GuideResetScenarioAction {
  type: typeof GUIDE_RESET_SCENARIO;
  campaignId: string;
  scenarioId: string;
  now: Date;
}

export const GUIDE_SET_INPUT = 'GUIDE_SET_INPUT';
export interface GuideSetInputAction {
  type: typeof GUIDE_SET_INPUT;
  campaignId: string;
  input: GuideInput;
  now: Date;
}

export const GUIDE_UNDO_INPUT = 'GUIDE_UNDO_INPUT';
export interface GuideUndoInputAction {
  type: typeof GUIDE_UNDO_INPUT;
  campaignId: string;
  scenarioId: string;
  now: Date;
}


export const GUIDE_UPDATE_ACHIEVEMENT = 'GUIDE_UPDATE_ACHIEVEMENT';
export interface GuideUpdateAchievementAction {
  type: typeof GUIDE_UPDATE_ACHIEVEMENT;
  campaignId: string;
  id: string;
  operation: 'set' | 'clear' | 'inc' | 'dec';
  max?: number;
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
type GuideAchievement = GuideBinaryAchievement | GuideCountAchievement;

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
  value: boolean;
}

export type FilterActions =
  ClearFilterAction |
  ToggleFilterAction |
  UpdateFilterAction |
  AddFilterSetAction |
  SyncFilterSetAction |
  RemoveFilterSetAction |
  ToggleMythosAction |
  UpdateCardSortAction;

export type PacksActions =
  PacksFetchStartAction |
  PacksFetchErrorAction |
  PacksCacheHitAction |
  PacksAvailableAction |
  SetInCollectionAction |
  SetPackSpoilerAction |
  UpdatePromptDismissedAction;

export type SignInActions =
  ArkhamCardsLoginAction |
  ArkhamCardsLogoutAction |
  ArkhamDbLoginAction |
  ArkhamDbLoginStartedAction |
  ArkhamDbLoginErrorAction |
  ArkhamDbLogoutAction;

export type DecksActions =
  ArkhamDbLogoutAction |
  RestoreComplexBackupAction |
  MyDecksStartRefreshAction |
  MyDecksCacheHitAction |
  MyDecksErrorAction |
  SetMyDecksAction |
  NewDeckAvailableAction |
  DeleteDeckAction |
  UpdateDeckAction |
  ClearDecksAction |
  ReplaceLocalDeckAction |
  EnsureUuidAction;

export type DeckEditsActions =
  DeleteDeckAction |
  ReplaceLocalDeckAction |
  ResetDeckChecklistAction |
  SetDeckChecklistCardAction |
  DeleteDeckAction |
  UpdateDeckAction |
  StartDeckEditAction |
  UpdateDeckEditAction |
  FinishDeckEditAction |
  UpdateDeckEditCountsAction;

export type CampaignActions =
  ArkhamDbLogoutAction |
  RestoreComplexBackupAction |
  ReplaceLocalDeckAction |
  CleanBrokenCampaignsAction |
  NewCampaignAction |
  NewStandaloneCampaignAction |
  NewLinkedCampaignAction |
  UpdateCampaignAction |
  UpdateCampaignSpentXpAction |
  DeleteCampaignAction |
  AddCampaignScenarioResultAction |
  EditCampaignScenarioResultAction |
  UpdateChaosBagResultsAction |
  CampaignAddInvestigatorAction |
  CampaignRemoveInvestigatorAction |
  AdjustBlessCurseAction |
  EnsureUuidAction;

export type GuideActions =
  DeleteCampaignAction |
  RestoreComplexBackupAction |
  ArkhamDbLogoutAction |
  GuideSetInputAction |
  GuideUndoInputAction |
  GuideResetScenarioAction |
  GuideUpdateAchievementAction;

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
  DissonantVoicesLoginAction |
  DissonantVoicesLoginStartedAction |
  DissonantVoicesLoginErrorAction |
  DissonantVoicesLogoutAction;