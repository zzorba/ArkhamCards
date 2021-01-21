import { ChaosBagResults, LegacyCampaign, LegacyCampaignGuideState, LegacyDeck, ReduxMigrationAction, REDUX_MIGRATION } from '@actions/types';

interface LegacyDecksState {
  all: {
    [id: number]: LegacyDeck;
  };
  myDecks: number[];
  replacedLocalIds?: {
    [id: number]: number;
  };
  dateUpdated: number | null;
  refreshing: boolean;
  error: string | null;
  lastModified?: string;
}
const DEFAULT_LEGACY_DECK_STATE: LegacyDecksState = {
  all: {},
  myDecks: [],
  replacedLocalIds: {},
  dateUpdated: null,
  refreshing: false,
  error: null,
  lastModified: undefined,
};

export function legacyDecks(
  state: LegacyDecksState = DEFAULT_LEGACY_DECK_STATE,
  action: ReduxMigrationAction
): LegacyDecksState {
  if (action.type === REDUX_MIGRATION) {
    if (action.version === 1) {
      return DEFAULT_LEGACY_DECK_STATE;
    }
  }
  return state;
}

export interface LegacyCampaignState {
  all: {
    [id: string]: LegacyCampaign;
  };
  chaosBagResults?: {
    [uuid: string]: ChaosBagResults | undefined;
  };
}

const DEFAULT_LEGACY_CAMPAIGNS_STATE: LegacyCampaignState = {
  all: {},
  chaosBagResults: {},
};

export function legacyCampaigns(
  state: LegacyCampaignState = DEFAULT_LEGACY_CAMPAIGNS_STATE,
  action: ReduxMigrationAction
): LegacyCampaignState {
  if (action.type === REDUX_MIGRATION) {
    if (action.version === 1) {
      return DEFAULT_LEGACY_CAMPAIGNS_STATE;
    }
    return state;
  }
  return state;
}

interface LegacyGuidesState {
  all: {
    [campaignId: string]: LegacyCampaignGuideState | undefined;
  };
}

const DEFAULT_GUIDES_STATE: LegacyGuidesState = {
  all: {},
};

export function legacyGuides(
  state: LegacyGuidesState = DEFAULT_GUIDES_STATE,
  action: ReduxMigrationAction
): LegacyGuidesState {
  if (action.type === REDUX_MIGRATION) {
    if (action.version === 1) {
      return DEFAULT_GUIDES_STATE;
    }
    return state;
  }
  return state;
}
