import { useCallback, useContext, useMemo, useRef } from 'react';
import { sha1 } from 'react-native-sha256';
import { forEach, keys, map, uniq } from 'lodash';

import { Deck, DeckId, getDeckId, UploadedDeck } from '@actions/types';
import {
  useDeleteAllArkhamDbDeckMutation,
  useDeleteAllLocalDeckMutation,
  useDeleteArkhamDbDeckMutation,
  useDeleteLocalDeckMutation,
  useInsertNewDeckMutation,
  useInsertNextArkhamDbDeckMutation,
  useInsertNextLocalDeckMutation,
  useUpdateArkhamDbDeckMutation,
  useUpdateLocalDeckMutation,
  GetMyDecksQuery,
  GetMyDecksDocument,
} from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ApolloCache, useApolloClient } from '@apollo/client';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface DeckActions {
  updateDeck: (deck: Deck, campaignId: number) => Promise<void>;
  deleteDeck: (deckId: DeckId, campaignId: number, deleteAllVersions: boolean) => Promise<void>;
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
  return sha1(JSON.stringify(deck));
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
          await actions.deleteDeck(uploadedDeck.deckId, campaignId, false);
        }
      }
    }
  }
}

interface RemoteDeckId {
  id: number;
  local_uuid?: string;
  arkhamdb_id?: number;
}

interface RemoteDeckInfo extends RemoteDeckId {
  previous_deck?: number;
  next_deck?: number;
}

interface DeckCache {
  all: { [id: number]: RemoteDeckInfo | undefined };
  local: { [uuid: string]: RemoteDeckInfo | undefined };
  arkhamDb: { [arkhamDbId: number]: RemoteDeckInfo | undefined };
}

function getDeckCache(cache: ApolloCache<unknown>, user: FirebaseAuthTypes.User | undefined): DeckCache {
  const cacheData = cache.readQuery<GetMyDecksQuery>({
    query: GetMyDecksDocument,
    variables: {
      usuerId: user?.uid || '',
    },
  });
  const all: { [id: number]: RemoteDeckId | undefined } = {};
  const localDecks: { [uuid: string]: RemoteDeckId | undefined } = {};
  const arkhamDbDecks: { [id: number]: RemoteDeckId | undefined } = {};

  forEach(cacheData?.users_by_pk?.all_decks || [], (deck) => {
    const id = {
      id: deck.id,
      next_deck: deck.next_deck?.id,
      previous_deck: deck.previous_deck?.id,
    };
    all[deck.id] = id;
    if (deck.local_uuid) {
      localDecks[deck.local_uuid] = id;
    } else if (deck.arkhamdb_id) {
      arkhamDbDecks[deck.arkhamdb_id] = id;
    }
  });

  return {
    all,
    local: localDecks,
    arkhamDb: arkhamDbDecks,
  };
}

function getAllDeckIds(theDeck: RemoteDeckInfo | undefined, deckCache: DeckCache): RemoteDeckInfo[] {
  const ids: RemoteDeckId[] = [];
  let deck = theDeck;
  while (deck) {
    ids.push(deck);
    if (deck.next_deck) {
      deck = deckCache.all[deck.next_deck];
    }
  }
  deck = theDeck;
  while (deck) {
    ids.push(deck);
    if (deck.previous_deck) {
      deck = deckCache.all[deck.previous_deck];
    }
  }
  return uniq(ids);
}

export function useDeckActions(): DeckActions {
  const { user } = useContext(ArkhamCardsAuthContext);
  const apollo = useApolloClient();
  const cache = useRef(apollo.cache);
  cache.current = apollo.cache;

  const [deleteArkhamDbDeck] = useDeleteArkhamDbDeckMutation();
  const [deleteLocalDeck] = useDeleteLocalDeckMutation();
  const [deleteAllArkhamDbDeck] = useDeleteAllArkhamDbDeckMutation();
  const [deleteAllLocalDeck] = useDeleteAllLocalDeckMutation();
  const deleteDeck = useCallback(async(deckId: DeckId, campaignId: number, deleteAllVersions: boolean) => {
    const owner_id = user?.uid || '';
    if (deleteAllVersions) {
      const deckCache = getDeckCache(cache.current, user);
      if (deckId.local) {
        const ids = getAllDeckIds(deckCache.local[deckId.uuid], deckCache);
        await deleteAllLocalDeck({
          optimisticResponse: {
            __typename: 'mutation_root',
            delete_campaign_deck: {
              __typename: 'campaign_deck_mutation_response',
              affected_rows: ids.length,
              returning: map(uniq(ids), d => {
                return {
                  __typename: 'campaign_deck',
                  id: d.id,
                  local_uuid: d.local_uuid,
                  campaign_id: campaignId,
                  owner_id,
                };
              }),
            },
          },
          variables: {
            local_uuid: deckId.uuid,
            campaign_id: campaignId,
          },
          context: {
            serializationKey: campaignId,
          },
        });
      } else {
        const ids = getAllDeckIds(deckCache.arkhamDb[deckId.id], deckCache);
        await deleteAllArkhamDbDeck({
          optimisticResponse: {
            __typename: 'mutation_root',
            delete_campaign_deck: {
              __typename: 'campaign_deck_mutation_response',
              affected_rows: ids.length,
              returning: map(uniq(ids), d => {
                return {
                  __typename: 'campaign_deck',
                  id: d.id,
                  arkhamdb_id: d.arkhamdb_id,
                  campaign_id: campaignId,
                  owner_id,
                };
              }),
            },
          },
          variables: {
            arkhamdb_id: deckId.id,
            campaign_id: campaignId,
          },
          context: {
            serializationKey: campaignId,
          },
        });
      }
      return;
    }

    if (deckId.local) {
      await deleteLocalDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          delete_campaign_deck: {
            __typename: 'campaign_deck_mutation_response',
            affected_rows: 1,
            returning: [
              {
                __typename: 'campaign_deck',
                id: deckId.serverId || -1,
                campaign_id: campaignId,
                local_uuid: deckId.uuid,
              },
            ],
          },
        },
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId,
        },
        context: {
          serializationKey: campaignId,
        },
      });
    } else {
      await deleteArkhamDbDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          delete_campaign_deck: {
            __typename: 'campaign_deck_mutation_response',
            affected_rows: 1,
            returning: [
              {
                __typename: 'campaign_deck',
                id: deckId.serverId || -1,
                campaign_id: campaignId,
                arkhamdb_id: deckId.id,
              },
            ],
          },
        },
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId,
        },
        context: {
          serializationKey: campaignId,
        },
      });
    }
  }, [deleteArkhamDbDeck, deleteLocalDeck, deleteAllLocalDeck, deleteAllArkhamDbDeck, user]);

  const [updateLocalDeck] = useUpdateLocalDeckMutation();
  const [updateArkhamDbDeck] = useUpdateArkhamDbDeckMutation();
  const updateDeck = useCallback(async(deck: Deck, campaignId: number) => {
    const deckId = getDeckId(deck);
    const content_hash = await hashDeck(deck);
    if (deckId.local) {
      await updateLocalDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          update_campaign_deck: {
            __typename: 'campaign_deck_mutation_response',
            affected_rows: 1,
            returning: [
              {
                __typename: 'campaign_deck',
                id: deckId.serverId || -1,
                local_uuid: deckId.uuid,
                content: deck,
                content_hash,
              },
            ],
          },
        },
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId,
          content: deck,
          content_hash,
        },
        context: {
          serializationKey: campaignId,
        },
      });
    } else {
      await updateArkhamDbDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          update_campaign_deck: {
            __typename: 'campaign_deck_mutation_response',
            affected_rows: 1,
            returning: [
              {
                __typename: 'campaign_deck',
                id: deckId.serverId || -1,
                arkhamdb_id: deckId.id,
                content: deck,
                content_hash,
              },
            ],
          },
        },
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId,
          content: deck,
          content_hash,
        },
        context: {
          serializationKey: campaignId,
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
    const content_hash = await hashDeck(deck);
    const variables = {
      campaign_id: campaignId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
      content_hash,
    };
    const response = await createNewDeck({
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_campaign_deck_one: {
          __typename: 'campaign_deck',
          id: -1,
          campaign_id: campaignId,
          investigator: deck.investigator_code,
          owner_id: user.uid,
          content: deck,
          content_hash,
        },
      },
      variables: deckId.local ? {
        ...variables,
        local_uuid: deckId.uuid,
      } : {
        ...variables,
        arkhamdb_id: deckId.id,
      },
      context: {
        serializationKey: campaignId,
      },
    });
    return response?.data?.insert_campaign_deck_one?.id;
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
    const content_hash = await hashDeck(deck);
    const variables = {
      campaign_id: campaignId,
      investigator: deck.investigator_code,
      userId: user.uid,
      content: deck,
      content_hash,
    };
    if (deckId.local) {
      const response = await createNextLocalDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          insert_campaign_deck_one: {
            __typename: 'campaign_deck',
            id: previousDeckId.serverId || -1,
            campaign_id: campaignId,
            local_uuid: previousDeckId.uuid,
            investigator: deck.investigator_code,
            owner_id: user.uid,
            next_deck: {
              __typename: 'campaign_deck',
              id: -1,
              campaign_id: campaignId,
              local_uuid: deck.uuid,
              investigator: deck.investigator_code,
              owner_id: user.uid,
              content: deck,
              content_hash,
            },
          },
        },
        variables: {
          ...variables,
          local_uuid: deckId.uuid,
          previous_local_uuid: previousDeckId.uuid,
        },
        context: {
          serializationKey: campaignId,
        },
      });
      return response.data?.insert_campaign_deck_one?.next_deck?.id;
    }

    if (previousDeckId.local || deck.local) {
      throw new Error(`Can't mix remove and local decks`);
    }
    const response = await createNextArkhamDbDeck({
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_campaign_deck_one: {
          __typename: 'campaign_deck',
          id: previousDeckId.serverId || -1,
          campaign_id: campaignId,
          arkhamdb_id: previousDeckId.id,
          investigator: deck.investigator_code,
          owner_id: user.uid,
          next_deck: {
            __typename: 'campaign_deck',
            id: -1,
            campaign_id: campaignId,
            arkhamdb_id: deck.id,
            investigator: deck.investigator_code,
            owner_id: user.uid,
            content: deck,
            content_hash,
          },
        },
      },
      variables: {
        ...variables,
        arkhamdb_id: deckId.id,
        previous_arkhamdb_id: previousDeckId.id,
      },
      context: {
        serializationKey: campaignId,
      },
    });
    return response.data?.insert_campaign_deck_one?.next_deck?.id;
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