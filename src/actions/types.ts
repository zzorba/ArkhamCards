import { ChaosBag, ChaosTokenType, FactionCodeType, SkillCodeType, SlotCodeType } from 'constants';
import { FilterState } from 'lib/filters';
import Card from 'data/Card';

export const SORT_BY_TYPE = 'Type';
export const SORT_BY_FACTION = 'Faction';
export const SORT_BY_COST = 'Cost';
export const SORT_BY_PACK = 'Pack';
export const SORT_BY_TITLE = 'Title';
export const SORT_BY_ENCOUNTER_SET = 'Encounter Set';

export type SortType =
  typeof SORT_BY_TYPE |
  typeof SORT_BY_FACTION |
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
}
export interface Deck {
  id: number;
  name: string;
  description_md?: string;
  taboo_id?: number;
  investigator_code: string;
  next_deck?: number;
  previous_deck?: number;
  local?: boolean;
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
}

export interface DecksMap {
  [id: number]: Deck;
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
  availableXp?: number;
  spentXp?: number;
  storyAssets?: string[];
}

export interface InvestigatorData {
  [code: string]: TraumaAndCardData;
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
  totalDrawnTokens: 0,
};

export interface ChaosBagResults {
  drawnTokens: ChaosTokenType[];
  sealedTokens: {
    id: string;
    icon: ChaosTokenType;
  }[];
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
export const TCU = 'tcu';
export const TDEA = 'tdea';
export const TDEB = 'tdeb';

export type CampaignCycleCode =
  typeof CUSTOM |
  typeof CORE |
  typeof RTNOTZ |
  typeof DWL |
  typeof RTDWL |
  typeof PTC |
  typeof RTPTC |
  typeof TFA |
  typeof TCU |
  typeof TDEA |
  typeof TDEB;

export const ALL_CAMPAIGNS: CampaignCycleCode[] = [
  CORE,
  RTNOTZ,
  DWL,
  RTDWL,
  PTC,
  RTPTC,
  TFA,
  TCU,
  TDEA,
  TDEB,
];
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

export interface Campaign {
  id: number;
  name: string;
  difficulty: CampaignDifficulty;
  cycleCode: CampaignCycleCode;
  lastUpdated: Date;
  showInterludes?: boolean;
  baseDeckIds?: number[];
  latestDeckIds?: number[]; // deprecated
  investigatorData: InvestigatorData;
  nonDeckInvestigators?: string[];
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignNotes: CampaignNotes;
  scenarioResults: ScenarioResult[];
}

export interface SingleCampaign extends Campaign {
  latestScenario?: ScenarioResult;
  finishedScenarios: string[];
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
export const CARD_FETCH_START = 'CARD_FETCH_START';
export interface CardFetchStartAction {
  type: typeof CARD_FETCH_START;
}

export const CARD_FETCH_SUCCESS = 'CARD_FETCH_SUCCESS';
export interface CardFetchSuccessAction {
  type: typeof CARD_FETCH_SUCCESS;
  cache?: CardCache;
  tabooCache?: TabooCache;
  lang: string;
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
  id: number;
  deck: Deck;
}
export const REPLACE_LOCAL_DECK = 'REPLACE_LOCAL_DECK';
export interface ReplaceLocalDeckAction {
  type: typeof REPLACE_LOCAL_DECK;
  localId: number;
  deck: Deck;
}
export const UPDATE_DECK = 'UPDATE_DECK';
export interface UpdateDeckAction {
  type: typeof UPDATE_DECK;
  id: number;
  deck: Deck;
  isWrite: boolean;
}
export const DELETE_DECK = 'DELETE_DECK';
export interface DeleteDeckAction {
  type: typeof DELETE_DECK;
  id: number;
  deleteAllVersions: boolean;
}
export const CLEAR_DECKS = 'CLEAR_DECKS';
export interface ClearDecksAction {
  type: typeof CLEAR_DECKS;
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
  cycle?: number;
  value: boolean;
}
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';
export interface SetPackSpoilerAction {
  type: typeof SET_PACK_SPOILER;
  code?: string;
  cycle?: number;
  value: boolean;
}
export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export interface NewCampaignAction {
  type: typeof NEW_CAMPAIGN;
  now: Date;
  id: number;
  name: string;
  difficulty: CampaignDifficulty;
  cycleCode: CampaignCycleCode;
  baseDeckIds: number[];
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignLog: CustomCampaignLog;
}
export const SET_ALL_CAMPAIGNS = 'SET_ALL_CAMPAIGNS';
export interface SetAllCampaignsAction {
  type: typeof SET_ALL_CAMPAIGNS;
  campaigns: {
    [id: string]: Campaign;
  };
}
export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';
export interface UpdateCampaignAction {
  type: typeof UPDATE_CAMPAIGN;
  id: number;
  campaign: Partial<Campaign>;
  now: Date;
}
export const UPDATE_CHAOS_BAG_RESULTS = 'UPDATE_CHAOS_BAG_RESULTS';
export interface UpdateChaosBagResultsAction {
  type: typeof UPDATE_CHAOS_BAG_RESULTS;
  id: number;
  chaosBagResults: ChaosBagResults;
  now: Date;
}
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export interface DeleteCampaignAction {
  type: typeof DELETE_CAMPAIGN;
  id: number;
}
export const ADD_CAMPAIGN_SCENARIO_RESULT = 'ADD_CAMPAIGN_SCENARIO_RESULT';
export interface AddCampaignScenarioResultAction {
  type: typeof ADD_CAMPAIGN_SCENARIO_RESULT;
  id: number;
  scenarioResult: ScenarioResult;
  campaignNotes?: CampaignNotes;
  now: Date;
}
export const EDIT_CAMPAIGN_SCENARIO_RESULT = 'EDIT_CAMPAIGN_SCENARIO_RESULT';
export interface EditCampaignScenarioResultAction {
  type: typeof EDIT_CAMPAIGN_SCENARIO_RESULT;
  id: number;
  index: number;
  scenarioResult: ScenarioResult;
  now: Date;
}
export const NEW_WEAKNESS_SET = 'NEW_WEAKNESS_SET';
export const EDIT_WEAKNESS_SET = 'EDIT_WEAKNESS_SET';
export const DELETE_WEAKNESS_SET = 'DELETE_WEAKNESS_SET';

export const LOGIN_STARTED = 'LOGIN_STARTED';
interface LoginStartedAction {
  type: typeof LOGIN_STARTED;
}

export const LOGIN = 'LOGIN';
interface LoginAction {
  type: typeof LOGIN;
}

export const LOGIN_ERROR = 'LOGIN_ERROR';
interface LoginErrorAction {
  type: typeof LOGIN_ERROR;
  error: Error | string;
}

export const LOGOUT = 'LOGOUT';
interface LogoutAction {
  type: typeof LOGOUT;
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

export interface GuideChoiceListInput extends BasicInput {
  type: 'choice_list';
  step: string;
  choices: ListChoices;
}

export interface GuideCountInput extends BasicInput {
  type: 'count';
  step: string;
  count: number;
}

export interface GuideChoiceInput extends BasicInput {
  type: 'choice';
  step: string;
  choice: number;
}

export interface GuideStartScenarioInput extends BasicInput {
  type: 'start_scenario';
}

export type GuideInput =
  GuideSuppliesInput |
  GuideDecisionInput |
  GuideChoiceListInput |
  GuideCountInput |
  GuideChoiceInput |
  GuideStartScenarioInput;

export const GUIDE_RESET_SCENARIO = 'GUIDE_RESET_SCENARIO';
export interface GuideResetScenarioAction {
  type: typeof GUIDE_RESET_SCENARIO;
  campaignId: number;
  scenarioId: string;
}

export const GUIDE_SET_INPUT = 'GUIDE_SET_INPUT';
export interface GuideSetInputAction {
  type: typeof GUIDE_SET_INPUT;
  campaignId: number;
  input: GuideInput;
}

export const GUIDE_UNDO_INPUT = 'GUIDE_UNDO_INPUT';
export interface GuideUndoInputAction {
  type: typeof GUIDE_UNDO_INPUT;
  campaignId: number;
}

export interface SupplyCounts {
  [code: string]: {
    [id: string]: number;
  };
}

export interface ListChoices {
  [code: string]: number[];
}

export interface CampaignGuideState {
  inputs: GuideInput[];
}

export const DEFAULT_CAMPAIGN_GUIDE_STATE: CampaignGuideState = {
  inputs: [],
};

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
  LoginAction |
  LoginStartedAction |
  LoginErrorAction |
  LogoutAction;

export type DecksActions =
  LogoutAction |
  MyDecksStartRefreshAction |
  MyDecksCacheHitAction |
  MyDecksErrorAction |
  SetMyDecksAction |
  NewDeckAvailableAction |
  DeleteDeckAction |
  UpdateDeckAction |
  ClearDecksAction |
  ReplaceLocalDeckAction;

export type CampaignActions =
  LogoutAction |
  ReplaceLocalDeckAction |
  NewCampaignAction |
  UpdateCampaignAction |
  DeleteCampaignAction |
  AddCampaignScenarioResultAction |
  EditCampaignScenarioResultAction |
  SetAllCampaignsAction |
  UpdateChaosBagResultsAction;

export type GuideActions =
  LogoutAction |
  GuideSetInputAction |
  GuideUndoInputAction |
  GuideResetScenarioAction;
