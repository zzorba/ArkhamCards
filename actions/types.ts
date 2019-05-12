import { ChaosBag } from '../constants';

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

export interface Deck {
  id: number;
  name: string;
  taboo_id?: number;
  investigator_code: string;
  next_deck?: number;
  previous_deck?: number;
  local?: boolean;
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

export interface InvestigatorData {
  [code: string]: Trauma;
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
export const TFA = 'tfa';
export const TCU = 'tcu';

export type CampaignCycleCode =
  typeof CUSTOM |
  typeof CORE |
  typeof RTNOTZ |
  typeof DWL |
  typeof RTDWL |
  typeof PTC |
  typeof TFA |
  typeof TCU;

export const ALL_CAMPAIGNS: CampaignCycleCode[] = [
  CORE,
  RTNOTZ,
  DWL,
  RTDWL,
  PTC,
  TFA,
  TCU,
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
  campaign: Campaign;
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
  SetAllCampaignsAction
