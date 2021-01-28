import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CAMPAIGN_SYNC_REQUIRED, DeckId, getDeckId, UPLOAD_DECK } from '@actions/types';
import database from '@react-native-firebase/database';
import { AppState, makeDeckSelector } from '@reducers';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';


export function uploadCampaignDeckHelper(
  campaignId: string,
  serverId: string,
  deckId: DeckId,
  user: FirebaseAuthTypes.User
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    const state = getState();
    const deckSelector = makeDeckSelector();
    const uploads: Promise<void>[] = [];
    const ref = database().ref('/campaigns').child(serverId).child('decks');

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
        campaignId: {
          campaignId,
          serverId,
        },
      });
      if (!deck.nextDeckId) {
        break;
      }
      deck = deckSelector(state, deck.nextDeckId);
    }
    try {
      await Promise.all(uploads);
    } catch (e) {
      dispatch({
        type: CAMPAIGN_SYNC_REQUIRED,
        campaignId: {
          campaignId,
          serverId,
        },
      });
    }
  };
}