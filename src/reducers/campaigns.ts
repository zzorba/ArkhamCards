import { find, filter, forEach, map, uniq } from 'lodash';

import {
  LOGOUT,
  NEW_CAMPAIGN,
  UPDATE_CAMPAIGN,
  CAMPAIGN_ADD_INVESTIGATOR,
  CLEAN_BROKEN_CAMPAIGNS,
  UPDATE_CHAOS_BAG_RESULTS,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  SET_ALL_CAMPAIGNS,
  REPLACE_LOCAL_DECK,
  NEW_CHAOS_BAG_RESULTS,
  Campaign,
  CampaignActions,
  ChaosBagResults,
} from 'actions/types';

export interface CampaignsState {
  all: {
    [id: string]: Campaign;
  };
  chaosBagResults?: {
    [id: string]: ChaosBagResults;
  };
}

const DEFAULT_CAMPAIGNS_STATE: CampaignsState = {
  all: {},
  chaosBagResults: {},
};

export default function(
  state: CampaignsState = DEFAULT_CAMPAIGNS_STATE,
  action: CampaignActions
): CampaignsState {
  if (action.type === LOGOUT) {
    const all: { [id: string]: Campaign } = {};
    forEach(state.all, (campaign, id) => {
      all[id] = {
        ...campaign,
        latestDeckIds: undefined,
        baseDeckIds: filter(campaign.baseDeckIds, deckId => deckId < 0),
      };
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === SET_ALL_CAMPAIGNS) {
    const all: { [id: string]: Campaign } = {};
    forEach(action.campaigns, campaign => {
      all[campaign.id] = campaign;
    });
    return {
      all,
      chaosBagResults: {},
    };
  }
  if (action.type === DELETE_CAMPAIGN) {
    const newCampaigns = Object.assign({}, state.all);
    delete newCampaigns[action.id];
    const newChaosBags = Object.assign({}, state.chaosBagResults || {});
    delete newChaosBags[action.id];
    return {
      ...state,
      all: newCampaigns,
      chaosBagResults: newChaosBags,
    };
  }
  if (action.type === NEW_CAMPAIGN) {
    const campaignNotes = {
      sections: map(action.campaignLog.sections || [], section => {
        return { title: section, notes: [] };
      }),
      counts: map(action.campaignLog.counts || [], section => {
        return { title: section, count: 0 };
      }),
      investigatorNotes: {
        sections: map(action.campaignLog.investigatorSections || [], section => {
          return { title: section, notes: {} };
        }),
        counts: map(action.campaignLog.investigatorCounts || [], section => {
          return { title: section, counts: {} };
        }),
      },
    };

    const newCampaign: Campaign = {
      id: action.id,
      name: action.name,
      showInterludes: true,
      cycleCode: action.cycleCode,
      difficulty: action.difficulty,
      chaosBag: { ...action.chaosBag },
      campaignNotes,
      weaknessSet: action.weaknessSet,
      baseDeckIds: action.baseDeckIds,
      nonDeckInvestigators: action.investigatorIds,
      lastUpdated: action.now,
      investigatorData: {},
      scenarioResults: [],
      guided: action.guided,
      guideVersion: action.guided ? -1 : undefined,
    };
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: newCampaign,
      },
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [action.id]: NEW_CHAOS_BAG_RESULTS,
      },
    };
  }
  if (action.type === CLEAN_BROKEN_CAMPAIGNS) {
    const all = {
      ...state.all,
    };
    forEach(state.all, (campaign, id) => {
      if (!campaign.id) {
        delete all[id];
      }
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === CAMPAIGN_ADD_INVESTIGATOR) {
    const campaign: Campaign = {
      ...state.all[action.id],
      lastUpdated: action.now,
    };
    if (action.baseDeckId) {
      campaign.baseDeckIds = [
        ...(campaign.baseDeckIds || []),
        action.baseDeckId,
      ];
    }
    campaign.nonDeckInvestigators = uniq([
      ...campaign.nonDeckInvestigators || [],
      action.investigator,
    ]);
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: campaign,
      },
    };
  }
  if (action.type === UPDATE_CHAOS_BAG_RESULTS) {
    return {
      ...state,
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [action.id]: action.chaosBagResults,
      },
    };
  }
  if (action.type === UPDATE_CAMPAIGN) {
    const existingCampaign = state.all[action.id];
    if (!existingCampaign) {
      // Can't update a campaign that doesn't exist.
      return state;
    }
    const campaign: Campaign = {
      ...existingCampaign,
      ...action.campaign,
      lastUpdated: action.now,
    };
    return {
      ...state,
      all: { ...state.all, [action.id]: campaign },
    };
  }
  if (action.type === REPLACE_LOCAL_DECK) {
    const all = { ...state.all };
    forEach(all, (campaign, campaignId) => {
      if (find(campaign.baseDeckIds || [], deckId => deckId === action.localId)) {
        all[campaignId] = {
          ...campaign,
          baseDeckIds: map(campaign.baseDeckIds, deckId => {
            if (deckId === action.localId) {
              return action.deck.id;
            }
            return deckId;
          }),
        };
      }
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === EDIT_CAMPAIGN_SCENARIO_RESULT) {
    const campaign = { ...state.all[action.id] };
    const scenarioResults = [
      ...campaign.scenarioResults || [],
    ];
    scenarioResults[action.index] = { ...action.scenarioResult };
    const updatedCampaign = {
      ...campaign,
      scenarioResults,
      lastUpdated: action.now,
    };
    return {
      ...state,
      all: { ...state.all, [action.id]: updatedCampaign },
    };
  }
  if (action.type === ADD_CAMPAIGN_SCENARIO_RESULT) {
    const campaign = { ...state.all[action.id] };
    const scenarioResults = [
      ...campaign.scenarioResults || [],
      { ...action.scenarioResult },
    ];
    const updatedCampaign = {
      ...campaign,
      scenarioResults,
      lastUpdated: action.now,
    };
    if (action.campaignNotes) {
      updatedCampaign.campaignNotes = action.campaignNotes;
    }
    return {
      ...state,
      all: { ...state.all, [action.id]: updatedCampaign },
    };
  }
  return state;
}
