export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';

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

export function getDeck(id) {
  return (dispatch) => {
    fetch(`https://arkhamdb.com/api/public/deck/${id}`, { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch({
        type: DECK_AVAILABLE,
        id,
        deck: json,
      })).catch(err => console.log(err));
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
