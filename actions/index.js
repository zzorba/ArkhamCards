export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';
export const CLEAR_DECKS = 'CLEAR_DECKS';
export const NEW_DECK = 'NEW_DECK';
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';
export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export const ADD_CAMPAIGN_SCENARIO_RESULT = 'ADD_CAMPAIGN_SCENARIO_RESULT';

export function fetchPacks() {
  return (dispatch) => {
    fetch('https://arkhamdb.com/api/public/packs/', { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch({
        type: PACKS_AVAILABLE,
        packs: json,
      })).catch(err => console.log(err));
  };
}

export function newDeck(investigator) {
  const slot = {};
  return {
    type: NEW_DECK,
  };
}

export function clearDecks() {
  return {
    type: CLEAR_DECKS,
  };
}

export function fetchDeck(id, useDeckEndpoint) {
  return (dispatch) => {
    const uri = `https://arkhamdb.com/api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id}`;
    fetch(uri, { method: 'GET' })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error(`Unexpected status: ${response.status}`);
      })
      .then(json => dispatch({
        type: DECK_AVAILABLE,
        id,
        deck: json,
      })).catch(err => {
        if (!useDeckEndpoint) {
          return fetchDeck(id, true)(dispatch);
        }
        console.log(err);
      });
  };
}

export function setInCollection(code, value) {
  return {
    type: SET_IN_COLLECTION,
    code,
    value,
  };
}

export function setPackSpoiler(code, value) {
  return {
    type: SET_PACK_SPOILER,
    code,
    value,
  };
}

export function newCampaign(pack_code, name) {
  return {
    type: NEW_CAMPAIGN,
    name: name,
    cycleCode: pack_code,
    now: new Date(),
  };
}

export function deleteCampaign(id) {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}

export function addScenarioResult(id, scenarioResult) {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult,
    now: new Date(),
  };
}

export default {
  fetchPacks,
  newDeck,
  fetchDeck,
  setInCollection,
  setPackSpoiler,
  newCampaign,
  deleteCampaign,
  addScenarioResult,
};
