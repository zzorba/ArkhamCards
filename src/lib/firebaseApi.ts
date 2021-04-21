import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { DeckId, getDeckId, SYNC_DECK, UploadedCampaignId, UPLOAD_DECK } from '@actions/types';
import { AppState, makeDeckSelector } from '@reducers';
import { DeckActions } from '@data/remote/decks';


export function uploadCampaignDeckHelper(
  campaignId: UploadedCampaignId,
  deckId: DeckId,
  actions: DeckActions
): ThunkAction<Promise<void>, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    const state = getState();
    const deckSelector = makeDeckSelector();
    let deck = deckSelector(state, deckId);
    const investigator = deck?.investigator_code;
    if (investigator) {
      dispatch({
        type: SYNC_DECK,
        campaignId,
        investigator,
        uploading: true,
      });
    }
    const promises: Promise<void>[] = [];
    while (deck) {
      const deckId = getDeckId(deck);
      if (!deck.previousDeckId) {
        promises.push(actions.createBaseDeck(deck, campaignId));
      } else {
        promises.push(actions.createNextDeck(deck, campaignId, deck.previousDeckId));
      }
      dispatch({
        type: UPLOAD_DECK,
        deckId,
        campaignId,
      });
      if (!deck.nextDeckId) {
        break;
      }
      deck = deckSelector(state, deck.nextDeckId);
    }
    if (investigator) {
      Promise.all(promises).then(() => {
        dispatch({
          type: SYNC_DECK,
          campaignId,
          investigator,
          uploading: false,
        });
      });
    }
  };
}