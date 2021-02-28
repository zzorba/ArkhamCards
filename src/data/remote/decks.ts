import { useCallback, useContext, useMemo } from 'react';

import { Deck, DeckId, getDeckId, UploadedCampaignId } from '@actions/types';
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

export interface UpdateDeckActions {
  updateDeck: (deck: Deck, campaignId: UploadedCampaignId) => Promise<void>;
  deleteDeck: (deckId: DeckId, campaignId: UploadedCampaignId) => Promise<void>;
}

export function useUpdateDeckActions(): UpdateDeckActions {
  const [deleteArkhamDbDeck] = useDeleteArkhamDbDeckMutation();
  const [deleteLocalDeck] = useDeleteLocalDeckMutation();
  const deleteDeck = useCallback(async(deckId: DeckId, campaignId: UploadedCampaignId) => {
    if (deckId.local) {
      await deleteLocalDeck({
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId.serverId,
        },
      });
    } else {
      await deleteArkhamDbDeck({
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId.serverId,
        },
      });
    }
  }, [deleteArkhamDbDeck, deleteLocalDeck]);

  const [updateLocalDeck] = useUpdateLocalDeckMutation();
  const [updateArkhamDbDeck] = useUpdateArkhamDbDeckMutation();
  const updateDeck = useCallback(async(deck: Deck, campaignId: UploadedCampaignId) => {
    const deckId = getDeckId(deck);
    if (deckId.local) {
      await updateLocalDeck({
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId.serverId,
          content: deck,
        },
      });
    } else {
      await updateArkhamDbDeck({
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId.serverId,
          content: deck,
        },
      });
    }
  }, [updateLocalDeck, updateArkhamDbDeck]);
  return useMemo(() => {
    return {
      updateDeck,
      deleteDeck,
    };
  }, [updateDeck, deleteDeck]);
}

export interface CreateDeckActions extends UpdateDeckActions {
  createBaseDeck: (
    deck: Deck,
    campaignId: UploadedCampaignId
  ) => Promise<number | undefined>;
  createNextDeck: (
    deck: Deck,
    campaignId: UploadedCampaignId,
    previousDeckId: DeckId
  ) => Promise<number | undefined>;
}

export function useCreateDeckActions(): CreateDeckActions {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [createNewDeck] = useInsertNewDeckMutation();
  const [createNextArkhamDbDeck] = useInsertNextArkhamDbDeckMutation();
  const [createNextLocalDeck] = useInsertNextLocalDeckMutation();
  const updateDeckActions = useUpdateDeckActions();
  const createBaseDeck = useCallback(async(
    deck: Deck,
    campaignId: UploadedCampaignId,
  ) => {
    if (!user) {
      throw new Error('No user');
    }
    const deckId = getDeckId(deck);
    const content = {
      campaign_id: campaignId.serverId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
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
    campaignId: UploadedCampaignId,
    previousDeckId: DeckId
  ) => {
    if (!user) {
      throw new Error('No user');
    }
    const deckId = getDeckId(deck);
    const content = {
      campaign_id: campaignId.serverId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
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
      ...updateDeckActions,
      createBaseDeck,
      createNextDeck,
    };
  }, [createBaseDeck, createNextDeck, updateDeckActions]);
}
