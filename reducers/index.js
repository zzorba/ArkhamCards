import { combineReducers } from 'redux';
import { filter, find, flatMap, forEach, keys, map, max, last, reverse, sortBy, values } from 'lodash';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {
  CLEAR_DECKS,
  PACKS_AVAILABLE,
  UPDATE_PROMPT_DISMISSED,
  NEW_DECK_AVAILABLE,
  UPDATE_DECK,
  DELETE_WEAKNESS_SET,
  SET_IN_COLLECTION,
  SET_PACK_SPOILER,
  SET_ALL_PACK_SPOILERS,
  NEW_WEAKNESS_SET,
  EDIT_WEAKNESS_SET,
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  SET_MY_DECKS,
  MY_DECKS_START_REFRESH,
  MY_DECKS_ERROR,
  LOGIN_STARTED,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
} from '../actions/';

const DEFAULT_SIGNED_IN_STATE = {
  loading: false,
  status: false,
  error: null,
};

const signedIn = (state = DEFAULT_SIGNED_IN_STATE, action) => {
  if (action.type === LOGIN_STARTED) {
    return Object.assign({}, state, {
      loading: true,
    });
  }
  if (action.type === LOGIN) {
    return Object.assign({}, state, {
      loading: false,
      status: true,
      error: null,
    });
  }
  if (action.type === LOGIN_ERROR) {
    return Object.assign({}, state, {
      loading: false,
      error: action.error,
    });
  }
  if (action.type === LOGOUT) {
    return Object.assign({}, state, {
      loading: false,
      status: false,
      error: null,
    });
  }
  return state;
};

const DEFAULT_PACKS_STATE = {
  all: [],
  dateFetched: null,
  dateUpdatePrompt: null,
  in_collection: {},
  show_spoilers: {},
  loading: true,
};

const packs = (state = DEFAULT_PACKS_STATE, action) => {
  if (action.type === UPDATE_PROMPT_DISMISSED) {
    return Object.assign({},
      state,
      {
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
      });
  }
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        loading: false,
        dateFetched: action.timestamp.getTime() / 1000,
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
      });
  } else if (action.type === SET_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    if (action.code) {
      if (action.value) {
        new_collection[action.code] = true;
      } else {
        delete new_collection[action.code];
      }
    } else if (action.cycle) {
      forEach(state.all, pack => {
        if (pack.cycle_position === action.cycle) {
          if (action.value) {
            new_collection[pack.code] = true;
          } else {
            delete new_collection[pack.code];
          }
        }
      });
    }

    return Object.assign({},
      state,
      {
        in_collection: new_collection,
      },
    );
  } else if (action.type === SET_ALL_PACK_SPOILERS) {
    return Object.assign({},
      state,
      {
        show_spoilers: Object.assign({}, action.spoilers),
      },
    );
  } else if (action.type === SET_PACK_SPOILER) {
    const new_spoilers = Object.assign({}, state.show_spoilers);
    if (action.code) {
      if (action.value) {
        new_spoilers[action.code] = true;
      } else {
        delete new_spoilers[action.code];
      }
    } else if (action.cycle) {
      forEach(state.all, pack => {
        if (pack.cycle_position === action.cycle) {
          if (action.value) {
            new_spoilers[pack.code] = true;
          } else {
            delete new_spoilers[pack.code];
          }
        }
      });
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

const DEFAULT_DECK_STATE = {
  all: {},
  myDecks: [],
  dateUpdated: null,
  refreshing: false,
  error: null,
};

function updateDeck(state, action) {
  const deck = Object.assign({}, action.deck);
  let scenarioCount = 0;
  let currentDeck = deck;
  while (currentDeck && currentDeck.previous_deck) {
    scenarioCount ++;
    currentDeck = state.all[currentDeck.previous_deck];
  }
  deck.scenarioCount = scenarioCount;
  return deck;
}

const decks = (state = DEFAULT_DECK_STATE, action) => {
  if (action.type === MY_DECKS_START_REFRESH) {
    return Object.assign({},
      state,
      {
        refreshing: true,
        error: null,
      },
    );
  }
  if (action.type === MY_DECKS_ERROR) {
    return Object.assign({},
      state,
      {
        refreshing: false,
        error: action.error,
      },
    );
  }
  if (action.type === SET_MY_DECKS) {
    const allDecks = Object.assign({}, state.all);
    forEach(action.decks, deck => {
      allDecks[deck.id] = deck;
    });
    forEach(action.decks, deck => {
      let scenarioCount = 0;
      let currentDeck = deck;
      while (currentDeck && currentDeck.previous_deck) {
        scenarioCount ++;
        currentDeck = allDecks[currentDeck.previous_deck];
      }
      deck.scenarioCount = scenarioCount;
    });
    return Object.assign({},
      state,
      {
        all: allDecks,
        myDecks: reverse(map(filter(action.decks, deck => !deck.next_deck), deck => deck.id)),
        dateUpdated: (new Date()).getTime(),
        refreshing: false,
        error: null,
      },
    );
  }
  if (action.type === UPDATE_DECK) {
    const deck = updateDeck(state, action);
    const newState = Object.assign({},
      state,
      {
        all: Object.assign(
          {},
          state.all,
          { [action.id]: deck },
        ),
      },
    );
    if (action.isWrite) {
      // Writes get moved to the head of the list.
      newState.myDecks = [
        action.id,
        ...filter(state.myDecks, deckId => deckId !== action.id),
      ];
    }
    return newState;
  }
  if (action.type === NEW_DECK_AVAILABLE) {
    const deck = updateDeck(state, action);
    const newState = Object.assign({},
      state,
      {
        all: Object.assign(
          {},
          state.all,
          { [action.id]: deck },
        ),
      });
    newState.myDecks = [
      action.id,
      ...filter(state.myDecks, deckId => deck.previous_deck !== deckId),
    ];
    return newState;
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
//   investigatorData: {
//     investigator_code: {
//       physical: #,
//       mental: #,
//       killed: bool,
//       insane: bool,
//       campaignNotes: {
//         sections: [
//           { title: 'Supplies', notes: [] },
//         ],
//       }
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
//       { title: 'Section Title', notes: [] },
//     ],
//     counts: [
//       { title: 'Doubt', count: 2 },
//     ],
//     // Not the data, just the config.
//     investigatorLogs: {
//
//     },
//   },
//   completedScenarios: [{
//     scenario: '',
//     scenarioCode: '',
//   },{
//     scenario: '',
//     scenarioCode: '',
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
    const newCampaign = {
      id: action.id,
      name: action.name,
      cycleCode: action.cycleCode,
      difficulty: action.difficulty,
      chaosBag: action.chaosBag,
      weaknessSet: {
        packCodes: action.weaknessPacks,
        assignedCards: {},
      },
      latestDeckIds: action.deckIds,
      lastUpdated: action.now,
      investigatorData: {},
    };
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: newCampaign }) },
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

// weakness_set:
//   name: 'string',
//   created: 'date',
//   packCodes: [], // Array of packs to consider
//   assignedCards: {}, [code: quantity], // Cards we've taken out of circ.
const DEFAULT_WEAKNESS_SET_STATE = {
  all: {},
};

const weaknesses = (state = DEFAULT_WEAKNESS_SET_STATE, action) => {
  if (action.type === NEW_WEAKNESS_SET) {
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: action.set }) },
    );
  }
  if (action.type === DELETE_WEAKNESS_SET) {
    const all = Object.assign({}, state.all);
    delete all[action.id];
    return Object.assign({}, state, { all });
  }
  if (action.type === EDIT_WEAKNESS_SET) {
    const set = Object.assign({}, state.all[action.id]);
    if (action.name) {
      set.name = action.name;
    }
    if (action.packCodes) {
      set.packCodes = action.packCodes;
    }
    if (action.assignedCards) {
      set.assignedCards = action.assignedCards;
    }
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: set }) },
    );
  }
  return state;
};

const decksPersistConfig = {
  key: 'decks',
  storage,
  blacklist: ['refreshing', 'error'],
};

const signedInPersistConfig = {
  key: 'signedIn',
  storage,
  blacklist: ['loading', 'error'],
};

// Combine all the reducers
const rootReducer = combineReducers({
  packs,
  decks: persistReducer(decksPersistConfig, decks),
  campaigns,
  weaknesses,
  signedIn: persistReducer(signedInPersistConfig, signedIn),
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

export function getPackFetchDate(state) {
  return state.pack.dateFetched;
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

export function getNextCampaignId(state) {
  return 1 + (max(map(keys(state.campaigns.all), id => parseInt(id, 10))) || 0);
}

export function getNextWeaknessId(state) {
  return 1 + (max(map(values(state.weaknesses.all), set => set.id)) || 0);
}


export function getCampaign(state, id) {
  if (id in state.campaigns.all) {
    const campaign = state.campaigns.all[id];
    return campaign ? processCampaign(campaign) : null;
  }
  return null;
}
