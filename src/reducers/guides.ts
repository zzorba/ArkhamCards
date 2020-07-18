import { forEach, findLastIndex, filter } from 'lodash';

import {
  RESTORE_BACKUP,
  DELETE_CAMPAIGN,
  GUIDE_SET_INPUT,
  GUIDE_UNDO_INPUT,
  GUIDE_RESET_SCENARIO,
  LOGOUT,
  GuideActions,
  CampaignGuideState,
  DEFAULT_CAMPAIGN_GUIDE_STATE,
} from '@actions/types';

export interface GuidesState {
  all: {
    [campaignId: string]: CampaignGuideState | undefined;
  };
}

const DEFAULT_GUIDES_STATE: GuidesState = {
  all: {},
};

function updateCampaign(
  state: GuidesState,
  campaignId: number,
  update: (campaign: CampaignGuideState) => CampaignGuideState
): GuidesState {
  const campaign: CampaignGuideState = state.all[campaignId] || DEFAULT_CAMPAIGN_GUIDE_STATE;
  return {
    ...state,
    all: {
      ...state.all,
      [campaignId]: update(campaign),
    },
  };
}

export default function(
  state: GuidesState = DEFAULT_GUIDES_STATE,
  action: GuideActions
): GuidesState {
  if (action.type === LOGOUT) {
    return state;
  }
  if (action.type === RESTORE_BACKUP) {
    const newAll: { [id: string]: CampaignGuideState } = {};
    forEach(action.guides, (guide, id) => {
      if (guide) {
        newAll[id] = {
          inputs: guide.inputs || [],
        };
      }
    });
    return {
      all: newAll,
    };
  }
  if (action.type === DELETE_CAMPAIGN) {
    const newAll = {
      ...state.all,
    };
    delete newAll[action.id];
    return {
      ...state,
      all: newAll,
    };
  }
  if (action.type === GUIDE_SET_INPUT) {
    return updateCampaign(
      state,
      action.campaignId,
      campaign => {
        const existingInputs = action.input.type !== 'campaign_link' ?
          campaign.inputs :
          filter(campaign.inputs,
            input => !(
              input.type === 'campaign_link' &&
              action.input.type === 'campaign_link' &&
              input.step === action.input.step &&
              input.scenario === action.input.scenario
            )
          );
        const inputs = [...existingInputs, action.input];
        return {
          ...campaign,
          inputs,
        };
      });
  }
  if (action.type === GUIDE_UNDO_INPUT) {
    return updateCampaign(
      state,
      action.campaignId,
      campaign => {
        if (!campaign.inputs.length) {
          return campaign;
        }
        const latestInputIndex = findLastIndex(
          campaign.inputs,
          input => (
            input.scenario === action.scenarioId &&
            input.type !== 'campaign_link'
          )
        );
        if (latestInputIndex === -1) {
          return campaign;
        }
        const inputs = filter(
          campaign.inputs,
          (input, idx) => {
            if (input.type === 'campaign_link') {
              return (
                idx < latestInputIndex ||
                input.scenario !== action.scenarioId
              );
            }
            return idx !== latestInputIndex;
          }
        );
        return {
          ...campaign,
          inputs,
        };
      });
  }
  if (action.type === GUIDE_RESET_SCENARIO) {
    return updateCampaign(
      state,
      action.campaignId,
      campaign => {
        return {
          ...campaign,
          inputs: filter(campaign.inputs, input => input.scenario !== action.scenarioId),
        };
      });
  }

  return state;
}
