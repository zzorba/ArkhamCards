export const CARDS_AVAILABLE = 'CARDS_AVAILABLE';
export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';

//Import the sample data
//import Data from '../instructions.json';
export function getCards() {
  return (dispatch) => {
    fetch('https://arkhamdb.com/api/public/cards/', { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch({
        type: CARDS_AVAILABLE,
        cards: json,
      })).catch(err => console.log(err));
  };
}

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
