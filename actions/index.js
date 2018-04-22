export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';
export const CLEAR_DECKS = 'CLEAR_DECKS';
export const NEW_DECK = 'NEW_DECK';
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';
export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export const ADD_CAMPAIGN_MISSION_RESULT = 'ADD_CAMPAIGN_MISSION_RESULT';

export function getPacks() {
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

export function getDeck(id, useDeckEndpoint) {
  return (dispatch) => {
    const uri = `https://arkhamdb.com/api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id}`;
    fetch(uri, { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch({
        type: DECK_AVAILABLE,
        id,
        deck: json,
      })).catch(err => {
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

export function newCampaign(id, name) {
  return {
    type: NEW_CAMPAIGN,
    id,
    name,
    now: new Date(),
  };
}

export function addMissionResult(id, missionResult) {
  return {
    type: ADD_CAMPAIGN_MISSION_RESULT,
    id,
    missionResult,
    now: new Date(),
  };
}

export default {
  getPacks,
  newDeck,
  getDeck,
  setInCollection,
  setPackSpoiler,
  newCampaign,
  addMissionResult,
};
