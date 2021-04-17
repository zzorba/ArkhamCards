import { useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { flatMap, forEach, map, omit } from 'lodash';

import { CampaignId, DeckId, UploadedCampaignId } from '@actions/types';
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


export function useRemoteCampaigns(): [MiniCampaignT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { data, loading: dataLoading, refetch } = useGetMyCampaignsQuery({
    variables: {
      userId: user?.uid || '',
    },
    skip: !user,
    fetchPolicy: 'cache-and-network',
    returnPartialData: false,
  });

  const refresh = useCallback(() => {
    if (user && refetch) {
      refetch({ userId: user?.uid || '' });
    }
  }, [refetch, user]);
  const rawCampaigns = data?.users_by_pk?.campaigns;
  const campaigns = useMemo(() => {
    if (!rawCampaigns || !user) {
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
  }, [rawCampaigns, user]);
  return [campaigns, userLoading || dataLoading, refresh];
}

export function useCampaignGuideStateRemote(campaignId: CampaignId | undefined, live?: boolean): CampaignGuideStateT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignGuideQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: live ? 'cache-first' : 'cache-only',
    skip: (!user || !campaignId?.serverId),
    returnPartialData: false,
  });

  useEffect(() => {
    if (live && user && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: CampaignGuideDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [live, user, campaignId, subscribeToMore]);

  return useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_guide.length) {
      return new CampaignGuideStateRemote(data.campaign_guide[0]);
    }
    return undefined;
  }, [data, campaignId]);
}

export function useCampaignRemote(campaignId: CampaignId | undefined, live?: boolean): SingleCampaignT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: live ? 'cache-first' : 'cache-only',
    skip: (!user || !campaignId?.serverId),
    returnPartialData: false,
  });
  useEffect(() => {
    if (live && user && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: CampaignDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [user, campaignId, live, subscribeToMore]);


  return useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_by_pk) {
      return new SingleCampaignRemote(data.campaign_by_pk);
    }
    return undefined;
  }, [data, campaignId]);
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

  return useMemo(() => {
    if (!id || !campaignId?.serverId) {
      return undefined;
    }
    const data = id.local ? localData : arkhamDbData;
    if (!data?.campaign_deck?.length) {
      return undefined;
    }
    return new LatestDeckRemote(data.campaign_deck[0]);
  }, [localData, arkhamDbData, id, campaignId]);
}

export function useChaosBagResultsFromRemote(campaignId: CampaignId): ChaosBagResultsT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetChaosBagResultsQuery({
    variables: {
      campaign_id: campaignId.serverId || 0,
    },
    fetchPolicy: 'cache-first',
    skip: !campaignId.serverId,
  });

  useEffect(() => {
    if (user && campaignId?.serverId && subscribeToMore) {
      return subscribeToMore({
        document: ChaosBagResultsDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [user, campaignId, subscribeToMore]);
  return useMemo(() => {
    if (!campaignId.serverId || !data?.chaos_bag_result_by_pk) {
      return undefined;
    }
    return new ChaosBagResultsRemote(data.chaos_bag_result_by_pk);
  }, [campaignId, data]);
}

export function useDeckFromRemote(id: DeckId | undefined, fetch: boolean): LatestDeckT | undefined {
  const { data } = useGetLatestDeckQuery({
    variables: {
      deckId: id?.serverId || 0,
    },
    fetchPolicy: fetch ? 'cache-and-network' : 'cache-only',
    skip: !id?.serverId,
  });

  return useMemo(() => {
    if (!id?.serverId || !data?.campaign_deck_by_pk) {
      return undefined;
    }
    return new LatestDeckRemote(data.campaign_deck_by_pk);
  }, [data, id]);
}

export interface CampaignAccess {
  owner: SimpleUser;
  access: SimpleUser[];
}
export function useCampaignAccess(campaignId: UploadedCampaignId): CampaignAccess | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignAccessQuery({
    variables: { campaign_id: campaignId.serverId },
    fetchPolicy: 'cache-first',
    skip: (!user || !campaignId.serverId),
    returnPartialData: false,
  });
  useEffect(() => {
    if (user && subscribeToMore) {
      return subscribeToMore({
        document: CampaignAccessDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [user, campaignId, subscribeToMore]);

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
}

export function useProfile(userId: string | undefined, useCached?: boolean): [UserProfile | undefined, boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const { data, loading: dataLoading, refetch } = useGetProfileQuery({
    variables: { userId: userId || '' },
    skip: !user || !userId,
    fetchPolicy: useCached ? 'cache-only' : 'cache-and-network',
  });

  const profile = useMemo(() => {
    if (!data?.users_by_pk) {
      return undefined;
    }
    return {
      id: data.users_by_pk.id,
      handle: data.users_by_pk.handle || undefined,
      friends: flatMap(data.users_by_pk.friends, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.FRIEND,
        };
      }),
      sentRequests: flatMap(data.users_by_pk.sent_requests, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.SENT,
        };
      }),
      receivedRequests: flatMap(data.users_by_pk.received_requests, f => {
        if (!f.user) {
          return [];
        }
        return {
          id: f.user.id,
          handle: f.user.handle || undefined,
          status: FriendStatus.RECEIVED,
        };
      }),
    };
  }, [data]);
  const doRefetch = useCallback(() => {
    refetch?.({ userId });
  }, [refetch, userId]);
  return [profile, userLoading || dataLoading, doRefetch];
}

export function useMyProfile(useCached?: boolean): [UserProfile | undefined, boolean, () => void] {
  const { user } = useContext(ArkhamCardsAuthContext);
  return useProfile(user?.uid, useCached);
}

export function useMyDecksRemote(actions: DeckActions): [MiniDeckT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const checkForSync = useRef(false);
  const { data, loading: dataLoading, refetch } = useGetMyDecksQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: user?.uid || '',
    },
    skip: !user,
    returnPartialData: false,
  });
  const allDecks = data?.users_by_pk?.all_decks;
  useEffect(() => {
    if (allDecks && !checkForSync.current) {
      const uploadDecks = map(allDecks, i => {
        const deckId: DeckId = i.arkhamdb_id ? {
          id: i.arkhamdb_id,
          local: false,
          uuid: `${i.arkhamdb_id}`,
          serverId: i.id || undefined,
        } : {
          id: undefined,
          local: true,
          uuid: i.local_uuid || '',
          serverId: i.id || undefined,
        };
        return {
          deckId,
          hash: i.content_hash || '',
          campaignId: {
            campaignId: i.campaign.uuid,
            serverId: i.campaign.id,
          },
        };
      });
      // console.log(`Syncing AllDecks: ${JSON.stringify(map(allDecks, d => `${d.id} - ${d.investigator}`))}`);
      dispatch(setServerDecks(uploadDecks, actions, checkForSync.current));
      checkForSync.current = true;
    }
    // console.log(`AllDecks changed: ${JSON.stringify(map(allDecks, d => `${d.id} - ${d.investigator}`))}`);
  }, [allDecks, actions, dispatch])

  const refresh = useCallback(() => {
    if (user && refetch) {
      checkForSync.current = false;
      refetch({ userId: user.uid });
    }
  }, [refetch, user]);
  const rawDecks = data?.users_by_pk?.decks;
  const deckIds = useMemo(() => {
    if (!rawDecks) {
      return [];
    }
    return flatMap(rawDecks, ({ deck }) => {
      if (!deck) {
        return [];
      }
      return new MiniDeckRemote(deck);
    });
  }, [rawDecks]);
  return [deckIds, !!(user && !data) || userLoading || dataLoading, refresh];
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
  });

  return useMemo(() => {
    if (!campaign_id?.serverId || !deckId.serverId) {
      return undefined;
    }
    return currentDeck ? new LatestDeckRemote(currentDeck) : undefined;
  }, [campaign_id, deckId, currentDeck]);
}

export function useDeckHistoryRemote(id: DeckId, investigator: string, campaign: MiniCampaignT | undefined): LatestDeckT[] | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data } = useGetDeckHistoryQuery({
    variables: {
      user_id: user?.uid || '',
      campaign_id: campaign?.id.serverId || 0,
      investigator,
    },
    skip: !user?.uid || !campaign || !campaign?.id.serverId,
  });

  return useMemo(() => {
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
}