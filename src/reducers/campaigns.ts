import { find, filter, flatMap, forEach, map, uniq } from 'lodash';
import uuid from 'react-native-uuid';
import { t } from 'ttag';

import {
  LOGOUT,
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  UPDATE_CAMPAIGN,
  CAMPAIGN_ADD_INVESTIGATOR,
  UPDATE_CAMPAIGN_SPENT_XP,
  RESTORE_COMPLEX_BACKUP,
  CAMPAIGN_REMOVE_INVESTIGATOR,
  CLEAN_BROKEN_CAMPAIGNS,
  UPDATE_CHAOS_BAG_RESULTS,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  RESTORE_BACKUP,
  REPLACE_LOCAL_DECK,
  NEW_CHAOS_BAG_RESULTS,
  ENSURE_UUID,
  Campaign,
  CampaignCycleCode,
  WeaknessSet,
  CampaignActions,
  ChaosBagResults,
} from '@actions/types';

export interface CampaignsState {
  all: {
    [id: string]: Campaign;
  };
  chaosBagResults?: {
    [id: string]: ChaosBagResults | undefined;
  };
}

const DEFAULT_CAMPAIGNS_STATE: CampaignsState = {
  all: {},
  chaosBagResults: {},
};

function newBlankGuidedCampaign(
  id: number,
  name: string,
  cycleCode: CampaignCycleCode,
  weaknessSet: WeaknessSet,
  now: Date
): Campaign {
  return {
    id,
    uuid: uuid.v4(),
    name,
    cycleCode,
    weaknessSet,
    lastUpdated: now,
    guided: true,
    guideVersion: -1,
    showInterludes: true,
    chaosBag: {},
    campaignNotes: {
      sections: [],
      counts: [],
      investigatorNotes: {
        sections: [],
        counts: [],
      },
    },
    baseDeckIds: [],
    nonDeckInvestigators: [],
    investigatorData: {},
    scenarioResults: [],
  };
}

export default function(
  state: CampaignsState = DEFAULT_CAMPAIGNS_STATE,
  action: CampaignActions
): CampaignsState {
  if (action.type === RESTORE_COMPLEX_BACKUP) {
    const all = { ...state.all };
    const chaosBagResults = { ...state.chaosBagResults };
    forEach(action.campaigns, campaign => {
      const remappedCampaign = {
        ...campaign,
        id: action.campaignRemapping[campaign.id],
        baseDeckIds: flatMap(campaign.baseDeckIds, deckId => {
          if (deckId < 0) {
            const newDeckId = action.deckRemapping[deckId];
            if (newDeckId) {
              return [newDeckId];
            }
            // They chose not to import this deck.
            return [];
          }
          return [deckId];
        }),
      };
      all[remappedCampaign.id] = remappedCampaign;
      chaosBagResults[remappedCampaign.id] = {
        drawnTokens: [],
        sealedTokens: [],
        totalDrawnTokens: 0,
      };
    });
    return {
      ...state,
      all,
      chaosBagResults,
    };
  }
  if (action.type === ENSURE_UUID) {
    const all: { [id: string]: Campaign } = {};
    forEach(state.all, (campaign, id) => {
      if (campaign.uuid) {
        all[id] = campaign;
      } else {
        all[id] = {
          ...campaign,
          uuid: uuid.v4(),
        };
      }
    });
    return {
      ...state,
      all,
    };
  }
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
  if (action.type === RESTORE_BACKUP) {
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
    const newChaosBags = Object.assign({}, state.chaosBagResults || {});
    delete newCampaigns[action.id];
    delete newChaosBags[action.id];
    return {
      ...state,
      all: newCampaigns,
      chaosBagResults: newChaosBags,
    };
  }
  if (action.type === NEW_LINKED_CAMPAIGN) {
    const newCampaignA = newBlankGuidedCampaign(
      action.id + 1,
      t`${action.name} (Campaign A)`,
      action.cycleCodeA,
      action.weaknessSet,
      action.now,
    );
    const newCampaignB = newBlankGuidedCampaign(
      action.id + 2,
      t`${action.name} (Campaign B)`,
      action.cycleCodeB,
      action.weaknessSet,
      action.now
    );
    const newCampaign = newBlankGuidedCampaign(
      action.id,
      action.name,
      action.cycleCode,
      action.weaknessSet,
      action.now
    );
    newCampaignA.linkedCampaignId = newCampaignB.id;
    newCampaignB.linkedCampaignId = newCampaignA.id;
    newCampaign.link = {
      campaignIdA: newCampaignA.id,
      campaignIdB: newCampaignB.id,
    };
    return {
      ...state,
      all: {
        ...state.all,
        [newCampaign.id]: newCampaign,
        [newCampaignA.id]: newCampaignA,
        [newCampaignB.id]: newCampaignB,
      },
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [newCampaign.id]: NEW_CHAOS_BAG_RESULTS,
        [newCampaignA.id]: NEW_CHAOS_BAG_RESULTS,
        [newCampaignB.id]: NEW_CHAOS_BAG_RESULTS,
      },
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
      uuid: uuid.v4(),
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
  if (action.type === CAMPAIGN_REMOVE_INVESTIGATOR) {
    const campaign: Campaign = {
      ...state.all[action.id],
      lastUpdated: action.now,
    };
    if (action.removeDeckId) {
      campaign.baseDeckIds = filter(
        campaign.baseDeckIds || [],
        deckId => deckId !== action.removeDeckId
      );
    } else {
      campaign.nonDeckInvestigators = filter(
        campaign.nonDeckInvestigators || [],
        investigator => investigator !== action.investigator
      );
    }
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: campaign,
      },
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
  if (action.type === UPDATE_CAMPAIGN_SPENT_XP) {
    const existingCampaign = state.all[action.id];
    if (!existingCampaign) {
      // Can't update a campaign that doesn't exist.
      return state;
    }
    const investigatorData = existingCampaign.investigatorData[action.investigator] || {};
    const campaign: Campaign = {
      ...existingCampaign,
      investigatorData: {
        ...existingCampaign.investigatorData,
        [action.investigator]: {
          ...investigatorData,
          spentXp: action.operation === 'inc' ?
            (investigatorData.spentXp || 0) + 1 :
            Math.max((investigatorData.spentXp || 0) - 1, 0),
        },
      },
      lastUpdated: action.now,
    };
    return {
      ...state,
      all: { ...state.all, [action.id]: campaign },
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
