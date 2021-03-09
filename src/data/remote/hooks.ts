import { useContext, useMemo, useEffect, useCallback } from 'react';
import { flatMap, omit } from 'lodash';

import { CampaignId, DeckId } from '@actions/types';
import { useGetMyCampaignsLazyQuery, MiniCampaignFragment, useCampaignSubscription, useGetProfileQuery, useCampaignGuideSubscription, useGetCampaignQuery, useGetCampaignGuideQuery, useGetMyDecksLazyQuery } from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './api';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { MiniLinkedCampaignRemote, MiniCampaignRemote, CampaignGuideStateRemote, LatestDeckRemote, fragmentToDeckId, MiniDeckRemote } from './types';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { SingleCampaignRemote } from '@data/remote/types';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import { MyDecksState } from '@reducers';
import MiniDeckT from '@data/interfaces/MiniDeckT';

export function useRemoteCampaigns(): [MiniCampaignT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const [loadMyCampaigns, { data, loading: dataLoading, refetch }] = useGetMyCampaignsLazyQuery({
    variables: { userId: user?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (user) {
      loadMyCampaigns();
    }
  }, [user, loadMyCampaigns]);

  const refresh = useCallback(() => {
    refetch?.({ userId: user?.uid || '' });
  }, [refetch, user]);
  const rawCampaigns = data?.users_by_pk?.campaigns;
  const campaigns = useMemo(() => {
    if (!rawCampaigns) {
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
  }, [rawCampaigns]);
  return [campaigns, userLoading || dataLoading, refresh];
}

export function useLiveCampaignGuideStateRemote(campaignId: CampaignId | undefined): CampaignGuideStateT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data } = useCampaignGuideSubscription({
    variables: { campaign_id: campaignId?.serverId || 0 },
    skip: (!user || !campaignId?.serverId),
  });

  return useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_by_pk) {
      return new CampaignGuideStateRemote(data.campaign_by_pk);
    }
    return undefined;
  }, [data, campaignId]);
}


export function useCachedCampaignGuideStateRemote(campaignId: CampaignId | undefined): CampaignGuideStateT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data } = useGetCampaignGuideQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: 'cache-only',
    skip: (!user || !campaignId?.serverId),
  });

  return useMemo(() => {
    if (!campaignId || !campaignId.serverId) {
      return undefined;
    }
    if (data?.campaign_by_pk) {
      return new CampaignGuideStateRemote(data.campaign_by_pk);
    }
    return undefined;
  }, [data, campaignId]);
}

export function useLiveCampaignRemote(campaignId: CampaignId | undefined): SingleCampaignT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data } = useCampaignSubscription({
    variables: { campaign_id: campaignId?.serverId || 0 },
    skip: (!user || !campaignId?.serverId),
  });

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

export function useCachedCampaignRemote(campaignId: CampaignId | undefined): SingleCampaignT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data } = useGetCampaignQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: 'cache-only',
    skip: (!user || !campaignId?.serverId),
  });
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


export interface SimpleUser {
  id: string;
  handle?: string;
  status: FriendStatus;
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

export function useMyDecksRemote(): [MiniDeckT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const [loadMyDecks, { data, loading: dataLoading, refetch }] = useGetMyDecksLazyQuery({
    variables: { userId: user?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (user) {
      loadMyDecks();
    }
  }, [user, loadMyDecks]);

  const refresh = useCallback(() => {
    refetch?.({ userId: user?.uid || '' });
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
  return [deckIds, userLoading || dataLoading, refresh];
}