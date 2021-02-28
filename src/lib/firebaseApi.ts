import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { DeckId, getDeckId, UploadedCampaignId, UPLOAD_DECK } from '@actions/types';
import { AppState, makeDeckSelector } from '@reducers';
import { CreateDeckActions } from '@data/remote/decks';


export function uploadCampaignDeckHelper(
  campaignId: UploadedCampaignId,
  deckId: DeckId,
  actions: CreateDeckActions
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    const state = getState();
    const deckSelector = makeDeckSelector();
    let deck = deckSelector(state, deckId);
    while (deck) {
      const deckId = getDeckId(deck);
      if (deck.previousDeckId) {
        await actions.createNextDeck(deck, campaignId, deck.previousDeckId);
      } else {
        await actions.createBaseDeck(deck, campaignId);
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
  };
}