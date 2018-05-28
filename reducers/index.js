import { combineReducers } from 'redux';
import { find, flatMap, forEach, keys, last, sortBy, values } from 'lodash';

import {
  CLEAR_DECKS,
  PACKS_AVAILABLE,
  DECK_AVAILABLE,
  SET_IN_COLLECTION,
  SET_PACK_SPOILER,
  SET_ALL_PACK_SPOILERS,
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
} from '../actions/';

const DEFAULT_PACKS_STATE = {
  all: [],
  in_collection: {},
  show_spoilers: {},
  loading: true,
};

const packs = (state = DEFAULT_PACKS_STATE, action) => {
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        loading: false,
      });
  } else if (action.type === SET_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    if (action.value) {
      new_collection[action.code] = true;
    } else {
      delete new_collection[action.code];
    }
    return Object.assign({},
      state,
      {
        in_collection: new_collection,
      },
    );
  } else if (action.type == SET_ALL_PACK_SPOILERS) {
    return Object.assign({},
      state,
      {
        show_spoilers: Object.assign({}, action.spoilers),
      },
    );
  } else if (action.type === SET_PACK_SPOILER) {
    const new_spoilers = Object.assign({}, state.show_spoilers);
    if (action.value) {
      new_spoilers[action.code] = true;
    } else {
      delete new_spoilers[action.code];
    }
    return Object.assign({},
      state,
      {
        show_spoilers: new_spoilers,
      },
    );
  }
  return state;
};

const DEFAULT_DECK_STATE = { all: {} };

const decks = (state = DEFAULT_DECK_STATE, action) => {
  if (action.type === DECK_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: Object.assign(
          {},
          state.all,
          { [action.id]: action.deck },
        ),
      });
  } else if (action.type === CLEAR_DECKS) {
    return DEFAULT_DECK_STATE;
  }
  return state;
};

// Campaign: {
//   id: '',
//   name: '',
//   cycleCode: '',
//   lastUpdated: Date,
//   latestDeckIds: [],
//   chaosBag: {},
//   scenarioResults: [{
//     deckIds: [],
//     scenario: '',
//     scenarioCode: '',
//     campaignNotes: [],
//     chaosBagChanges: [],
//     investigatorUpdates: {
//      investigator_code: {
//        trauma: {
//          physical,
//          mental,
//          killed: bool,
//          insane: bool,
//        },
//        xp: #,
//        exiled: {},
//     },
//   }],
// }
const DEFAULT_CAMPAIGNS_STATE = {
  all: {},
};

const campaigns = (state = DEFAULT_CAMPAIGNS_STATE, action) => {
  if (action.type === DELETE_CAMPAIGN) {
    const newCampaigns = Object.assign({}, state.all);
    delete newCampaigns[action.id];
    return Object.assign({},
      state,
      { all: newCampaigns },
    );
  }
  if (action.type === NEW_CAMPAIGN) {
    let id = Math.floor(Math.random() * 100000);
    while(state.all[id]) {
      id = Math.floor(Math.random() * 100000);
    }
    const newCampaign = {
      id,
      name: action.name,
      cycleCode: action.cycleCode,
      difficulty: action.difficulty,
      chaosBag: action.chaosBag,
      latestDeckIds: action.deckIds,
      lastUpdated: action.now,
      scenarioResults: [],
    };
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [id]: newCampaign }) },
    );
  }
  if (action.type === ADD_CAMPAIGN_SCENARIO_RESULT) {
    const campaign = state.all[action.id];
    const scenarioResults = [
      ...campaign.scenarioResults,
      Object.assign({}, action.scenarioResult),
    ];
    const updatedCampaign = Object.assign(
      {},
      campaign,
      {
        scenarioResults,
        lastModified: action.now,
      },
    );
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: updatedCampaign }) },
    );
  }
  return state;
};

// Combine all the reducers
const rootReducer = combineReducers({
  packs,
  decks,
  campaigns,
});

export default rootReducer;

export function getCampaigns(state) {
  return sortBy(
    values(state.campaigns.all),
    campaign => campaign.lastModified);
}
export function getShowSpoilers(state, packCode) {
  const show_spoilers = state.packs.show_spoilers || {};
  return !!show_spoilers[packCode];
}

export function getAllPacks(state) {
  return sortBy(
    sortBy(state.packs.all || [], pack => pack.position),
    pack => pack.cycle_position);
}

export function getPack(state, packCode) {
  if (packCode) {
    return find(state.packs.all || [], pack => pack.code === packCode);
  }
  return null;
}

export function getPackSpoilers(state) {
  return state.packs.show_spoilers || {};
}

export function getPacksInCollection(state) {
  return state.packs.in_collection || {};
}

export function getAllDecks(state) {
  return state.decks.all || {};
}

export function getDeck(state, id) {
  if (!id) {
    return null;
  }
  if (id in state.decks.all) {
    return state.decks.all[id];
  }
  return null;
}

export function getDecks(state, deckIds) {
  const decks = [];
  forEach(deckIds, deckId => {
    const deck = getDeck(state, deckId);
    if (deck) {
      decks.push(deck);
    }
  });
  return decks;
}

function mergeStatus(oldStatus, newStatus) {
  const oldTrauma = (oldStatus && oldStatus.trauma) || {};
  const newTrauma = (newStatus && newStatus.trauma) || {};
  return {
    trauma: {
      physical: (oldTrauma.physical || 0) + (newTrauma.physical || 0),
      mental: (oldTrauma.mental || 0) + (newTrauma.mental || 0),
      killed: oldTrauma.killed || newTrauma.killed || false,
      insane: oldTrauma.insane || newTrauma.insane || false,
    },
    xp: (oldStatus.xp || 0) + (newStatus.xp || 0),
    missionCount: (oldStatus.missionCount || 0) + 1,
  };
}

function processCampaign(campaign) {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults,
    scenarioResult => {
      if (scenarioResult.scenarioCode) {
        return scenarioResult.scenarioCode;
      }
      return null;
    });
  const investigatorStatus = {};
  forEach(campaign.scenarioResults, scenarioResult => {
    forEach(keys(scenarioResult.investigatorUpdates), investigator_code => {
      const status = investigatorStatus[investigator_code] || {};
      investigatorStatus[investigator_code] = mergeStatus(
        status,
        scenarioResult.investigatorUpdates[investigator_code]);
    });
  });
  return Object.assign(
    {},
    campaign,
    {
      latestScenario,
      finishedScenarios,
      investigatorStatus,
    },
  );
}

export function getCampaign(state, id) {
  if (id in state.campaigns.all) {
    const campaign = state.campaigns.all[id];
    return campaign ? processCampaign(campaign) : null;
  }
  return null;
}
