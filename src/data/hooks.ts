import { useContext, useMemo, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { flatMap, filter, map, sortBy } from 'lodash';

import { AppState, getCampaigns, makeCampaignGuideStateSelector, makeCampaignSelector } from '@reducers';
import { Campaign, CampaignGuideState, CampaignId, SingleCampaign } from '@actions/types';
import { useGetProfileLazyQuery, GetProfileDocument } from './graphql/schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './firebase/types';

export function useCampaigns(): [Campaign[], boolean, undefined | (() => void)] {
  const campaigns = useSelector(getCampaigns);
  // const [serverCampaigns, loading, refresh] = useMyCampaigns();

  const allCampaigns = useMemo(() => {
    return map(sortBy(
      // concat(
      filter(campaigns, c => !c.campaign.serverId),
      //  serverCampaigns
      // ),
      c => c.sort), c => c.campaign);
  }, [campaigns]);
  return [allCampaigns, false, undefined];
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
  const [loadProfile, { data, loading: dataLoading, refetch }] = useGetProfileLazyQuery({
    variables: { userId: userId || '' },
    fetchPolicy: useCached ? 'cache-only' : 'cache-and-network',
  });
  useEffect(() => {
    if (user && userId) {
      loadProfile();
    }
  }, [user, userId, loadProfile]);

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
