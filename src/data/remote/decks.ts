import { useCallback, useContext, useMemo } from 'react';
import RnHash, { CONSTANTS } from 'react-native-hash';
import { keys } from 'lodash';

import { Deck, DeckId, getDeckId, UploadedDeck } from '@actions/types';
import {
  useDeleteArkhamDbDeckMutation,
  useDeleteLocalDeckMutation,
  useInsertNewDeckMutation,
  useInsertNextArkhamDbDeckMutation,
  useInsertNextLocalDeckMutation,
  useUpdateArkhamDbDeckMutation,
  useUpdateLocalDeckMutation,
} from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export interface DeckActions {
  updateDeck: (deck: Deck, campaignId: number) => Promise<void>;
  deleteDeck: (deckId: DeckId, campaignId: number) => Promise<void>;
  createBaseDeck: (
    deck: Deck,
    campaignId: number
  ) => Promise<number | undefined>;
  createNextDeck: (
    deck: Deck,
    campaignId: number,
    previousDeckId: DeckId
  ) => Promise<number | undefined>;
}

function hashDeck(deck: Deck): Promise<string> {
  return RnHash.hashString(JSON.stringify(deck), CONSTANTS.HashAlgorithms.md5);
}

export async function syncCampaignDecksFromArkhamDB(
  decks: Deck[],
  uploadedDecks: {
    [uuid: string]: UploadedDeck | undefined;
  },
  actions: DeckActions
) {
  const foundDecks: { [uuid: string]: boolean } = {};
  for (let i = 0; i < decks.length; i++) {
    const deck = decks[i];
    const deckId = getDeckId(deck);
    foundDecks[deckId.uuid] = true;
    const hash = await hashDeck(deck);
    const uploadedDeck = uploadedDecks[deckId.uuid];
    if (uploadedDeck && uploadedDeck.hash !== hash) {
      for (let j = 0; j < uploadedDeck.campaignId.length; j++) {
        const campaignId = uploadedDeck.campaignId[j];
        await actions.updateDeck(deck, campaignId);
      }
    }
  }
  const uuids = keys(uploadedDecks);
  for (let i = 0; i < uuids.length; i++) {
    const uuid = uuids[i];
    const uploadedDeck = uploadedDecks[uuid];
    if (uploadedDeck) {
      if (uploadedDeck.deckId.local && !foundDecks[uploadedDeck.deckId.uuid]) {
        for (let j = 0; j < uploadedDeck.campaignId.length; j++) {
          const campaignId = uploadedDeck.campaignId[j];
          await actions.deleteDeck(uploadedDeck.deckId, campaignId);
        }
      }
    }
  }
}


export function useDeckActions(): DeckActions {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [deleteArkhamDbDeck] = useDeleteArkhamDbDeckMutation();
  const [deleteLocalDeck] = useDeleteLocalDeckMutation();
  const deleteDeck = useCallback(async(deckId: DeckId, campaignId: number) => {
    if (deckId.local) {
      await deleteLocalDeck({
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId,
        },
      });
    } else {
      await deleteArkhamDbDeck({
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId,
        },
      });
    }
  }, [deleteArkhamDbDeck, deleteLocalDeck]);

  const [updateLocalDeck] = useUpdateLocalDeckMutation();
  const [updateArkhamDbDeck] = useUpdateArkhamDbDeckMutation();
  const updateDeck = useCallback(async(deck: Deck, campaignId: number) => {
    const deckId = getDeckId(deck);
    if (deckId.local) {
      await updateLocalDeck({
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId,
          content: deck,
          content_hash: await hashDeck(deck),
        },
      });
    } else {
      await updateArkhamDbDeck({
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId,
          content: deck,
          content_hash: await hashDeck(deck),
        },
      });
    }
  }, [updateLocalDeck, updateArkhamDbDeck]);

  const [createNewDeck] = useInsertNewDeckMutation();
  const [createNextArkhamDbDeck] = useInsertNextArkhamDbDeckMutation();
  const [createNextLocalDeck] = useInsertNextLocalDeckMutation();
  const createBaseDeck = useCallback(async(
    deck: Deck,
    campaignId: number,
  ) => {
    if (!user) {
      throw new Error('No user');
    }
    const deckId = getDeckId(deck);
    const content = {
      campaign_id: campaignId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
      content_hash: await hashDeck(deck),
    };
    const response = await createNewDeck({
      variables: deckId.local ? {
        ...content,
        local_uuid: deckId.uuid,
      } : {
        ...content,
        arkhamdb_id: deckId.id,
      },
    });
    return response?.data?.insert_deck_one?.id;
  }, [createNewDeck, user]);

  const createNextDeck = useCallback(async(
    deck: Deck,
    campaignId: number,
    previousDeckId: DeckId
  ) => {
    if (!user) {
      throw new Error('No user');
    }
    const deckId = getDeckId(deck);
    const content = {
      campaign_id: campaignId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
      content_hash: await hashDeck(deck),
    };
    if (deckId.local) {
      const response = await createNextLocalDeck({
        variables: {
          ...content,
          local_uuid: deckId.uuid,
          previous_local_uuid: previousDeckId.uuid,
        },
      });
      return response.data?.insert_deck_one?.next_deck?.id;
    }

    if (previousDeckId.local) {
      throw new Error(`Can't mix remove and local decks`);
    }
    const response = await createNextArkhamDbDeck({
      variables: {
        ...content,
        arkhamdb_id: deckId.id,
        previous_arkhamdb_id: previousDeckId.id,
      },
    });
    return response.data?.insert_deck_one?.next_deck?.id;
  }, [createNextArkhamDbDeck, createNextLocalDeck, user]);
  return useMemo(() => {
    return {
      updateDeck,
      deleteDeck,
      createBaseDeck,
      createNextDeck,
    };
  }, [updateDeck, deleteDeck, createBaseDeck, createNextDeck]);
}