import { forEach, keys, map } from 'lodash';

import {
  SET_MY_DECKS,
  NEW_DECK_AVAILABLE,
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
//   latestDeckIds: [],
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
//       { title: 'Section Title', notes: [] },
//     ],
//     counts: [
//       { title: 'Doubt', count: 2 },
//     ],
//     // Not the data, just the config.
//     investigatorNotes: {
//       sections: [
//         { title: 'Supplies', notes: { investigatorCodes: [] } },
//       ],
//       counts: [
//         { title: 'Vengeance', counts: { investigatorCodes: # } },
//       ],
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

export default function(state = DEFAULT_CAMPAIGNS_STATE, action) {
  if (action.type === DELETE_CAMPAIGN) {
    const newCampaigns = Object.assign({}, state.all);
    delete newCampaigns[action.id];
    return Object.assign({},
      state,
      { all: newCampaigns },
    );
  }
  if (action.type === SET_MY_DECKS) {
    const allDecks = {};
    forEach(action.decks, deck => {
      allDecks[deck.id] = deck;
    });

    const newAll = Object.assign({}, state.all);
    forEach(keys(newAll), campaignId => {
      const campaign = newAll[campaignId];
      const latestDeckIds = map(campaign.latestDeckIds, deckId => {
        let deck = allDecks[deckId];
        while (deck && deck.next_deck && allDecks[deck.next_deck]) {
          deck = allDecks[deck.next_deck];
        }
        return deck.id;
      });
      newAll[campaignId] = Object.assign(
        {},
        campaign,
        { latestDeckIds },
      );
    });
    return Object.assign(
      {},
      state,
      { all: newAll },
    );
  }
  if (action.type === NEW_DECK_AVAILABLE) {
    if (!action.deck.previous_deck) {
      // No need to search the previous_decks.
      return state;
    }
    const newAll = Object.assign({}, state.all);
    forEach(keys(newAll), campaignId => {
      const campaign = newAll[campaignId];
      const latestDeckIds = map(campaign.latestDeckIds, deckId => {
        if (action.deck.previous_deck === deckId) {
          return action.deck.id;
        }
        return deckId;
      });
      newAll[campaignId] = Object.assign(
        {},
        campaign,
        { latestDeckIds },
      );
    });
    return Object.assign(
      {},
      state,
      { all: newAll },
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
      weaknessSet: {
        packCodes: action.weaknessPacks.slice(),
        assignedCards: {},
      },
      latestDeckIds: action.deckIds,
      lastUpdated: action.now,
      investigatorData: {},
      completedScenarios: [],
    };
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: newCampaign }) },
    );
  }
  if (action.type === UPDATE_CAMPAIGN) {
    const campaign = Object.assign({}, state.all[action.id]);
    forEach(keys(action.campaign), key => {
      campaign[key] = action.campaign[key];
    });
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: campaign }) },
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
}
