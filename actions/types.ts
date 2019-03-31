import { ChaosBag } from '../constants';

export interface Slots {
  [code: string]: number;
}

export interface Deck {
  id: number;
  name: string;
  investigator_code: string;
  next_deck?: number;
  previous_deck?: number;
  local?: boolean;
  date_update: string;
  date_creation: string;
  scenarioCount?: number;
  slots: Slots;
  ignoreDeckLimitSlots: Slots,
  exile_string?: string;
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

interface CampaignInvestigatorData {
  physical?: number;
  mental?: number;
  killed?: boolean;
  insane?: boolean;
}

interface WeaknessSet {
  packCodes: string[];
  assignedCards: {
    [code: string]: number;
  };
}

interface CampaignNoteSection {
  title: string;
  notes: string[];
  custom?: boolean;
}

interface CampaignNoteCount {
  title: string;
  count: number;
  custom?: boolean;
}

interface InvestigatorCampaignNoteSection {
  title: string;
  notes: {
    [investigator_code: string]: string[];
  };
  custom?: boolean;
}

interface InvestigatorCampaignNoteCount {
  title: string;
  counts: {
    [investigator_code: string]: number;
  };
  custom?: boolean;
}

interface ScenarioResult {
  scenario: string;
  scenarioCode: string;
  resolution: string;
  xp?: number;
  scenarioPack?: string;
  interlude?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  difficulty: string;
  cycleCode: string;
  lastUpdated: Date;
  showInterludes?: boolean;
  baseDeckIds?: number[];
  latestDeckIds?: number[]; // deprecated
  investigatorData: {
    [code: string]: CampaignInvestigatorData;
  };
  chaosBag: ChaosBag;
  weaknessSet: WeaknessSet;
  campaignNotes: {
    sections: CampaignNoteSection[];
    counts: CampaignNoteCount[];
    investigatorNotes: {
      sections: InvestigatorCampaignNoteSection[];
      counts: InvestigatorCampaignNoteCount[];
    };
  }
  scenarioResults: ScenarioResult[];
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
  lastModified: string;
}

export interface CardCache {
  cardCount: number;
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
  cache: CardCache;
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
export interface NewCampaignAction extends Campaign {
  type: typeof NEW_CAMPAIGN;
  now: Date;
  campaignLog: {
    sections?: string[];
    counts?: string[];
    investigatorSections?: string[];
    investigatorCounts?: string[];
  }
}
export const SET_ALL_CAMPAIGNS = 'SET_ALL_CAMPAIGNS';
export interface SetAllCampaignsAction {
  type: typeof SET_ALL_CAMPAIGNS;
  campaigns: { [id: string]: Campaign },
}
export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';
export interface UpdateCampaignAction {
  type: typeof UPDATE_CAMPAIGN;
  id: string;
  campaign: Campaign;
  now: Date;
}
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export interface DeleteCampaignAction {
  type: typeof DELETE_CAMPAIGN;
  id: string;
}
export const ADD_CAMPAIGN_SCENARIO_RESULT = 'ADD_CAMPAIGN_SCENARIO_RESULT';
export interface AddCampaignScenarioResultAction {
  type: typeof ADD_CAMPAIGN_SCENARIO_RESULT;
  id: string;
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
  SetAllCampaignsAction
