import { forEach, keys, map } from 'lodash';

import {
  LOGOUT,
  NEW_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
} from '../actions/types';

// Campaign: {
//   id: '',
//   name: '',
//   cycleCode: '',
//   lastUpdated: Date,
//   baseDeckIds: [],
//   latestDeckIds: [], /* deprecated */
//   investigatorData: {
//     investigator_code: {
//       physical: #,
//       mental: #,
//       killed: bool,
//       insane: bool,
//     },
//   },
//   chaosBag: {},
//   weaknessSet: {
//     packCodes: [],
//     assignedCards: {},
//   },
//   campaignNotes: {
//     sections: [
//       { title: 'Campaign Notes', notes: [] },
//       { title: 'Section Title', notes: [], custom: true },
//     ],
//     counts: [
//       { title: 'Doubt', count: 2 },
//     ],
//     // Not the data, just the config.
//     investigatorNotes: {
//       sections: [
//         { title: 'Supplies', notes: { investigatorCodes: [] } },
//         { title: 'Custom Something', notes: { investigatorCodes: [] }, custom: true },
//       ],
//       counts: [
//         { title: 'Vengeance', counts: { investigatorCodes: # } },
//       ],
//     },
//   },
//   scenarioResults: [{
//     scenario: '',
//     scenarioCode: '',
//     resolution: '',
//     xp: #,
//   },{
//     scenario: '',
//     scenarioCode: '',
//   }],
// }
const DEFAULT_CAMPAIGNS_STATE = {
  all: {},
};

export default function(state = DEFAULT_CAMPAIGNS_STATE, action) {
  if (action.type === LOGOUT) {
    return DEFAULT_CAMPAIGNS_STATE;
  }
  if (action.type === DELETE_CAMPAIGN) {
    const newCampaigns = Object.assign({}, state.all);
    delete newCampaigns[action.id];
    return Object.assign({},
      state,
      { all: newCampaigns },
    );
  }
  if (action.type === NEW_CAMPAIGN) {
    const campaignNotes = {};
    campaignNotes.sections = map(action.campaignLog.sections || [], section => {
      return { title: section, notes: [] };
    });
    campaignNotes.counts = map(action.campaignLog.counts || [], section => {
      return { title: section, count: 0 };
    });
    campaignNotes.investigatorNotes = {
      sections: map(action.campaignLog.investigatorSections || [], section => {
        return { title: section, notes: {} };
      }),
      counts: map(action.campaignLog.investigatorCounts || [], section => {
        return { title: section, counts: {} };
      }),
    };

    const newCampaign = {
      id: action.id,
      name: action.name,
      cycleCode: action.cycleCode,
      difficulty: action.difficulty,
      chaosBag: Object.assign({}, action.chaosBag),
      campaignNotes,
      weaknessSet: action.weaknessSet,
      baseDeckIds: action.baseDeckIds,
      lastUpdated: action.now,
      investigatorData: {},
      scenarioResults: [],
    };
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: newCampaign }) },
    );
  }
  if (action.type === UPDATE_CAMPAIGN) {
    const campaign = Object.assign({}, state.all[action.id], { lastUpdated: action.now });
    forEach(keys(action.campaign), key => {
      campaign[key] = action.campaign[key];
    });
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: campaign }) },
    );
  }
  if (action.type === ADD_CAMPAIGN_SCENARIO_RESULT) {
    const campaign = Object.assign({}, state.all[action.id]);
    const scenarioResults = [
      ...campaign.scenarioResults || [],
      Object.assign({}, action.scenarioResult),
    ];
    const updatedCampaign = Object.assign(
      {},
      campaign,
      {
        scenarioResults,
        lastUpdated: action.now,
      },
    );
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: updatedCampaign }) },
    );
  }
  return state;
}
