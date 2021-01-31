import { find, forEach, findLastIndex, filter, map } from 'lodash';

import {
  DELETE_CAMPAIGN,
  GUIDE_SET_INPUT,
  GUIDE_UNDO_INPUT,
  GUIDE_UPDATE_ACHIEVEMENT,
  GUIDE_RESET_SCENARIO,
  RESTORE_COMPLEX_BACKUP,
  ARKHAMDB_LOGOUT,
  GuideActions,
  CampaignGuideState,
  GuideInput,
  guideInputToId,
  REDUX_MIGRATION,
  CampaignId,
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
  campaignId: CampaignId,
  now: Date,
  update: (campaign: CampaignGuideState) => CampaignGuideState
): GuidesState {
  const campaign: CampaignGuideState = state.all[campaignId.campaignId] || { uuid: campaignId.campaignId, inputs: [] };
  const updatedCampaign = update(campaign);
  updatedCampaign.lastUpdated = now;
  return {
    ...state,
    all: {
      ...state.all,
      [campaignId.campaignId]: updatedCampaign,
    },
  };
}

const SYSTEM_BASED_INPUTS = new Set(['campaign_link', 'inter_scenario']);

export default function(
  state: GuidesState = DEFAULT_GUIDES_STATE,
  action: GuideActions
): GuidesState {
  if (action.type === ARKHAMDB_LOGOUT) {
    return state;
  }
  if (action.type === RESTORE_COMPLEX_BACKUP || (action.type === REDUX_MIGRATION && action.version === 1)) {
    const all = { ...state.all };
    forEach(action.guides, guide => {
      all[guide.uuid] = guide;
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === DELETE_CAMPAIGN) {
    const newAll = {
      ...state.all,
    };
    delete newAll[action.id.campaignId];
    return {
      ...state,
      all: newAll,
    };
  }
  if (action.type === GUIDE_UPDATE_ACHIEVEMENT) {
    return updateCampaign(
      state,
      action.campaignId,
      action.now,
      guide => {
        const achievements = guide.achievements || [];
        switch (action.operation) {
          case 'clear':
            return {
              ...guide,
              achievements: filter(achievements, a => a.id !== action.id),
            };
          case 'set':
            return {
              ...guide,
              achievements: [...filter(achievements, a => a.id !== action.id), { id: action.id, type: 'binary', value: true }],
            };
          case 'inc': {
            const currentEntry = find(achievements, a => a.id === action.id);
            if (currentEntry && currentEntry.type === 'count') {
              return {
                ...guide,
                achievements: map(achievements, a => {
                  if (a.id === action.id && a.type === 'count') {
                    return {
                      id: a.id,
                      type: 'count',
                      value: action.max !== undefined ? Math.min(a.value + 1, action.max) : (a.value + 1),
                    };
                  }
                  return a;
                }),
              };
            }
            return {
              ...guide,
              achievements: [...achievements,
                {
                  id: action.id,
                  type: 'count',
                  value: 1,
                },
              ],
            };
          }
          case 'dec': {
            const currentEntry = find(achievements, a => a.id === action.id);
            if (currentEntry && currentEntry.type === 'count') {
              return {
                ...guide,
                achievements: map(achievements, a => {
                  if (a.id === action.id && a.type === 'count') {
                    return {
                      id: a.id,
                      type: 'count',
                      value: Math.max(a.value - 1, 0),
                    };
                  }
                  return a;
                }),
              };
            }
            return {
              ...guide,
              achievements: [...achievements,
                {
                  id: action.id,
                  type: 'count',
                  value: 0,
                },
              ],
            };
          }
        }
      }
    );
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
              // tslint:disable-next-line
              input.step === action.input.step &&
              // tslint:disable-next-line
              input.scenario === action.input.scenario
            )
          ) : campaign.inputs;
        const inputs = [...existingInputs, action.input];
        return {
          ...campaign,
          undo: filter(campaign.undo || [], id => id !== guideInputToId(action.input)),
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
        const inputs: GuideInput[] = [];
        const removedInputs: GuideInput[] = [];
        forEach(campaign.inputs, (input: GuideInput, idx: number) => {
          if (SYSTEM_BASED_INPUTS.has(input.type)) {
            if (idx < latestInputIndex || input.scenario !== action.scenarioId) {
              inputs.push(input);
            } else {
              removedInputs.push(input);
            }
          } else {
            if (idx !== latestInputIndex) {
              inputs.push(input);
            } else {
              removedInputs.push(input);
            }
          }
        }
        );
        return {
          ...campaign,
          undo: [...(campaign.undo || []), ...map(removedInputs, guideInputToId)],
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
