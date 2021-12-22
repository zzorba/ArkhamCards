import { useCallback, useContext, useMemo, useRef } from 'react';
import { sha1 } from 'react-native-sha256';
import { forEach, keys, map, uniq } from 'lodash';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { AppState, makeDeckSelector } from '@reducers';
import {
  ArkhamDbDeck,
  Deck,
  DeckId,
  UploadedCampaignId,
  getDeckId,
  SYNC_DECK,
  UPLOAD_DECK,
  GroupedUploadedDecks,
} from '@actions/types';
import {
  useDeleteAllArkhamDbDecksMutation,
  useDeleteAllLocalDecksMutation,
  useDeleteArkhamDbDeckMutation,
  useDeleteLocalDeckMutation,
  useInsertNewDeckMutation,
  useInsertNextArkhamDbDeckMutation,
  useInsertNextLocalDeckMutation,
  useUpdateArkhamDbDeckMutation,
  useUpdateLocalDeckMutation,
  AllDeckFragment,
  AllDeckFragmentDoc,
  GetMyDecksQuery,
  GetMyDecksDocument,
  LatestDeckFragment,
  LatestDeckFragmentDoc,
  UserInfoFragment,
  UserInfoFragmentDoc,
  MiniCampaignFragmentDoc,
  MiniCampaignFragment,
} from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ApolloCache, useApolloClient } from '@apollo/client';
import { optimisticUpdates } from './apollo';

let fakeId: number = -1;
export interface DeckActions {
  updateDeck: (deck: Deck, campaignId: UploadedCampaignId) => Promise<void>;
  deleteDeck: (deckId: DeckId, campaignId: UploadedCampaignId, deleteAllVersions: boolean) => Promise<void>;
  createBaseDeck: (
    deck: Deck,
    campaignId: UploadedCampaignId
  ) => Promise<void>;
  createNextDeck: (
    deck: Deck,
    campaignId: UploadedCampaignId,
    previousDeckId: DeckId
  ) => Promise<void>;
}

function hashDeck(deck: Deck): Promise<string> {
  return sha1(JSON.stringify(deck));
}

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
    while (deck) {
      const deckId = getDeckId(deck);
      if (!deck.previousDeckId) {
        await actions.createBaseDeck(deck, campaignId);
      } else {
        await actions.createNextDeck(deck, campaignId, deck.previousDeckId);
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
      dispatch({
        type: SYNC_DECK,
        campaignId,
        investigator,
        uploading: false,
      });
    }
  };
}

export async function syncCampaignDecksFromArkhamDB(
  decks: ArkhamDbDeck[],
  uploadedDecks: GroupedUploadedDecks,
  actions: DeckActions
) {
  const arkhamDbDecksById: { [uuid: string]: ArkhamDbDeck } = {};
  const foundDecks: { [uuid: string]: boolean } = {};
  forEach(decks, d => {
    const deckId = getDeckId(d);
    foundDecks[deckId.uuid] = true;
    arkhamDbDecksById[deckId.uuid] = d;
  });

  // We need to visit the decks in order, from first (base) to last (latest).
  for (let i = 0; i < decks.length; i++) {
    const baseDeck = decks[i];
    if (baseDeck.previousDeckId) {
      // Not a base deck, so continue for now.
      continue;
    }
    const baseDeckId = getDeckId(baseDeck);
    const baseUploadedDecks = uploadedDecks[baseDeckId.uuid];
    if (!baseUploadedDecks) {
      // Not uploaded to ArkhamDB, so we aren't interested in this one, apparently.
      continue;
    }
    let deck: ArkhamDbDeck = baseDeck;
    while (true) {
      const deckId = getDeckId(deck);
      const uploadedDeck = uploadedDecks[deckId.uuid];
      if (uploadedDeck) {
        const hash = await hashDeck(deck);
        if (uploadedDeck.hash !== hash) {
          // Content changed, so we need to update the deck.
          // console.log(`Updating deck ${deck.id} (${uploadedDeck.hash} vs ${hash})`);
          await Promise.all(map(uploadedDeck.campaignId, campaignId => actions.updateDeck(deck, campaignId)));
        }
        if (deck.nextDeckId) {
          // console.log(`Check next deck: ${deck.nextDeckId}`);
          // It has a next deck, let's check if its properly aligned.
          const uploadedNextDeck = uploadedDecks[deck.nextDeckId.uuid];
          if (uploadedNextDeck && (uploadedNextDeck.deckId.local || deck.nextDeckId.id !== uploadedNextDeck.deckId.id)) {
            // console.log(`Next deck seems to be wrong, deleting it so it can be recreated later.`);
            // It already exists, but has the wrong arkhamDbID -- so we delete it, and it will be recreated later (in the loop);
            await Promise.all(map(uploadedNextDeck.campaignId, campaignId => actions.deleteDeck(uploadedNextDeck.deckId, campaignId, false)));
            delete uploadedDecks[deck.nextDeckId.uuid];
          }
        }
      } else if (deck.previousDeckId) {
        // console.log(`Previous deck is present, so creating a new one in the chain.`);
        const previousDeckId = deck.previousDeckId;
        // This is a deck we are interested in uploading, but we don't seem to have a record on our server.
        // So we need to create a 'new' one in the chain.
        await Promise.all(map(baseUploadedDecks.campaignId, campaignId => actions.createNextDeck(deck, campaignId, previousDeckId)))
      }
      const nextDeck: ArkhamDbDeck | undefined = deck.nextDeckId && arkhamDbDecksById[deck.nextDeckId.uuid];
      if (!nextDeck) {
        // console.log(`Done with deck sync: ${deck.investigator_code}.`);
        // Job's done
        break;
      }
      // Keep going until we process the whole 'chain'
      deck = nextDeck;
    }
  }

  // Now to handle the deletion for decks we did *not* find.
  if (decks.length) {
    // If there are zero ArkhamDB decks, we don't delete since we *aren't sure* which are ours.
    const arkhamDbUser = decks[0].user_id;
    const uuids = keys(uploadedDecks);
    for (let i = 0; i < uuids.length; i++) {
      const uuid = uuids[i];
      const uploadedDeck = uploadedDecks[uuid];
      // We need to delete the deck if all of the following are true:
      // 1) a remote deck
      // 2) from the same user
      // 3) that we didn't find in this payload
      if (uploadedDeck && !uploadedDeck.deckId.local &&
        uploadedDeck.deckId.arkhamdb_user === arkhamDbUser &&
        !foundDecks[uploadedDeck.deckId.uuid]
      ) {
        await Promise.all(map(uploadedDeck.campaignId, campaignId => actions.deleteDeck(uploadedDeck.deckId, campaignId, false)));
      }
    }
  }
}

interface RemoteDeckId {
  id: number;
  campaign_id: number;
  local_uuid?: string;
  arkhamdb_id?: number;
  arkhamdb_user?: number;
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

function getUserHandle(cache: ApolloCache<unknown>, userId: string): string | undefined {
  return cache.readFragment<UserInfoFragment>({
    fragment: UserInfoFragmentDoc,
    fragmentName: 'UserInfo',
    id: cache.identify({
      __typename: 'users',
      id: userId,
    }),
  }, true)?.handle || undefined;
}

function getCampaignName(cache: ApolloCache<unknown>, campaignId: number): string {
  return cache.readFragment<MiniCampaignFragment>({
    fragment: MiniCampaignFragmentDoc,
    fragmentName: 'MiniCampaign',
    id: cache.identify({
      __typename: 'campaign',
      id: campaignId,
    }),
  }, true)?.name || '';
}

function getDeckCache(cache: ApolloCache<unknown>, userId: string | undefined): DeckCache {
  const cacheData = cache.readQuery<GetMyDecksQuery>({
    query: GetMyDecksDocument,
    variables: {
      usuerId: userId || '',
    },
  }, true);
  const all: { [id: number]: RemoteDeckInfo | undefined } = {};
  const localDecks: { [uuid: string]: RemoteDeckInfo | undefined } = {};
  const arkhamDbDecks: { [id: number]: RemoteDeckInfo | undefined } = {};

  forEach(cacheData?.users_by_pk?.all_decks || [], (deck) => {
    const id: RemoteDeckInfo = {
      id: deck.id,
      local_uuid: deck.local_uuid || undefined,
      arkhamdb_id: deck.arkhamdb_id || undefined,
      arkhamdb_user: deck.arkhamdb_user || undefined,
      campaign_id: deck.campaign_id,
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

function getPreviousDeck(
  cache: ApolloCache<unknown>,
  campaign_id: number,
  local_uuid: string | undefined,
  arkhamdb_id: number | undefined,
  arkhamdb_user: number | undefined,
): LatestDeckFragment | undefined {
  const currentDeck = cache.readFragment<LatestDeckFragment>({
    fragment: LatestDeckFragmentDoc,
    fragmentName: 'LatestDeck',
    id: cache.identify({
      __typename: 'campaign_deck',
      campaign_id,
      local_uuid: local_uuid || null,
      arkhamdb_id: arkhamdb_id || null,
      arkhamdb_user: arkhamdb_user || null,
    }),
  }, true);
  if (!currentDeck?.previous_deck) {
    return undefined;
  }
  const previousDeck = cache.readFragment<AllDeckFragment>({
    fragment: AllDeckFragmentDoc,
    fragmentName: 'AllDeck',
    id: cache.identify({
      __typename: 'campaign_deck',
      campaign_id,
      local_uuid: currentDeck.previous_deck.local_uuid || null,
      arkhamdb_id: currentDeck.previous_deck.arkhamdb_id || null,
      arkhamdb_user: currentDeck.previous_deck.arkhamdb_user || null,
    }),
  }, true);
  if (!previousDeck) {
    return undefined;
  }
  return {
    __typename: 'campaign_deck',
    campaign: currentDeck.campaign,
    campaign_id: currentDeck.campaign_id,
    investigator_data: currentDeck.investigator_data,
    owner_id: currentDeck.owner_id,
    owner: currentDeck.owner,
    id: previousDeck.id,
    investigator: previousDeck.investigator,
    arkhamdb_id: previousDeck.arkhamdb_id,
    arkhamdb_user: previousDeck.arkhamdb_user,
    local_uuid: previousDeck.local_uuid,
    content: previousDeck.content,
    content_hash: previousDeck.content_hash,
    previous_deck: previousDeck.previous_deck ? {
      __typename: 'campaign_deck',
      ...previousDeck,
      campaign_id: currentDeck.campaign_id,
    } : undefined,
  };
}
export function useDeckActions(): DeckActions {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const apollo = useApolloClient();
  const cache = useRef(apollo.cache);
  cache.current = apollo.cache;

  const [deleteArkhamDbDeck] = useDeleteArkhamDbDeckMutation();
  const [deleteLocalDeck] = useDeleteLocalDeckMutation();
  const [deleteAllArkhamDbDecks] = useDeleteAllArkhamDbDecksMutation();
  const [deleteAllLocalDecks] = useDeleteAllLocalDecksMutation();
  const deleteDeck = useCallback(async(deckId: DeckId, campaignId: UploadedCampaignId, deleteAllVersions: boolean) => {
    const owner_id = userId || '';
    if (deleteAllVersions) {
      const deckCache = getDeckCache(cache.current, userId);
      if (deckId.local) {
        const ids = getAllDeckIds(deckCache.local[deckId.uuid], deckCache);
        await deleteAllLocalDecks({
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
                  arkhamdb_id: null,
                  arkhamdb_user: null,
                  campaign_id: campaignId.serverId,
                  owner_id,
                };
              }),
            },
          },
          variables: {
            local_uuid: deckId.uuid,
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
          update: optimisticUpdates.deleteAllLocalDecks.update,
        });
      } else {
        const ids = getAllDeckIds(deckCache.arkhamDb[deckId.id], deckCache);
        await deleteAllArkhamDbDecks({
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
                  arkhamdb_user: d.arkhamdb_user,
                  local_uuid: null,
                  campaign_id: campaignId.serverId,
                  owner_id,
                };
              }),
            },
          },
          variables: {
            arkhamdb_id: deckId.id,
            campaign_id: campaignId.serverId,
          },
          context: {
            serializationKey: campaignId.serverId,
          },
          update: optimisticUpdates.deleteAllArkhamDbDecks.update,
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
                id: deckId.serverId || (fakeId--),
                campaign_id: campaignId.serverId,
                local_uuid: deckId.uuid,
                arkhamdb_id: null,
                owner_id,
                previous_deck: deckId.serverId ? getPreviousDeck(
                  cache.current,
                  campaignId.serverId,
                  deckId.local ? deckId.uuid : undefined,
                  undefined,
                  undefined,
                ) : undefined,
              },
            ],
          },
        },
        variables: {
          local_uuid: deckId.uuid,
          campaign_id: campaignId.serverId,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.deleteLocalDeck.update,
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
                id: deckId.serverId || (fakeId--),
                campaign_id: campaignId.serverId,
                arkhamdb_id: deckId.id,
                local_uuid: null,
                owner_id,
                previous_deck: deckId.serverId ? getPreviousDeck(
                  cache.current,
                  campaignId.serverId,
                  undefined,
                  deckId.id,
                  undefined,
                ) : undefined,
              },
            ],
          },
        },
        variables: {
          arkhamdb_id: deckId.id,
          campaign_id: campaignId.serverId,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.deleteArkhamDbDeck.update,
      });
    }
  }, [deleteArkhamDbDeck, deleteLocalDeck, deleteAllLocalDecks, deleteAllArkhamDbDecks, userId]);

  const [updateLocalDeck] = useUpdateLocalDeckMutation();
  const [updateArkhamDbDeck] = useUpdateArkhamDbDeckMutation();
  const updateDeck = useCallback(async(deck: Deck, campaignId: UploadedCampaignId) => {
    const owner_id = userId || '';
    const content_hash = await hashDeck(deck);
    if (deck.local) {
      await updateLocalDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          update_campaign_deck: {
            __typename: 'campaign_deck_mutation_response',
            affected_rows: 1,
            returning: [
              {
                __typename: 'campaign_deck',
                id: (fakeId--),
                local_uuid: deck.uuid,
                arkhamdb_id: null,
                campaign_id: campaignId.serverId,
                owner_id,
                content: deck,
                content_hash,
              },
            ],
          },
        },
        variables: {
          local_uuid: deck.uuid,
          campaign_id: campaignId.serverId,
          content: deck,
          content_hash,
        },
        context: {
          serializationKey: campaignId.serverId,
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
                id: (fakeId--),
                arkhamdb_user: deck.user_id,
                local_uuid: null,
                campaign_id: campaignId.serverId,
                owner_id,
                arkhamdb_id: deck.id,
                content: deck,
                content_hash,
              },
            ],
          },
        },
        variables: {
          arkhamdb_id: deck.id,
          arkhamdb_user: deck.user_id,
          campaign_id: campaignId.serverId,
          content: deck,
          content_hash,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
      });
    }
  }, [updateLocalDeck, updateArkhamDbDeck, userId]);

  const [createNewDeck] = useInsertNewDeckMutation();
  const [createNextArkhamDbDeck] = useInsertNextArkhamDbDeckMutation();
  const [createNextLocalDeck] = useInsertNextLocalDeckMutation();
  const createBaseDeck = useCallback(async(
    deck: Deck,
    campaignId: UploadedCampaignId,
  ): Promise<void> => {
    if (!userId) {
      throw new Error('No user');
    }
    const handle = getUserHandle(cache.current, userId);
    const campaignName = getCampaignName(cache.current, campaignId.serverId);
    const content_hash = await hashDeck(deck);
    const variables = {
      campaign_id: campaignId.serverId,
      investigator: deck.investigator_code,
      userId,
      content: deck,
      content_hash,
    };
    await createNewDeck({
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_campaign_deck_one: {
          __typename: 'campaign_deck',
          id: (fakeId--),
          campaign_id: campaignId.serverId,
          local_uuid: deck.local ? deck.uuid : null,
          arkhamdb_id: deck.local ? null : deck.id,
          arkhamdb_user: deck.local ? null : deck.user_id,
          investigator: deck.investigator_code,
          owner_id: userId,
          owner: {
            __typename: 'users',
            id: userId,
            handle,
          },
          previous_deck: null,
          investigator_data: null,
          content: deck,
          content_hash,
          campaign: {
            __typename: 'campaign',
            id: campaignId.serverId,
            uuid: campaignId.campaignId,
            name: campaignName,
          },
        },
      },
      variables: deck.local ? {
        ...variables,
        local_uuid: deck.uuid,
        arkhamdb_user: null,
      } : {
        ...variables,
        arkhamdb_id: deck.id,
        arkhamdb_user: deck.user_id,
      },
      context: {
        serializationKey: campaignId.serverId,
      },
      update: optimisticUpdates.insertNewDeck.update,
    });
  }, [createNewDeck, userId]);

  const createNextDeck = useCallback(async(
    deck: Deck,
    campaignId: UploadedCampaignId,
    previousDeckId: DeckId
  ): Promise<void> => {
    if (!userId) {
      throw new Error('No user');
    }
    const deckId = getDeckId(deck);
    const content_hash = await hashDeck(deck);
    const variables = {
      campaign_id: campaignId.serverId,
      investigator: deck.investigator_code,
      userId,
      content: deck,
      content_hash,
    };
    if (deckId.local) {
      await createNextLocalDeck({
        optimisticResponse: {
          __typename: 'mutation_root',
          insert_campaign_deck_one: {
            __typename: 'campaign_deck',
            id: (fakeId--),
            campaign_id: campaignId.serverId,
            local_uuid: deck.uuid,
            arkhamdb_id: null,
            arkhamdb_user: null,
            investigator: deck.investigator_code,
            owner_id: userId,
            content: deck,
            content_hash,
            previous_deck: {
              __typename: 'campaign_deck',
              id: previousDeckId.serverId || (fakeId--),
              local_uuid: previousDeckId.uuid,
              arkhamdb_id: null,
              campaign_id: campaignId.serverId,
              owner_id: userId,
            },
          },
        },
        variables: {
          ...variables,
          local_uuid: deckId.uuid,
          previous_local_uuid: previousDeckId.uuid,
        },
        context: {
          serializationKey: campaignId.serverId,
        },
        update: optimisticUpdates.insertNextLocalDeck.update,
      });
      return;
    }

    if (previousDeckId.local || deck.local) {
      throw new Error(`Can't mix remote and local decks`);
    }
    await createNextArkhamDbDeck({
      optimisticResponse: {
        __typename: 'mutation_root',
        insert_campaign_deck_one: {
          __typename: 'campaign_deck',
          id: (fakeId--),
          campaign_id: campaignId.serverId,
          arkhamdb_id: deck.id,
          arkhamdb_user: deck.user_id,
          local_uuid: null,
          investigator: deck.investigator_code,
          owner_id: userId,
          content: deck,
          content_hash,
          previous_deck: {
            __typename: 'campaign_deck',
            id: previousDeckId.serverId || (fakeId--),
            local_uuid: null,
            arkhamdb_id: previousDeckId.id,
            campaign_id: campaignId.serverId,
            owner_id: userId,
          },
        },
      },
      variables: {
        ...variables,
        arkhamdb_id: deckId.id,
        arkhamdb_user: deck.user_id,
        previous_arkhamdb_id: previousDeckId.id,
      },
      context: {
        serializationKey: campaignId.serverId,
      },
      update: optimisticUpdates.insertNextArkhamDbDeck.update,
    });
  }, [createNextArkhamDbDeck, createNextLocalDeck, userId]);
  return useMemo(() => {
    return {
      updateDeck,
      deleteDeck,
      createBaseDeck,
      createNextDeck,
    };
  }, [updateDeck, deleteDeck, createBaseDeck, createNextDeck]);
}