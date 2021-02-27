import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CAMPAIGN_SYNC_REQUIRED, Deck, DeckId, getDeckId, UploadedCampaignId, UPLOAD_DECK } from '@actions/types';
import { AppState, getAllDecks, getDeck, makeDeckSelector } from '@reducers';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';


export function removeCampaignDeckHelper(
  campaignId: UploadedCampaignId,
  deckId: DeckId,
  removeAll: boolean
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    /*
    const ref = fbdb.campaignDecks(campaignId);
    const removals: Promise<void>[] = [ref.child(deckId.uuid).remove()];
    if (removeAll) {
      const all = getAllDecks(getState());
      let deck = getDeck(all, deckId);
      while (deck && deck.previousDeckId && deck.previousDeckId.uuid in all) {
        deck = getDeck(all, deck.previousDeckId);
        if (deck) {
          removals.push(ref.child(getDeckId(deck).uuid).remove());
        }
      }
    }
    try {
      await Promise.all(removals);
    } catch (e) {
      dispatch({
        type: CAMPAIGN_SYNC_REQUIRED,
        campaignId,
      });
    }*/
  };
}

export function uploadCampaignDeckHelper(
  campaignId: UploadedCampaignId,
  deckId: DeckId,
  user: FirebaseAuthTypes.User,
  singleDeck?: Deck
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    const state = getState();
    const deckSelector = makeDeckSelector();
    const uploads: Promise<void>[] = [];
    /*
    const ref = fbdb.campaignDecks(campaignId);
    if (singleDeck) {
      uploads.push(ref.child(deckId.uuid).set({
        ...singleDeck,
        owner: user.uid,
      }));
    } else {
      let deck = deckSelector(state, deckId);
      while (deck) {
        const deckId = getDeckId(deck);
        uploads.push(ref.child(deckId.uuid).set({
          ...deck,
          owner: user.uid,
        }));
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
    }
    try {
      await Promise.all(uploads);
    } catch (e) {
      dispatch({
        type: CAMPAIGN_SYNC_REQUIRED,
        campaignId,
      });
    }*/
  };
}