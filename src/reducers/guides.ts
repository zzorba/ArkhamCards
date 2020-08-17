import { forEach, findLastIndex, filter, map } from 'lodash';

import {
  RESTORE_BACKUP,
  DELETE_CAMPAIGN,
  GUIDE_SET_INPUT,
  GUIDE_UNDO_INPUT,
  GUIDE_RESET_SCENARIO,
  RESTORE_COMPLEX_BACKUP,
  LOGOUT,
  GuideActions,
  CampaignGuideState,
  DEFAULT_CAMPAIGN_GUIDE_STATE,
  NumberChoices,
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
  now: Date,
  update: (campaign: CampaignGuideState) => CampaignGuideState
): GuidesState {
  const campaign: CampaignGuideState = state.all[campaignId] || DEFAULT_CAMPAIGN_GUIDE_STATE;
  const updatedCampaign = update(campaign);
  updatedCampaign.lastUpdated = now;
  return {
    ...state,
    all: {
      ...state.all,
      [campaignId]: updatedCampaign,
    },
  };
}

const SYSTEM_BASED_INPUTS = new Set(['campaign_link', 'inter_scenario']);

export default function(
  state: GuidesState = DEFAULT_GUIDES_STATE,
  action: GuideActions
): GuidesState {
  if (action.type === LOGOUT) {
    return state;
  }
  if (action.type === RESTORE_COMPLEX_BACKUP) {
    const all = { ...state.all };
    forEach(action.guides, (guide, id) => {
      const remappedGuide = {
        ...guide,
        inputs: map(guide.inputs, input => {
          if (input.step && input.step.startsWith('$upgrade_decks') && input.type === 'choice_list') {
            const choices: NumberChoices = { ...input.choices };
            if (choices.deckId && choices.deckId.length) {
              const deckId = choices.deckId[0];
              if (deckId < 0) {
                const newDeckId = action.deckRemapping[deckId];
                if (newDeckId) {
                  choices.deckId = [newDeckId];
                } else {
                  delete choices.deckId;
                }
              }
            }
            return {
              ...input,
              choices,
            };
          }
          return input;
        }),
      };
      all[action.campaignRemapping[id]] = remappedGuide;
    });
    return {
      ...state,
      all,
    };
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
      action.now,
      campaign => {
        const existingInputs = SYSTEM_BASED_INPUTS.has(action.input.type) ?
          filter(campaign.inputs,
            input => !(
              input.type === action.input.type &&
              input.step === action.input.step &&
              input.scenario === action.input.scenario
            )
          ) : campaign.inputs;
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
      action.now,
      campaign => {
        if (!campaign.inputs.length) {
          return campaign;
        }
        const latestInputIndex = findLastIndex(
          campaign.inputs,
          input => (
            input.scenario === action.scenarioId &&
            !SYSTEM_BASED_INPUTS.has(input.type)
          )
        );
        if (latestInputIndex === -1) {
          return campaign;
        }
        const inputs = filter(
          campaign.inputs,
          (input, idx) => {
            if (SYSTEM_BASED_INPUTS.has(input.type)) {
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
      action.now,
      campaign => {
        return {
          ...campaign,
          inputs: filter(campaign.inputs, input => input.scenario !== action.scenarioId),
        };
      });
  }

  return state;
}
