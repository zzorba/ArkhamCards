import { useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { flatMap, forEach, map, omit } from 'lodash';

import { useDebounce } from 'use-debounce';
import { CampaignId, DeckId, UploadedCampaignId, GroupedUploadedDecks } from '@actions/types';
import {
  MiniCampaignFragment,
  useGetProfileQuery,
  useGetCampaignQuery,
  useGetCampaignGuideQuery,
  useGetCampaignAccessQuery,
  CampaignGuideDocument,
  CampaignAccessDocument,
  CampaignDocument,
  LatestDeckFragmentDoc,
  LatestDeckFragment,
  useGetLatestDeckQuery,
  useGetLatestLocalDeckQuery,
  useGetLatestArkhamDbDeckQuery,
  useGetChaosBagResultsQuery,
  ChaosBagResultsDocument,
  useGetMyDecksQuery,
  useGetMyCampaignsQuery,
  useGetDeckHistoryQuery,
  HistoryDeckFragment,
  AllDeckFragment,
  User_Flag_Type_Enum,
} from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './api';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { MiniLinkedCampaignRemote, MiniCampaignRemote, LatestDeckRemote, MiniDeckRemote, CampaignGuideStateRemote, ChaosBagResultsRemote } from './types';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { SingleCampaignRemote } from '@data/remote/types';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useDispatch } from 'react-redux';
import { setServerDecks } from '@components/deck/actions';
import { DeckActions } from './decks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import { useApolloClient } from '@apollo/client';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';

function useCachedValue<T>(value: T | undefined): T | undefined {
  const ref = useRef<T | undefined>(value);
  const result = value || ref.current;
  ref.current = result;
  return result;
}

export function useRemoteCampaigns(): [MiniCampaignT[], boolean, () => void] {
  const { userId, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { data, loading: dataLoading, refetch } = useGetMyCampaignsQuery({
    variables: {
      userId: userId || '',
    },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    returnPartialData: false,
  });
  const refresh = useCallback(() => {
    if (userId && refetch) {
      refetch({ userId });
    }
  }, [refetch, userId]);
  const rawCampaigns = data?.users_by_pk?.campaigns;
  const campaigns = useMemo(() => {
    if (!rawCampaigns || !userId) {
      return [];
    }
    return flatMap(rawCampaigns, ({ campaign }) => {
      if (!campaign) {
        return [];
      }
      if (campaign.link_a_campaign && campaign.link_b_campaign) {
        return new MiniLinkedCampaignRemote(
          omit(campaign, ['link_a_campaign', 'link_b_campaign']) as MiniCampaignFragment,
          campaign.link_a_campaign,
          campaign.link_b_campaign
        );
      }
      return new MiniCampaignRemote(campaign);
    });
  }, [rawCampaigns, userId]);
  return [campaigns, (userId ? (userLoading || dataLoading) : false), refresh];
}

export function useCampaignGuideStateRemote(campaignId: CampaignId | undefined, live?: boolean): CampaignGuideStateT | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignGuideQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: live ? 'cache-first' : 'cache-only',
    skip: (!userId || !campaignId?.serverId),
    returnPartialData: false,
  });

  useEffect(() => {
    if (live && userId && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: CampaignGuideDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [live, userId, campaignId, subscribeToMore]);
  const result = useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_guide.length) {
      return new CampaignGuideStateRemote(data.campaign_guide[0]);
    }
    return undefined;
  }, [data, campaignId]);
  return useCachedValue(result);
}

export function useCampaignRemote(campaignId: CampaignId | undefined, live?: boolean): SingleCampaignT | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: live ? 'cache-first' : 'cache-only',
    skip: (!userId || !campaignId?.serverId),
    returnPartialData: false,
  });
  useEffect(() => {
    if (live && userId && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: CampaignDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [userId, campaignId, live, subscribeToMore]);


  const result = useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_by_pk) {
      return new SingleCampaignRemote(data.campaign_by_pk);
    }
    return undefined;
  }, [data, campaignId]);
  return useCachedValue(result);
}


export function useCampaignDeckFromRemote(id: DeckId | undefined, campaignId: CampaignId | undefined): LatestDeckT | undefined {
  const { data: localData } = useGetLatestLocalDeckQuery({
    variables: {
      campaign_id: campaignId?.serverId || 0,
      local_uuid: id?.local ? id.uuid : '',
    },
    fetchPolicy: 'cache-and-network',
    skip: !campaignId?.serverId || !id?.local,
  });
  const { data: arkhamDbData } = useGetLatestArkhamDbDeckQuery({
    variables: {
      campaign_id: campaignId?.serverId || 0,
      arkhamdb_id: (id && !id.local) ? id.id : 0,
    },
    fetchPolicy: 'cache-and-network',
    skip: !campaignId?.serverId || !!(id && !id.local),
  });

  const result = useMemo(() => {
    if (!id || !campaignId?.serverId) {
      return undefined;
    }
    const data = id.local ? localData : arkhamDbData;
    if (!data?.campaign_deck?.length) {
      return undefined;
    }
    return new LatestDeckRemote(data.campaign_deck[0]);
  }, [localData, arkhamDbData, id, campaignId]);
  return useCachedValue(result);
}

export function useChaosBagResultsFromRemote(campaignId: CampaignId): ChaosBagResultsT | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetChaosBagResultsQuery({
    variables: {
      campaign_id: campaignId.serverId || 0,
    },
    fetchPolicy: 'cache-first',
    skip: !campaignId.serverId,
  });

  useEffect(() => {
    if (userId && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: ChaosBagResultsDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [userId, campaignId, subscribeToMore]);
  const result = useMemo(() => {
    if (!campaignId.serverId || !data?.chaos_bag_result_by_pk) {
      return undefined;
    }
    return new ChaosBagResultsRemote(data.chaos_bag_result_by_pk);
  }, [campaignId, data]);
  return useCachedValue(result);
}

export function useDeckFromRemote(id: DeckId | undefined, fetch: boolean): LatestDeckT | undefined {
  const { data } = useGetLatestDeckQuery({
    variables: {
      deckId: id?.serverId || 0,
    },
    // Negative indicates a local deck, so no point fetching it from remote as it DOES NOT EXIST yet.
    fetchPolicy: (fetch && id?.serverId && id.serverId >= 0) ? 'cache-and-network' : 'cache-only',
    skip: !id?.serverId,
  });

  const result = useMemo(() => {
    if (!id?.serverId || !data?.campaign_deck_by_pk) {
      return undefined;
    }
    return new LatestDeckRemote(data.campaign_deck_by_pk);
  }, [data, id]);
  return useCachedValue(result);
}

export interface CampaignAccess {
  owner: SimpleUser;
  access: SimpleUser[];
}
export function useCampaignAccess(campaignId: UploadedCampaignId): CampaignAccess | undefined {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignAccessQuery({
    variables: { campaign_id: campaignId.serverId },
    fetchPolicy: 'cache-first',
    skip: (!userId || !campaignId.serverId),
    returnPartialData: false,
  });
  useEffect(() => {
    if (userId && subscribeToMore) {
      return subscribeToMore({
        document: CampaignAccessDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [userId, campaignId, subscribeToMore]);

  return useMemo(() => {
    if (!data?.campaign_by_pk) {
      return undefined;
    }
    const owner: SimpleUser = {
      id: data.campaign_by_pk.owner.id,
      handle: data.campaign_by_pk.owner.handle || undefined,
    };
    return {
      owner,
      access: map(data.campaign_by_pk.access, u => {
        return {
          id: u.user.id,
          handle: u.user.handle || undefined,
        };
      }),
    };
  }, [data]);
}


export interface SimpleUser {
  id: string;
  handle?: string;
  // status: FriendStatus;
}

export interface UserProfile {
  id: string;
  handle?: string;
  friends: SimpleUser[];
  sentRequests: SimpleUser[];
  receivedRequests: SimpleUser[];
  flags: User_Flag_Type_Enum[];
}

export function useProfile(profileUserId: string | undefined, useCached?: boolean): [UserProfile | undefined, boolean, () => Promise<void>] {
  const { userId, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { data, previousData, loading: dataLoading, refetch } = useGetProfileQuery({
    variables: { userId: profileUserId || '' },
    skip: !userId || !profileUserId,
    fetchPolicy: useCached ? 'cache-only' : 'cache-and-network',
  });

  const profile = useMemo(() => {
    const theData = data || previousData;
    if (!theData?.users_by_pk) {
      return undefined;
    }
    return {
      id: theData.users_by_pk.id,
      handle: theData.users_by_pk.handle || undefined,
      friends: flatMap(theData.users_by_pk.friends, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.FRIEND,
        };
      }),
      sentRequests: flatMap(theData.users_by_pk.sent_requests, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.SENT,
        };
      }),
      receivedRequests: flatMap(theData.users_by_pk.received_requests, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.RECEIVED,
        };
      }),
      flags: map(theData.users_by_pk.flags, f => f.flag),
    };
  }, [data, previousData]);
  const doRefetch = useCallback(async() => {
    await refetch?.({
      userId: profileUserId,
    });
  }, [refetch, profileUserId]);
  return [profile, userLoading || dataLoading, doRefetch];
}

export function useMyProfile(useCached: boolean): [UserProfile | undefined, boolean, () => Promise<void>] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  return useProfile(userId, useCached);
}

function parseAllDeck(allDecks: AllDeckFragment[]): GroupedUploadedDecks {
  const deckIds = map(allDecks, i => {
    const deckId: DeckId = i.arkhamdb_id && i.arkhamdb_user ? {
      id: i.arkhamdb_id,
      arkhamdb_user: i.arkhamdb_user,
      local: false,
      uuid: `${i.arkhamdb_id}`,
      serverId: i.id,
    } : {
      id: undefined,
      arkhamdb_user: undefined,
      local: true,
      uuid: i.local_uuid || '',
      serverId: i.id,
    };
    const nextDeckId: DeckId | undefined = i.next_deck && (i.arkhamdb_user && i.next_deck.arkhamdb_id ? {
      id: i.next_deck.arkhamdb_id,
      arkhamdb_user: i.arkhamdb_user,
      local: false,
      uuid: `${i.next_deck.arkhamdb_id}`,
      serverId: i.next_deck.id,
    } : {
      id: undefined,
      arkhamdb_user: undefined,
      local: true,
      uuid: i.next_deck.local_uuid || '',
      serverId: i.next_deck.id,
    }) || undefined;
    return {
      deckId,
      nextDeckId,
      hash: i.content_hash || '',
      campaignId: {
        campaignId: i.campaign.uuid,
        serverId: i.campaign.id,
      },
    };
  });
  const uploadedDecks: GroupedUploadedDecks = {};
  forEach(deckIds, deck => {
    const existing = uploadedDecks[deck.deckId.uuid];
    uploadedDecks[deck.deckId.uuid] = existing ? {
      deckId: deck.deckId,
      nextDeckId: deck.nextDeckId,
      hash: deck.hash || '',
      campaignId: [...existing.campaignId, deck.campaignId],
    } : {
      deckId: deck.deckId,
      nextDeckId: deck.nextDeckId,
      hash: deck.hash || '',
      campaignId: [deck.campaignId],
    };
  });
  return uploadedDecks;
}

export function useMyDecksRemote(actions: DeckActions): [MiniDeckT[], boolean, () => Promise<GroupedUploadedDecks>] {
  const { userId, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const checkForSync = useRef(false);
  const { data, loading: dataLoading, refetch } = useGetMyDecksQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: userId || '',
    },
    skip: !userId,
    returnPartialData: false,
  });
  const allDecks = data?.users_by_pk?.all_decks;
  useEffect(() => {
    if (allDecks && !checkForSync.current) {
      const uploadDecks = parseAllDeck(allDecks);
      dispatch(setServerDecks(uploadDecks));
      checkForSync.current = true;
    }
  }, [allDecks, actions, dispatch])

  const refresh = useCallback(async(): Promise<GroupedUploadedDecks> => {
    if (userId && refetch) {
      checkForSync.current = false;
      const result = await refetch({ userId });
      if (!result) {
        throw new Error('Could not fetch decks.');
      }
      if (result.error) {
        throw new Error(result.error.message);
      }
      const allDecks = result.data?.users_by_pk?.all_decks;
      if (!allDecks) {
        return {};
      }
      return parseAllDeck(allDecks);
    }
    return {};
  }, [refetch, userId]);
  const rawDecks = data?.users_by_pk?.decks;
  const deckIds = useMemo(() => {
    if (!userId || !rawDecks) {
      return [];
    }
    const result = flatMap(rawDecks, ({ deck }) => {
      if (!deck) {
        return [];
      }
      return new MiniDeckRemote(deck);
    });
    return result;
  }, [userId, rawDecks]);
  const [loading] = useDebounce(!!(userId && !data) || userLoading || dataLoading, 200);
  return [deckIds, loading, refresh];
}

export function useLatestDeckRemote(deckId: DeckId, campaign_id: CampaignId | undefined): LatestDeckT | undefined {
  const { cache } = useApolloClient();
  const currentDeck = cache.readFragment<LatestDeckFragment>({
    fragment: LatestDeckFragmentDoc,
    fragmentName: 'LatestDeck',
    id: cache.identify({
      __typename: 'campaign_deck',
      campaign_id: campaign_id?.serverId || 0,
      local_uuid: deckId.local ? deckId.uuid : null,
      arkhamdb_id: deckId.local ? null : deckId.id,
    }),
  }, true);

  const result = useMemo(() => {
    if (!campaign_id?.serverId || !deckId.serverId) {
      return undefined;
    }
    return currentDeck ? new LatestDeckRemote(currentDeck) : undefined;
  }, [campaign_id, deckId, currentDeck]);
  return useCachedValue(result);
}

export function useDeckHistoryRemote(id: DeckId, investigator: string, campaign: MiniCampaignT | undefined): [LatestDeckT[] | undefined, boolean, () => Promise<void>] {
  const { userId, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { data, loading: dataLoading, refetch } = useGetDeckHistoryQuery({
    variables: {
      campaign_id: campaign?.id.serverId || 0,
      investigator,
    },
    fetchPolicy: 'cache-and-network',
    skip: !userId || !campaign || !campaign?.id.serverId,
  });

  const refresh = useCallback(async() => {
    if (campaign?.id.serverId && userId) {
      await refetch({
        campaign_id: campaign.id.serverId,
        investigator,
      });
    }
  }, [refetch, investigator, userId, campaign]);

  const result = useMemo(() => {
    if (!id.serverId || !campaign?.id.serverId || !data?.campaign_deck.length) {
      return undefined;
    }
    const decksById: {
      [id: string]: HistoryDeckFragment;
    } = {};
    forEach(data.campaign_deck, d => {
      decksById[d.id] = d;
    });
    const latestDecks: LatestDeckT[] = [];
    let deck: HistoryDeckFragment | undefined = decksById[id.serverId];
    while (deck) {
      const previousDeck: HistoryDeckFragment | undefined = (deck.previous_deck && decksById[deck.previous_deck.id]) || undefined;
      latestDecks.push(new LatestDeckRemote({
        __typename: 'campaign_deck',
        ...deck,
        previous_deck: previousDeck,
        campaign: {
          __typename: 'campaign',
          id: campaign.id.serverId,
          uuid: campaign.id.campaignId,
          name: campaign.name,
        },
      }));
      deck = previousDeck;
    }
    return latestDecks;
  }, [campaign, id, data]);
  const [loading] = useDebounce(!!(userId && !data) || userLoading || dataLoading, 200);
  return [result, loading, refresh];
}