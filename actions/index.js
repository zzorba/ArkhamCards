export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';

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
    fetch(`https://arkhamdb.com/api/public/decklist/${id}`, { method: 'GET' })
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
