import { find, filter, forEach, map, uniq } from 'lodash';
import uuid from 'react-native-uuid';
import { t } from 'ttag';

import {
  ARKHAMDB_LOGOUT,
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  UPDATE_CAMPAIGN,
  CAMPAIGN_ADD_INVESTIGATOR,
  UPDATE_CAMPAIGN_XP,
  RESTORE_COMPLEX_BACKUP,
  CAMPAIGN_REMOVE_INVESTIGATOR,
  CLEAN_BROKEN_CAMPAIGNS,
  UPDATE_CHAOS_BAG_RESULTS,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  REPLACE_LOCAL_DECK,
  NEW_CHAOS_BAG_RESULTS,
  ENSURE_UUID,
  Campaign,
  CampaignCycleCode,
  WeaknessSet,
  CampaignActions,
  ChaosBagResults,
  ADJUST_BLESS_CURSE,
  NEW_STANDALONE,
  STANDALONE,
  REDUX_MIGRATION,
  UPDATE_CAMPAIGN_TRAUMA,
} from '@actions/types';

export interface CampaignsState {
  all: {
    [uuid: string]: Campaign;
  };
  chaosBagResults?: {
    [uuid: string]: ChaosBagResults | undefined;
  };
}

const DEFAULT_CAMPAIGNS_STATE: CampaignsState = {
  all: {},
  chaosBagResults: {},
};

function newBlankGuidedCampaign(
  name: string,
  uuid: string,
  cycleCode: CampaignCycleCode,
  weaknessSet: WeaknessSet,
  now: Date
): Campaign {
  return {
    uuid,
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
    deckIds: [],
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
      all[campaign.uuid] = campaign;
      chaosBagResults[campaign.uuid] = {
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
  if (action.type === REDUX_MIGRATION) {
    const all = { ...state.all };
    const chaosBagResults = { ...state.chaosBagResults };
    forEach(action.campaigns, campaign => {
      all[campaign.uuid] = campaign;
    });
    forEach(action.chaosBags, (chaosBag, uuid) => {
      chaosBagResults[uuid] = chaosBag;
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
          uuid: uuid.v4() as string,
        };
      }
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === ARKHAMDB_LOGOUT) {
    const all: { [id: string]: Campaign } = {};
    forEach(state.all, (campaign, id) => {
      all[id] = {
        ...campaign,
        deckIds: filter(campaign.deckIds || [], deckId => deckId.local),
      };
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === DELETE_CAMPAIGN) {
    const newCampaigns = Object.assign({}, state.all);
    const newChaosBags = Object.assign({}, state.chaosBagResults || {});
    delete newCampaigns[action.id.campaignId];
    delete newChaosBags[action.id.campaignId];
    return {
      ...state,
      all: newCampaigns,
      chaosBagResults: newChaosBags,
    };
  }
  if (action.type === NEW_LINKED_CAMPAIGN) {
    const newCampaignA = newBlankGuidedCampaign(
      t`${action.name} (Campaign A)`,
      action.uuidA,
      action.cycleCodeA,
      action.weaknessSet,
      action.now,
    );
    const newCampaignB = newBlankGuidedCampaign(
      t`${action.name} (Campaign B)`,
      action.uuidB,
      action.cycleCodeB,
      action.weaknessSet,
      action.now
    );
    const newCampaign = newBlankGuidedCampaign(
      action.name,
      action.uuid,
      action.cycleCode,
      action.weaknessSet,
      action.now
    );
    newCampaignA.linkedCampaignUuid = newCampaignB.uuid;
    newCampaignB.linkedCampaignUuid = newCampaignA.uuid;
    newCampaign.linkUuid = {
      campaignIdA: newCampaignA.uuid,
      campaignIdB: newCampaignB.uuid,
    };
    return {
      ...state,
      all: {
        ...state.all,
        [newCampaign.uuid]: newCampaign,
        [newCampaignA.uuid]: newCampaignA,
        [newCampaignB.uuid]: newCampaignB,
      },
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [newCampaign.uuid]: NEW_CHAOS_BAG_RESULTS,
        [newCampaignA.uuid]: NEW_CHAOS_BAG_RESULTS,
        [newCampaignB.uuid]: NEW_CHAOS_BAG_RESULTS,
      },
    };
  }
  if (action.type === NEW_STANDALONE) {
    const newCampaign: Campaign = {
      uuid: action.uuid,
      name: action.name,
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
      cycleCode: STANDALONE,
      standaloneId: action.standaloneId,
      weaknessSet: action.weaknessSet,
      deckIds: action.deckIds,
      nonDeckInvestigators: action.investigatorIds,
      lastUpdated: action.now,
      investigatorData: {},
      scenarioResults: [],
      guided: true,
      guideVersion: -1,
    };
    return {
      ...state,
      all: {
        ...state.all,
        [newCampaign.uuid]: newCampaign,
      },
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [newCampaign.uuid]: NEW_CHAOS_BAG_RESULTS,
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
      uuid: action.uuid,
      name: action.name,
      showInterludes: true,
      cycleCode: action.cycleCode,
      difficulty: action.difficulty,
      chaosBag: { ...action.chaosBag },
      campaignNotes,
      weaknessSet: action.weaknessSet,
      deckIds: action.deckIds,
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
        [newCampaign.uuid]: newCampaign,
      },
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [newCampaign.uuid]: NEW_CHAOS_BAG_RESULTS,
      },
    };
  }
  if (action.type === CLEAN_BROKEN_CAMPAIGNS) {
    const all = {
      ...state.all,
    };
    forEach(state.all, (campaign, id) => {
      if (!campaign.uuid) {
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
      ...state.all[action.id.campaignId],
      lastUpdated: action.now,
    };
    const removeId = action.removeDeckId;
    if (removeId) {
      campaign.deckIds = filter(
        campaign.deckIds || [],
        deckId => deckId.uuid !== removeId.uuid
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
        [action.id.campaignId]: campaign,
      },
    };
  }
  if (action.type === CAMPAIGN_ADD_INVESTIGATOR) {
    const campaign: Campaign = {
      ...state.all[action.id.campaignId],
      lastUpdated: action.now,
    };
    if (action.deckId) {
      campaign.deckIds = [
        ...(campaign.deckIds || []),
        action.deckId,
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
        [action.id.campaignId]: campaign,
      },
    };
  }
  if (action.type === UPDATE_CHAOS_BAG_RESULTS) {
    return {
      ...state,
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [action.id.campaignId]: action.chaosBagResults,
      },
    };
  }
  if (action.type === ADJUST_BLESS_CURSE) {
    const chaosBagResults = {
      ...((state.chaosBagResults || {})[action.id.campaignId] || NEW_CHAOS_BAG_RESULTS),
    };
    if (action.bless) {
      chaosBagResults.blessTokens = (chaosBagResults.blessTokens || 0) + (action.direction === 'inc' ? 1 : -1);
    } else {
      chaosBagResults.curseTokens = (chaosBagResults.curseTokens || 0) + (action.direction === 'inc' ? 1 : -1);
    }

    return {
      ...state,
      chaosBagResults: {
        ...state.chaosBagResults || {},
        [action.id.campaignId]: chaosBagResults,
      },
    };
  }
  if (action.type === UPDATE_CAMPAIGN_TRAUMA) {
    const existingCampaign = state.all[action.id.campaignId];
    if (!existingCampaign) {
      // Can't update a campaign that doesn't exist.
      return state;
    }
    const investigatorData = existingCampaign.investigatorData?.[action.investigator] || {};
    const campaign: Campaign = {
      ...existingCampaign,
      investigatorData: {
        ...existingCampaign.investigatorData,
        [action.investigator]: {
          ...investigatorData,
          ...action.trauma,
        },
      },
      lastUpdated: action.now,
    };
    return {
      ...state,
      all: { ...state.all, [action.id.campaignId]: campaign },
    };
  }
  if (action.type === UPDATE_CAMPAIGN_XP) {
    const existingCampaign = state.all[action.id.campaignId];
    if (!existingCampaign) {
      // Can't update a campaign that doesn't exist.
      return state;
    }
    if (action.xpType === 'spentXp' && existingCampaign.guided) {
      const investigatorData = existingCampaign.adjustedInvestigatorData?.[action.investigator] || {};
      const campaign: Campaign = {
        ...existingCampaign,
        adjustedInvestigatorData: {
          ...(existingCampaign.adjustedInvestigatorData || {}),
          [action.investigator]: {
            ...investigatorData,
            [action.xpType]: action.value,
          },
        },
        lastUpdated: action.now,
      };
      return {
        ...state,
        all: { ...state.all, [action.id.campaignId]: campaign },
      };
    }
    const investigatorData = existingCampaign.investigatorData?.[action.investigator] || {};
    const campaign: Campaign = {
      ...existingCampaign,
      investigatorData: {
        ...(existingCampaign.investigatorData || {}),
        [action.investigator]: {
          ...investigatorData,
          [action.xpType]: action.value,
        },
      },
      lastUpdated: action.now,
    };
    return {
      ...state,
      all: { ...state.all, [action.id.campaignId]: campaign },
    };
  }
  if (action.type === UPDATE_CAMPAIGN) {
    const existingCampaign = state.all[action.id.campaignId];
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
      all: { ...state.all, [action.id.campaignId]: campaign },
    };
  }
  if (action.type === REPLACE_LOCAL_DECK) {
    const all = { ...state.all };
    forEach(all, (campaign, campaignId) => {
      if (find(campaign.deckIds || [], deckId => deckId.uuid === action.localId.uuid)) {
        all[campaignId] = {
          ...campaign,
          deckIds: map(campaign.deckIds, deckId => {
            if (deckId.uuid === action.localId.uuid) {
              return {
                id: action.deck.id,
                arkhamdb_user: action.deck.user_id,
                local: false,
                uuid: `${action.deck.id}`,
              };
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
    const campaign = { ...state.all[action.campaignId.campaignId] };
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
      all: {
        ...state.all,
        [action.campaignId.campaignId]: updatedCampaign,
      },
    };
  }
  if (action.type === ADD_CAMPAIGN_SCENARIO_RESULT) {
    const campaign = { ...state.all[action.campaignId.campaignId] };
    const scenarioResults = [
      ...(campaign.scenarioResults || []),
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
      all: {
        ...state.all,
        [action.campaignId.campaignId]: updatedCampaign,
      },
    };
  }
  return state;
}
