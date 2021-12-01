import { ApolloCache, DocumentNode, MutationUpdaterFn } from '@apollo/client';
import { filter, find, flatMap, map, pick, omit } from 'lodash';

import {
  AddCampaignInvestigatorDocument,
  AddCampaignInvestigatorMutation,
  AddGuideInputDocument,
  AddGuideInputMutation,
  DecCountAchievementDocument,
  DecCountAchievementMutation,
  DeleteAllLocalDecksMutation,
  DeleteAllLocalDecksDocument,
  DeleteInvestigatorDecksDocument,
  DeleteInvestigatorDecksMutation,
  FullCampaignFragment,
  FullCampaignFragmentDoc,
  FullCampaignGuideStateFragment,
  FullCampaignGuideStateFragmentDoc,
  FullInvestigatorDataFragment,
  GetCampaignDocument,
  GetCampaignGuideDocument,
  GetCampaignGuideQuery,
  GetCampaignQuery,
  GetMyCampaignsDocument,
  GetMyCampaignsQuery,
  GetMyDecksDocument,
  GetMyDecksQuery,
  GuideAchievementFragment,
  GuideAchievementFragmentDoc,
  IncCountAchievementDocument,
  IncCountAchievementMaxDocument,
  IncCountAchievementMaxMutation,
  IncCountAchievementMutation,
  MiniCampaignFragment,
  RemoveCampaignInvestigatorDocument,
  RemoveCampaignInvestigatorMutation,
  RemoveGuideInputsDocument,
  RemoveGuideInputsMutation,
  SetBinaryAchievementDocument,
  SetBinaryAchievementMutation,
  UpdateAvailableXpDocument,
  UpdateAvailableXpMutation,
  UpdateCampaignDifficultyDocument,
  UpdateCampaignGuideVersionDocument,
  UpdateCampaignNameDocument,
  UpdateCampaignNotesDocument,
  UpdateCampaignScenarioResultsDocument,
  UpdateCampaignShowInterludesDocument,
  UpdateChaosBagDocument,
  UpdateInvestigatorDataDocument,
  UpdateInvestigatorDataMutation,
  UpdateInvestigatorTraumaDocument,
  UpdateInvestigatorTraumaMutation,
  UpdateSpentXpDocument,
  UpdateSpentXpMutation,
  UpdateWeaknessSetDocument,
  UploadNewCampaignMutation,
  DeleteAllArkhamDbDecksMutation,
  DeleteAllArkhamDbDecksDocument,
  DeleteArkhamDbDeckMutation,
  LatestDeckFragment,
  MiniDeckFragment,
  AllDeckFragment,
  DeleteArkhamDbDeckDocument,
  DeleteLocalDeckDocument,
  DeleteLocalDeckMutation,
  UpdateLocalDeckDocument,
  UpdateArkhamDbDeckDocument,
  InsertNewDeckMutation,
  InsertNewDeckDocument,
  InsertNextLocalDeckDocument,
  InsertNextArkhamDbDeckDocument,
  InsertNextLocalDeckMutation,
  IdDeckFragment,
  InsertNextArkhamDbDeckMutation,
  GetLatestLocalDeckQuery,
  GetLatestLocalDeckDocument,
  GetLatestArkhamDbDeckQuery,
  GetLatestArkhamDbDeckDocument,
  GetLatestDeckQuery,
  GetLatestDeckDocument,
  MiniInvestigatorDataFragment,
  MiniCampaignFragmentDoc,
} from '@generated/graphql/apollo-schema';

interface RemoveDeck {
  type: 'remove';
}
interface KeepDeck {
  type: 'keep';
}
interface SwapDeck<T> {
  type: 'swap';
  deck: T;
  insert?: T;
}

type UpdateDeck<T> = RemoveDeck | KeepDeck | SwapDeck<T>;

type LatestDecks = { __typename?: 'latest_decks', deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number, owner: { __typename?: 'users', id: string, handle?: string | null | undefined }, campaign: { __typename?: 'campaign', id: number, uuid: string, name?: string | null | undefined }, investigator_data?: { __typename?: 'investigator_data', id?: string | null | undefined, killed?: boolean | null | undefined, insane?: boolean | null | undefined, physical?: number | null | undefined, mental?: number | null | undefined } | null | undefined, previous_deck?: { __typename?: 'campaign_deck', arkhamdb_user?: number | null | undefined, content?: any | null | undefined, content_hash?: string | null | undefined, investigator: string, id: number, owner_id: string, arkhamdb_id?: number | null | undefined, local_uuid?: string | null | undefined, campaign_id: number } | null | undefined } | null | undefined };

function updateDecks(
  cache: ApolloCache<unknown>,
  campaign_id: number,
  owner_id: string,
  updateAllDeck: (allDeck: AllDeckFragment) => UpdateDeck<AllDeckFragment>,
  updateLatestDeck: (latestDeck: LatestDeckFragment) => UpdateDeck<LatestDeckFragment>
) {
  updateFullCampaign(cache, campaign_id, (fragment): FullCampaignFragment => {
    return {
      ...fragment,
      latest_decks: flatMap(fragment.latest_decks || [], (d) => {
        if (d.deck) {
          const result = updateLatestDeck(d.deck);
          switch (result.type) {
            case 'keep': return [{
              __typename: 'latest_decks',
              deck: d.deck,
            }];
            case 'remove': return [];
            case 'swap': {
              const r: LatestDecks[] = [
                {
                  __typename: 'latest_decks',
                  deck: {
                    ...result.deck,
                    investigator_data: result.deck.investigator_data || d.deck.investigator_data || null,
                  },
                },
              ];
              if (result.insert) {
                r.push(
                  {
                    __typename: 'latest_decks',
                    deck: {
                      ...result.insert,
                      investigator_data: result.insert.investigator_data || d.deck.investigator_data || null,
                    },
                  },
                );
              }
              return r;
            }
          }
        }
        return [];
      }),
    };
  });
  const myDecks = cache.readQuery<GetMyDecksQuery>({
    query: GetMyDecksDocument,
    variables: {
      userId: owner_id,
    },
  }, true);
  if (myDecks?.users_by_pk) {
    cache.writeQuery<GetMyDecksQuery>({
      query: GetMyDecksDocument,
      variables: {
        userId: owner_id,
      },
      data: {
        users_by_pk: {
          __typename: 'users',
          id: owner_id,
          decks: flatMap(myDecks.users_by_pk.decks || [], (d) => {
            if (d.deck) {
              const result = updateLatestDeck(d.deck);
              switch (result.type) {
                case 'keep': return [d];
                case 'remove': return [];
                case 'swap': {
                  const latestDeck = {
                    ...result.deck,
                    investigator_data: result.deck.investigator_data || d.deck.investigator_data,
                  };
                  if (latestDeck.local_uuid) {
                    cache.writeQuery<GetLatestLocalDeckQuery>({
                      query: GetLatestLocalDeckDocument,
                      variables: {
                        campaign_id: latestDeck.campaign_id,
                        local_uuid: latestDeck.local_uuid,
                      },
                      data: {
                        __typename: 'query_root',
                        campaign_deck: [latestDeck],
                      },
                    });
                  } else if (latestDeck.arkhamdb_id) {
                    cache.writeQuery<GetLatestArkhamDbDeckQuery>({
                      query: GetLatestArkhamDbDeckDocument,
                      variables: {
                        campaign_id: latestDeck.campaign_id,
                        arkhamdb_id: latestDeck.arkhamdb_id,
                      },
                      data: {
                        __typename: 'query_root',
                        campaign_deck: [latestDeck],
                      },
                    });
                  }
                  const r: LatestDecks[] = [{
                    __typename: 'latest_decks',
                    deck: latestDeck,
                  }];
                  if (result.insert) {
                    r.push({
                      __typename: 'latest_decks',
                      deck: result.insert,
                    });
                  }
                  return r;
                }
              }
            }
            return [];
          }),
          all_decks: flatMap(myDecks.users_by_pk.all_decks, d => {
            const result = updateAllDeck(d);
            switch (result.type) {
              case 'keep': return [d];
              case 'remove': return [];
              case 'swap': return [
                result.deck,
                ...(result.insert ? [result.insert] : []),
              ];
            }
          }),
        },
      },
    });
  }
}

function removeAllMatchingDecks(
  cache: ApolloCache<unknown>,
  campaign_id: number,
  owner_id: string,
  filterById: (id: number) => boolean,
  filterByUuid: (uuid: string) => boolean,
  filterByArkhamDbId: (id: number) => boolean
) {
  const keepDeck = (d: {
    id: number;
    arkhamdb_id?: number | null;
    local_uuid?: string | null;
  }) => {
    if (d.id > 0) {
      return filterById(d.id);
    }
    if (d.local_uuid) {
      return filterByUuid(d.local_uuid);
    }
    if (d.arkhamdb_id) {
      return filterByArkhamDbId(d.arkhamdb_id);
    }
    return true;
  };

  updateDecks(cache, campaign_id, owner_id,
    (deck: AllDeckFragment) => {
      return { type: keepDeck(deck) ? 'keep' : 'remove' };
    },
    (deck: LatestDeckFragment) => {
      return { type: keepDeck(deck) ? 'keep' : 'remove' };
    }
  );
}

export const uploadLocalDeck = (
  cache: ApolloCache<unknown>,
  campaign_id: number,
  owner_id: string,
  local_uuid: string,
  arkhamdb_id: number,
) => {
  const swapDeck = (deck: IdDeckFragment) => {
    return !!(deck.local_uuid && deck.local_uuid === local_uuid);
  };
  updateDecks(cache, campaign_id, owner_id,
    (deck: AllDeckFragment) => {
      return swapDeck(deck) ? {
        type: 'swap',
        deck: {
          ...deck,
          local_uuid: null,
          arkhamdb_id,
        },
      } : { type: 'keep' };
    },
    (deck: LatestDeckFragment) => {
      if (swapDeck(deck)) {
        const theDeck = {
          ...deck,
          local_uuid: null,
          arkhamdb_id,
        };
        // console.log(`${new Date().toTimeString()}: Caching uploaded deck ${theDeck.id},${theDeck.arkhamdb_id},${theDeck.local_uuid}`);
        cache.writeQuery<GetLatestDeckQuery>({
          query: GetLatestDeckDocument,
          variables: {
            id: theDeck.id,
          },
          data: {
            __typename: 'query_root',
            campaign_deck_by_pk: theDeck,
          },
        });
        return {
          type: 'swap',
          deck: theDeck,
        };
      }
      return { type: 'keep' };
    }
  );
};

export const handleInsertNextLocalDeck: MutationUpdaterFn<InsertNextLocalDeckMutation> = (cache, { data }) => {
  if (!data?.insert_campaign_deck_one?.previous_deck) {
    return;
  }
  const newDeck = omit(data.insert_campaign_deck_one, ['previous_deck']);
  const oldDeck = data.insert_campaign_deck_one.previous_deck;

  const swapDeck = (deck: IdDeckFragment) => {
    return !!(deck.local_uuid && deck.local_uuid === oldDeck.local_uuid) || !!(deck.arkhamdb_id && deck.arkhamdb_id === oldDeck.arkhamdb_id);
  };

  updateDecks(cache, oldDeck.campaign_id, oldDeck.owner_id,
    (deck: AllDeckFragment) => {
      return swapDeck(deck) ? {
        type: 'swap',
        deck: {
          ...omit(deck, ['next_deck']),
          next_deck: {
            __typename: 'campaign_deck',
            campaign_id: newDeck.campaign_id,
            id: newDeck.id,
            owner_id: newDeck.owner_id,
            arkhamdb_id: newDeck.arkhamdb_id,
            local_uuid: newDeck.local_uuid,
          },
        },
        insert: {
          __typename: 'campaign_deck',
          ...newDeck,
          campaign: deck.campaign,
          previous_deck: {
            __typename: 'campaign_deck',
            ...omit(deck, ['previous_deck', 'next_deck']),
            investigator: newDeck.investigator,
          },
          next_deck: null,
        },
      } : { type: 'keep' };
    },
    (deck: LatestDeckFragment) => {
      if (swapDeck(deck)) {
        const theDeck = {
          ...pick(deck, ['investigator_data', 'investigator', 'campaign', 'owner']),
          ...newDeck,
          investigator_data: deck.investigator_data,
          previous_deck: deck,
          next_deck: null,
        };
        // console.log(`${new Date().toTimeString()}: Caching uploaded deck ${theDeck.id},${theDeck.arkhamdb_id},${theDeck.local_uuid}`);
        cache.writeQuery<GetLatestDeckQuery>({
          query: GetLatestDeckDocument,
          variables: {
            id: newDeck.id,
          },
          data: {
            __typename: 'query_root',
            campaign_deck_by_pk: theDeck,
          },
        });
        return {
          type: 'swap',
          deck: theDeck,
        };
      }
      return { type: 'keep' };
    }
  );
};


export const handleInsertNextArkhamDbDeck: MutationUpdaterFn<InsertNextArkhamDbDeckMutation> = (cache, { data }) => {
  if (!data?.insert_campaign_deck_one?.previous_deck) {
    return;
  }
  const oldDeck = data.insert_campaign_deck_one?.previous_deck;
  const newDeck = omit(data.insert_campaign_deck_one, ['previous_deck']);

  const swapDeck = (deck: IdDeckFragment) => {
    return !!(deck.local_uuid && deck.local_uuid === oldDeck.local_uuid) || !!(deck.arkhamdb_id && deck.arkhamdb_id === oldDeck.arkhamdb_id);
  };

  updateDecks(cache, oldDeck.campaign_id, oldDeck.owner_id,
    (deck: AllDeckFragment) => {
      return swapDeck(deck) ? {
        type: 'swap',
        deck: {
          ...omit(deck, ['next_deck']),
          next_deck: {
            __typename: 'campaign_deck',
            campaign_id: newDeck.campaign_id,
            id: newDeck.id,
            owner_id: newDeck.owner_id,
            arkhamdb_id: newDeck.arkhamdb_id,
            local_uuid: newDeck.local_uuid,
          },
        },
        insert: {
          __typename: 'campaign_deck',
          ...newDeck,
          campaign: deck.campaign,
          previous_deck: {
            __typename: 'campaign_deck',
            ...omit(deck, ['previous_deck', 'next_deck']),
            investigator: newDeck.investigator,
          },
          next_deck: null,
        },
      } : { type: 'keep' };
    },
    (deck: LatestDeckFragment) => {
      if (swapDeck(deck)) {
        const theDeck = {
          ...pick(deck, ['investigator_data', 'investigator', 'campaign', 'owner']),
          ...newDeck,
          investigator_data: deck.investigator_data,
          previous_deck: deck,
          next_deck: null,
        };
        // console.log(`${new Date().toTimeString()}: Caching uploaded deck ${theDeck.id},${theDeck.arkhamdb_id},${theDeck.local_uuid}`);
        cache.writeQuery<GetLatestDeckQuery>({
          query: GetLatestDeckDocument,
          variables: {
            id: newDeck.id,
          },
          data: {
            __typename: 'query_root',
            campaign_deck_by_pk: {
              ...pick(deck, ['owner']),
              ...theDeck,
            },
          },
        });
        return {
          type: 'swap',
          deck: theDeck,
        };
      }
      return { type: 'keep' };
    }
  );
};


export const handleInsertNewDeck: MutationUpdaterFn<InsertNewDeckMutation> = (cache, { data }) => {
  if (!data?.insert_campaign_deck_one) {
    return;
  }
  const deck = data.insert_campaign_deck_one;
  updateMiniCampaign(cache, deck.campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: [
        ...filter(campaign.latest_decks, d => d.deck?.investigator !== deck.investigator),
        {
          __typename: 'latest_decks',
          deck,
        },
      ],
    };
  });
  updateFullCampaign(cache, deck.campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: [
        ...filter(campaign.latest_decks, d => d.deck?.investigator !== deck.investigator),
        {
          __typename: 'latest_decks',
          deck,
        },
      ],
    };
  });
  // console.log(`${new Date().toTimeString()}: Caching uploaded deck2 ${deck.id},${deck.arkhamdb_id},${deck.local_uuid}`);
  cache.writeQuery<GetLatestDeckQuery>({
    query: GetLatestDeckDocument,
    variables: {
      id: deck.id,
    },
    data: {
      __typename: 'query_root',
      campaign_deck_by_pk: deck,
    },
  });

  const myDecks = cache.readQuery<GetMyDecksQuery>({
    query: GetMyDecksDocument,
    variables: {
      userId: deck.owner_id,
    },
  }, true);
  if (myDecks?.users_by_pk) {
    const matches = (id: number, arkhamdb_id: number | undefined | null, local_uuid: string | undefined | null): boolean => {
      if (id < 0 || deck.id < 0) {
        return !!((arkhamdb_id && arkhamdb_id === deck.arkhamdb_id) ||
          (local_uuid && local_uuid === deck.local_uuid));
      }
      return (id === deck.id);
    };

    cache.writeQuery<GetMyDecksQuery>({
      query: GetMyDecksDocument,
      variables: {
        userId: deck.owner_id,
      },
      data: {
        users_by_pk: {
          __typename: 'users',
          id: deck.owner_id,
          decks: [
            ...filter(myDecks.users_by_pk.decks, d => d.deck ? !matches(d.deck.id, d.deck.arkhamdb_id, d.deck.local_uuid) : false),
            {
              __typename: 'latest_decks',
              deck,
            },
          ],
          all_decks: [
            ...filter(myDecks.users_by_pk.all_decks, d => !matches(d.id, d.arkhamdb_id, d.local_uuid)),
            {
              __typename: 'campaign_deck',
              next_deck: null,
              ...deck,
            },
          ],
        },
      },
    });
  }
};

export const handleDeleteAllArkhamDbDecks: MutationUpdaterFn<DeleteAllArkhamDbDecksMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { campaign_id, owner_id } = data.delete_campaign_deck.returning[0];
  const arkhamdb_ids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.arkhamdb_id || []));
  const ids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.id < 0 ? [] : d.id));

  removeAllMatchingDecks(
    cache,
    campaign_id,
    owner_id,
    (id: number) => !ids.has(id),
    () => true,
    (id: number) => !arkhamdb_ids.has(id)
  );
};

export const handleDeleteAllLocalDecks: MutationUpdaterFn<DeleteAllLocalDecksMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { campaign_id, owner_id } = data.delete_campaign_deck.returning[0];
  const local_uuids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.local_uuid || []));
  const ids = new Set(flatMap(data.delete_campaign_deck.returning, d => d.id < 0 ? [] : d.id));

  removeAllMatchingDecks(
    cache,
    campaign_id,
    owner_id,
    (id: number) => !ids.has(id),
    (uuid: string) => !local_uuids.has(uuid),
    () => true
  );
};

function removeDeck(
  cache: ApolloCache<unknown>,
  campaign_id: number,
  owner_id: string,
  matchesDeck: (deck: MiniDeckFragment) => boolean,
  previousDeck?: LatestDeckFragment
) {
  updateDecks(
    cache,
    campaign_id,
    owner_id,
    (deck: AllDeckFragment) => {
      if (matchesDeck(deck)) {
        return previousDeck ? {
          type: 'swap',
          deck: {
            __typename: 'campaign_deck',
            campaign_id,
            campaign: deck.campaign,
            id: previousDeck.id,
            arkhamdb_id: previousDeck.arkhamdb_id,
            local_uuid: previousDeck.local_uuid,
            owner_id,
            investigator: previousDeck.investigator,
            content: previousDeck.content,
            content_hash: previousDeck.content_hash,
            next_deck: null,
            previous_deck: previousDeck.previous_deck ? {
              __typename: 'campaign_deck',
              id: previousDeck.previous_deck.id,
              campaign_id,
              arkhamdb_id: previousDeck.previous_deck.id,
              local_uuid: previousDeck.previous_deck.local_uuid,
              owner_id,
            } : null,
          },
        } : { type: 'remove' };
      }
      if (deck.next_deck && matchesDeck({ ...deck.next_deck, investigator: deck.investigator })) {
        return {
          type: 'swap',
          deck: {
            __typename: 'campaign_deck',
            ...omit(deck, ['next_deck']),
          },
        };
      }
      return { type: 'keep' };
    },
    (deck: LatestDeckFragment) => {
      if (matchesDeck(deck)) {
        return deck.previous_deck ? {
          type: 'swap',
          deck: {
            ...(deck.previous_deck || {}),
            owner_id: deck.owner_id,
            owner: deck.owner,
            campaign_id: deck.campaign_id,
            campaign: deck.campaign,
          },
        } : { type: 'remove' };
      }
      return { type: 'keep' };
    }
  );
}

export const handleDeleteArkhamDbDeck: MutationUpdaterFn<DeleteArkhamDbDeckMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { campaign_id, owner_id, arkhamdb_id, previous_deck } = data.delete_campaign_deck.returning[0];
  const matchesDeck = (deck: MiniDeckFragment) => {
    return !!(deck.arkhamdb_id && deck.arkhamdb_id === arkhamdb_id);
  };
  removeDeck(cache, campaign_id, owner_id, matchesDeck, previous_deck || undefined);
};

export const handleDeleteLocalDeck: MutationUpdaterFn<DeleteLocalDeckMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { campaign_id, owner_id, local_uuid, previous_deck } = data.delete_campaign_deck.returning[0];
  const matchesDeck = (deck: MiniDeckFragment) => {
    return !!(deck.local_uuid && deck.local_uuid === local_uuid);
  };
  removeDeck(cache, campaign_id, owner_id, matchesDeck, previous_deck || undefined);
};

export const deleteCampaignFromCache = (cache: ApolloCache<unknown>, userId: string, uuid: string, campaign_id: number) => {
  const cacheData = cache.readQuery<GetMyCampaignsQuery>({
    query: GetMyCampaignsDocument,
    variables: {
      userId,
    },
  }, true);
  if (!cacheData || !cacheData.users_by_pk) {
    return;
  }
  cache.writeQuery<GetMyCampaignsQuery>({
    query: GetMyCampaignsDocument,
    variables: {
      userId,
    },
    data: {
      users_by_pk: {
        __typename: 'users',
        id: userId,
        campaigns: [
          ...filter(cacheData.users_by_pk.campaigns, c => c.campaign?.uuid !== uuid),
        ],
      },
    },
  });
  updateDecks(
    cache,
    campaign_id,
    userId,
    (deck: AllDeckFragment) => {
      return { type: deck.campaign_id === campaign_id ? 'remove' : 'keep' };
    },
    (deck: LatestDeckFragment) => {
      return { type: deck.campaign_id === campaign_id ? 'remove' : 'keep' };
    }
  );
}

export const handleUploadNewCampaign: MutationUpdaterFn<UploadNewCampaignMutation> = (cache, { data }) => {
  if (data === undefined || !data?.update_campaign_by_pk) {
    return;
  }
  const campaignId = data.update_campaign_by_pk.id;
  const ownerId = data.update_campaign_by_pk.owner_id;

  cache.writeQuery<GetCampaignQuery>({
    query: GetCampaignDocument,
    variables: {
      campaign_id: campaignId,
    },
    data: {
      __typename: 'query_root',
      campaign_by_pk: data.update_campaign_by_pk,
    },
  });
  if (!data.update_campaign_by_pk.linked_campaign) {
    const cacheData = cache.readQuery<GetMyCampaignsQuery>({
      query: GetMyCampaignsDocument,
      variables: {
        userId: ownerId,
      },
    }, true);
    if (!cacheData || !cacheData.users_by_pk) {
      return;
    }
    cache.writeQuery<GetMyCampaignsQuery>({
      query: GetMyCampaignsDocument,
      variables: {
        userId: ownerId,
      },
      data: {
        users_by_pk: {
          __typename: 'users',
          id: ownerId,
          campaigns: [
            ...filter(cacheData.users_by_pk.campaigns, c => c.campaign?.id !== campaignId),
            {
              __typename: 'user_campaigns',
              campaign: data.update_campaign_by_pk,
            },
          ],
        },
      },
    });
  }
};

function updateCampaignGuide(cache: ApolloCache<unknown>, campaignId: number, update: (cacheData: FullCampaignGuideStateFragment) => FullCampaignGuideStateFragment) {
  const cacheData = cache.readQuery<GetCampaignGuideQuery>({
    query: GetCampaignGuideDocument,
    variables: {
      campaign_id: campaignId,
    },
  }, true);
  if (cacheData === null || !cacheData.campaign_guide.length) {
    return;
  }

  const campaignGuide = cacheData.campaign_guide[0];
  const newCampaignGuide = update(campaignGuide);
  cache.writeQuery<GetCampaignGuideQuery>({
    query: GetCampaignGuideDocument,
    variables: {
      campaign_id: campaignId,
    },
    data: {
      campaign_guide: [newCampaignGuide],
    },
  });
}


const handleAddGuideInput: MutationUpdaterFn<AddGuideInputMutation> = (cache, { data }) => {
  if (data === undefined || !data?.insert_guide_input_one) {
    return;
  }
  const campaignId = data.insert_guide_input_one.campaign_id;
  const inputId = data.insert_guide_input_one.id;
  const guide_input = data.insert_guide_input_one;
  updateCampaignGuide(cache, campaignId, campaignGuide => {
    const { guide_inputs } = campaignGuide;
    const newGuideInputs = [
      ...filter(guide_inputs, i => i.id !== inputId),
      {
        ...guide_input,
      },
    ];
    return {
      ...campaignGuide,
      guide_inputs: newGuideInputs,
    }
  });
};


const handleRemoveGuideInputs: MutationUpdaterFn<RemoveGuideInputsMutation> = (cache, { data }) => {
  if (data === undefined || !data?.delete_guide_input?.returning.length) {
    return;
  }
  const deletes = data.delete_guide_input.returning;
  const campaignId = deletes[0].campaign_id;
  const ids = new Set(map(deletes, d => d.id));
  updateCampaignGuide(cache, campaignId, (campaignGuide) => {
    return {
      ...campaignGuide,
      guide_inputs: filter(campaignGuide.guide_inputs, i => !ids.has(i.id)),
    }
  });
};

function updateMiniCampaign(cache: ApolloCache<unknown>, campaignId: number, update: (fragment: MiniCampaignFragment) => MiniCampaignFragment) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<MiniCampaignFragment>({
    fragment: MiniCampaignFragmentDoc,
    fragmentName: 'MiniCampaign',
    id,
  }, true);
  if (existingCacheData) {
    const data = update(existingCacheData);
    cache.writeFragment<MiniCampaignFragment>({
      fragment: MiniCampaignFragmentDoc,
      fragmentName: 'MiniCampaign',
      data,
    });
  }
}


function updateFullCampaign(cache: ApolloCache<unknown>, campaignId: number, update: (fragment: FullCampaignFragment) => FullCampaignFragment) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<FullCampaignFragment>({
    fragment: FullCampaignFragmentDoc,
    fragmentName: 'FullCampaign',
    id,
  }, true);
  if (existingCacheData) {
    const data = update(existingCacheData);
    cache.writeFragment<FullCampaignFragment>({
      fragment: FullCampaignFragmentDoc,
      fragmentName: 'FullCampaign',
      data,
    });
  }
}


function updateFullCampaignGuide(
  cache: ApolloCache<unknown>,
  campaignId: number,
  update: (fragment: FullCampaignGuideStateFragment) => FullCampaignGuideStateFragment
) {
  const id = cache.identify({ __typename: 'campaign', id: campaignId });
  const existingCacheData = cache.readFragment<FullCampaignGuideStateFragment>({
    fragment: FullCampaignGuideStateFragmentDoc,
    fragmentName: 'FullCampaignGuideState',
    id,
  }, true);
  if (existingCacheData) {
    cache.writeFragment<FullCampaignGuideStateFragment>({
      fragment: FullCampaignGuideStateFragmentDoc,
      fragmentName: 'FullCampaignGuideState',
      data: update(existingCacheData),
    });
  }
}

const handleDeleteInvestigatorDecks: MutationUpdaterFn<DeleteInvestigatorDecksMutation> = (cache, { data }) => {
  if (!data?.delete_campaign_deck?.returning.length) {
    return;
  }
  const { investigator, campaign_id, owner_id } = data.delete_campaign_deck.returning[0];
  updateMiniCampaign(cache, campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: filter(campaign.latest_decks, d => d.deck?.investigator !== investigator),
    };
  });
  updateFullCampaign(cache, campaign_id, (campaign) => {
    return {
      ...campaign,
      latest_decks: filter(campaign.latest_decks, d => d.deck?.investigator !== investigator),
    };
  });
  updateDecks(
    cache,
    campaign_id,
    owner_id,
    (deck: AllDeckFragment) => {
      return { type: deck.campaign_id === campaign_id && deck.investigator === investigator ? 'remove' : 'keep' };
    },
    (deck: LatestDeckFragment) => {
      return { type: deck.campaign_id === campaign_id && deck.investigator === investigator ? 'remove' : 'keep' };
    });
};

const handleAddCampaignInvestigator: MutationUpdaterFn<AddCampaignInvestigatorMutation> = (cache, { data }) => {
  if (!data?.insert_campaign_investigator_one) {
    return;
  }
  const { campaign_id, investigator } = data.insert_campaign_investigator_one;
  updateFullCampaign(
    cache,
    campaign_id,
    (existingCacheData: FullCampaignFragment) => {
      return {
        ...existingCacheData,
        investigators: [
          ...filter(existingCacheData.investigators, i => i.investigator !== investigator),
          {
            __typename: 'campaign_investigator',
            id: `${campaign_id}-${investigator}`,
            investigator,
          },
        ],
      };
    }
  );
};

const handleRemoveCampaignInvestigator: MutationUpdaterFn<RemoveCampaignInvestigatorMutation> = (cache, { data }) => {
  if (!data?.delete_campaign_investigator?.returning) {
    return;
  }
  const removed = data.delete_campaign_investigator?.returning;
  if (removed.length) {
    const removal = removed[0];
    const removalSet = new Set(map(removed, i => i.investigator));
    const campaign_id = removal.campaign_id;
    updateMiniCampaign(
      cache,
      campaign_id,
      (existingCacheData: MiniCampaignFragment) => {
        return {
          ...existingCacheData,
          investigators: filter(existingCacheData.investigators, i => !removalSet.has(i.investigator)),
        };
      }
    );
  }
};

const handleUpdateInvestigatorTrauma: MutationUpdaterFn<UpdateInvestigatorTraumaMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  const mini_investigator_data = pick(investigator_data, ['__typename', 'id', 'campaign_id', 'investigator', 'mental', 'physical', 'insane', 'killed', 'storuAssets']) as MiniInvestigatorDataFragment;
  updateMiniCampaign(
    cache,
    investigator_data.campaign_id,
    (existingCacheData: MiniCampaignFragment) => {
      const existingInvestigatorData = find(existingCacheData.investigator_data, id => id.investigator === investigator_data.investigator);
      if (!existingInvestigatorData) {
        return {
          ...existingCacheData,
          investigator_data: [
            ...existingCacheData.investigator_data || [],
            mini_investigator_data,
          ],
        };
      }
      return {
        ...existingCacheData,
        investigator_data: map(existingCacheData.investigator_data, id => {
          if (id.investigator !== investigator_data.investigator) {
            return id;
          }
          return {
            ...existingInvestigatorData,
            ...investigator_data,
          };
        }),
      };
    }
  );
};

function updateFullInvestigatorData(cache: ApolloCache<unknown>, campaignId: number, investigator: string, update: (investigator_data?: FullInvestigatorDataFragment) => FullInvestigatorDataFragment) {
  updateFullCampaign(
    cache,
    campaignId,
    (existingCacheData: FullCampaignFragment) => {
      const existingInvestigatorData = find(existingCacheData.investigator_data, id => id.investigator === investigator);
      if (!existingInvestigatorData) {
        return {
          ...existingCacheData,
          investigator_data: [
            ...existingCacheData.investigator_data || [],
            update(),
          ],
        };
      }
      return {
        ...existingCacheData,
        investigator_data: map(existingCacheData.investigator_data, id => {
          if (id.investigator !== investigator) {
            return id;
          }
          return update(id);
        }),
      };
    }
  );
}

function emptyInvestigatorData(campaign_id: number, investigator: string): FullInvestigatorDataFragment {
  return {
    __typename: 'investigator_data',
    id: `${campaign_id}-${investigator}`,
    campaign_id,
    investigator,
    insane: null,
    killed: null,
    mental: null,
    physical: null,
    storyAssets: [],
    specialXp: {},
    addedCards: [],
    removedCards: [],
    ignoreStoryAssets: [],
    availableXp: 0,
    spentXp: 0,
  };
}


const handleUpdateInvestigatorData: MutationUpdaterFn<UpdateInvestigatorDataMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  handleUpdateInvestigatorTrauma(cache, { data });
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        ...investigator_data,
      };
    }
    return {
      ...investigator_data,
      spentXp: data.spentXp,
      specialXp: data.specialXp,
    };
  });
};

const handleUpdateSpentXp: MutationUpdaterFn<UpdateSpentXpMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        spentXp: investigator_data.spentXp || 0,
      };
    }
    return {
      ...data,
      ...investigator_data,
    };
  });
};

const handleUpdateAvailableXp: MutationUpdaterFn<UpdateAvailableXpMutation> = (cache, { data }) => {
  if (!data?.insert_investigator_data_one) {
    return;
  }
  const investigator_data = data.insert_investigator_data_one;
  updateFullInvestigatorData(cache, investigator_data.campaign_id, investigator_data.investigator, data => {
    if (!data) {
      return {
        ...emptyInvestigatorData(investigator_data.campaign_id, investigator_data.investigator),
        availableXp: investigator_data.availableXp || 0,
      };
    }
    return {
      ...data,
      ...investigator_data,
    };
  });
};

function updateGuideAchievement(
  cache: ApolloCache<unknown>,
  achievement: GuideAchievementFragment,
  insert: () => GuideAchievementFragment,
  update: (achievement: GuideAchievementFragment) => GuideAchievementFragment
) {
  const id = achievement.id;
  cache.writeFragment<GuideAchievementFragment>({
    fragment: GuideAchievementFragmentDoc,
    data: achievement,
  });
  updateFullCampaignGuide(
    cache,
    achievement.campaign_id,
    (existingCacheData: FullCampaignGuideStateFragment) => {
      const existingAchievement = find(existingCacheData.guide_achievements, a => a.id === id);
      if (!existingAchievement) {
        return {
          ...existingCacheData,
          guide_achievements: [
            ...existingCacheData.guide_achievements || [],
            insert(),
          ],
        };
      }
      return {
        ...existingCacheData,
        guide_achievements: [
          ...filter(existingCacheData.guide_achievements, a => a.id !== id),
          update(existingAchievement),
        ],
      };
    }
  );
}

const handleSetBinaryAchievement: MutationUpdaterFn<SetBinaryAchievementMutation> = (cache, { data }) => {
  if (!data?.insert_guide_achievement_one) {
    return;
  }
  const achievement = data.insert_guide_achievement_one;
  updateGuideAchievement(cache, achievement, () => achievement, () => achievement);
};

const handleIncCountAchievementMax: MutationUpdaterFn<IncCountAchievementMaxMutation> = (cache, { data, context }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  const max = context?.max || 0;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: Math.min(1, context?.max),
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: Math.min((a.value || 0) + 1, max),
    };
  });
};

const handleIncCountAchievement: MutationUpdaterFn<IncCountAchievementMutation> = (cache, { data }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: 1,
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: (a.value || 0) + 1,
    };
  });
};

const handleDecCountAchievement: MutationUpdaterFn<DecCountAchievementMutation> = (cache, { data }) => {
  if (!data?.update_guide_achievement || !data.update_guide_achievement.returning.length) {
    return;
  }
  const achievement = data.update_guide_achievement.returning[0];
  const id = achievement.id;
  updateGuideAchievement(cache, achievement, () => {
    return {
      __typename: 'guide_achievement',
      id,
      campaign_id: achievement.campaign_id,
      type: 'count',
      value: 0,
    };
  }, (a: GuideAchievementFragment) => {
    return {
      ...a,
      value: Math.max((a.value || 0) - 1, 0),
    };
  });
};

interface OptimisticUpdate {
  mutation: DocumentNode;
  update?: MutationUpdaterFn;
}

interface OptimisticUpdateByName {
  [name: string]: OptimisticUpdate | undefined;
}

export const optimisticUpdates = {
  addGuideInput: {
    mutation: AddGuideInputDocument,
    update: handleAddGuideInput,
  },
  removeGuideInputs: {
    mutation: RemoveGuideInputsDocument,
    update: handleRemoveGuideInputs,
  },
  addCampaignInvestigator: {
    mutation: AddCampaignInvestigatorDocument,
    update: handleAddCampaignInvestigator,
  },
  deleteInvestigatorDecks: {
    mutation: DeleteInvestigatorDecksDocument,
    update: handleDeleteInvestigatorDecks,
  },
  removeCampaignInvestigator: {
    mutation: RemoveCampaignInvestigatorDocument,
    update: handleRemoveCampaignInvestigator,
  },
  updateInvestigatorTrauma: {
    mutation: UpdateInvestigatorTraumaDocument,
    update: handleUpdateInvestigatorTrauma,
  },
  updateInvestigatorData: {
    mutation: UpdateInvestigatorDataDocument,
    update: handleUpdateInvestigatorData,
  },
  setBinaryAchievement: {
    mutation: SetBinaryAchievementDocument,
    update: handleSetBinaryAchievement,
  },
  incCountAchievementMax: {
    mutation: IncCountAchievementMaxDocument,
    update: handleIncCountAchievementMax,
  },
  incCountAchievement: {
    mutation: IncCountAchievementDocument,
    update: handleIncCountAchievement,
  },
  decCountAchievement: {
    mutation: DecCountAchievementDocument,
    update: handleDecCountAchievement,
  },
  updateSpentXp: {
    mutation: UpdateSpentXpDocument,
    update: handleUpdateSpentXp,
  },
  updateAvailableXp: {
    mutation: UpdateAvailableXpDocument,
    update: handleUpdateAvailableXp,
  },
  // These are all just 'set' operations, i.e. we want to track them but don't
  // need fancy speculative updates, the standard apollo Key-Value update will do.
  updateChaosBag: {
    mutation: UpdateChaosBagDocument,
  },
  updateWeaknessSet: {
    mutation: UpdateWeaknessSetDocument,
  },
  updateCampaignNotes: {
    mutation: UpdateCampaignNotesDocument,
  },
  updateCampaignScenarioResults: {
    mutation: UpdateCampaignScenarioResultsDocument,
  },
  updateCampaignShowInterludes: {
    mutation: UpdateCampaignShowInterludesDocument,
  },
  updateCampaignDifficulty: {
    mutation: UpdateCampaignDifficultyDocument,
  },
  updateCampaignGuideVersion: {
    mutation: UpdateCampaignGuideVersionDocument,
  },
  updateCampaignName: {
    mutation: UpdateCampaignNameDocument,
  },
  deleteAllLocalDecks: {
    mutation: DeleteAllLocalDecksDocument,
    update: handleDeleteAllLocalDecks,
  },
  deleteAllArkhamDbDecks: {
    mutation: DeleteAllArkhamDbDecksDocument,
    update: handleDeleteAllArkhamDbDecks,
  },
  deleteArkhamDbDeck: {
    mutation: DeleteArkhamDbDeckDocument,
    update: handleDeleteArkhamDbDeck,
  },
  deleteLocalDeck: {
    mutation: DeleteLocalDeckDocument,
    update: handleDeleteLocalDeck,
  },
  updateLocalDeck: {
    mutation: UpdateLocalDeckDocument,
  },
  updateArkhamDbDeck: {
    mutation: UpdateArkhamDbDeckDocument,
  },
  insertNewDeck: {
    mutation: InsertNewDeckDocument,
    update: handleInsertNewDeck,
  },
  insertNextLocalDeck: {
    mutation: InsertNextLocalDeckDocument,
    update: handleInsertNextLocalDeck,
  },
  insertNextArkhamDbDeck: {
    mutation: InsertNextArkhamDbDeckDocument,
    update: handleInsertNextArkhamDbDeck,
  },
};

export const genericOptimisticUpdates: OptimisticUpdateByName = optimisticUpdates;