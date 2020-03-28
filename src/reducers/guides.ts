import { dropRight, filter } from 'lodash';

import {
  GUIDE_SET_INPUT,
  GUIDE_UNDO_INPUT,
  GUIDE_RESET_SCENARIO,
  LOGOUT,
  GuideActions,
  CampaignGuideState,
  DEFAULT_CAMPAIGN_GUIDE_STATE,
} from 'actions/types';

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
  if (action.type === GUIDE_SET_INPUT) {
    return updateCampaign(
      state,
      action.campaignId,
      campaign => {
        return {
          ...campaign,
          inputs: [...campaign.inputs, action.input],
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
        return {
          ...campaign,
          inputs: dropRight(campaign.inputs),
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
