import { useContext, useMemo, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { flatMap, concat, omit, sortBy } from 'lodash';

import { AppState, getCampaigns, makeCampaignGuideStateSelector, makeCampaignSelector, makeLatestDecksSelector } from '@reducers';
import { CampaignGuideState, CampaignId, getCampaignLastUpdated, SingleCampaign } from '@actions/types';
import { useGetMyCampaignsLazyQuery, MiniCampaignFragment, useCampaignSubscription, useGetProfileQuery } from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './api';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { MiniLinkedCampaignRemote, MiniCampaignRemote } from './types';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { SingleCampaignRedux } from '@data/local/types';
import { SingleCampaignRemote } from '@data/remote/types';
import Card, { CardsMap } from '@data/types/Card';

function useRemoteCampaigns(): [MiniCampaignT[], boolean, () => void] {
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
  console.log(JSON.stringify(rawCampaigns));
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

export function useCampaigns(): [MiniCampaignT[], boolean, undefined | (() => void)] {
  const campaigns = useSelector(getCampaigns);
  const [serverCampaigns, loading, refresh] = useRemoteCampaigns();

  const allCampaigns = useMemo(() => {
    return sortBy(
      concat(
        campaigns,
        serverCampaigns
      ),
      c => -c.updatedAt().getTime());
  }, [campaigns, serverCampaigns]);
  return [allCampaigns, loading, refresh];
}

export function useLiveCampaign(campaignId?: CampaignId, investigators?: CardsMap): [SingleCampaignT | undefined, Card[]] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const getCampaign = useMemo(makeCampaignSelector, []);
  const reduxCampaign = useSelector((state: AppState) => campaignId ? getCampaign(state, campaignId.campaignId) : undefined);
  const getLatestCampaignDecks = useMemo(makeLatestDecksSelector, []);
  const latestDecks = useSelector((state: AppState) => getLatestCampaignDecks(state, reduxCampaign));

  const { data } = useCampaignSubscription({
    variables: { campaign_id: campaignId?.serverId || 0 },
    skip: (!user || !campaignId?.serverId),
  });
  const campaign = useMemo(() => {
    if (!campaignId) {
      return undefined;
    }
    if (!campaignId?.serverId) {
      return reduxCampaign ? new SingleCampaignRedux(reduxCampaign, latestDecks, getCampaignLastUpdated(reduxCampaign)) : undefined;
    }
    if (data?.campaign_by_pk) {
      return new SingleCampaignRemote(data.campaign_by_pk)
    }
  }, [campaignId, reduxCampaign, data, latestDecks]);

  const allInvestigators = useMemo(() => {
    if (!campaign || !investigators) {
      return [];
    }
    return flatMap(campaign.investigators(), i => investigators[i] || []);
  }, [campaign, investigators]);

  return [campaign, allInvestigators];
}


export function useCampaign(campaignId?: CampaignId): SingleCampaign | undefined {
  const getCampaign = useMemo(makeCampaignSelector, []);
  const reduxCampaign = useSelector((state: AppState) => campaignId ? getCampaign(state, campaignId.campaignId) : undefined);
  return reduxCampaign;
}

export function useCampaignGuideState(campaignId?: CampaignId): CampaignGuideState | undefined {
  const campaignGuideStateSelector = useMemo(makeCampaignGuideStateSelector, []);
  const reduxCampaignGuideState = useSelector((state: AppState) => campaignId ? campaignGuideStateSelector(state, campaignId.campaignId) : undefined);
  return reduxCampaignGuideState;
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
