import { useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { flatMap, find, map, omit } from 'lodash';

import { CampaignId, DeckId, UploadedCampaignId } from '@actions/types';
import {
  MiniCampaignFragment,
  useGetMyCampaignsLazyQuery,
  useGetProfileQuery,
  useGetCampaignQuery,
  useGetMyDecksLazyQuery,
  useGetCampaignGuideQuery,
  useGetCampaignAccessQuery,
  CampaignGuideDocument,
  CampaignAccessDocument,
  CampaignDocument,
  LatestDeckFragmentDoc,
  LatestDeckFragment,
} from '@generated/graphql/apollo-schema';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { FriendStatus } from './api';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { MiniLinkedCampaignRemote, MiniCampaignRemote, LatestDeckRemote, MiniDeckRemote, CampaignGuideStateRemote } from './types';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { SingleCampaignRemote } from '@data/remote/types';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useDispatch } from 'react-redux';
import { setServerDecks } from '@components/deck/actions';
import { DeckActions } from './decks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';
import { useApolloClient } from '@apollo/client';


export function useRemoteCampaigns(): [MiniCampaignT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const [loadMyCampaigns, { data, loading: dataLoading, refetch }] = useGetMyCampaignsLazyQuery({
    variables: { userId: user?.uid || '' },
    fetchPolicy: 'cache-first',
    returnPartialData: true,
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

export function useCampaignGuideStateRemote(campaignId: CampaignId | undefined, live?: boolean): CampaignGuideStateT | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const { data, subscribeToMore } = useGetCampaignGuideQuery({
    variables: { campaign_id: campaignId?.serverId || 0 },
    fetchPolicy: live ? 'cache-first' : 'cache-only',
    skip: (!user || !campaignId?.serverId),
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
    returnPartialData: true,
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


export interface CampaignAccess {
  owner: SimpleUser;
  access: SimpleUser[];
}

export function useCampaignAccess(campaignId: UploadedCampaignId): CampaignAccess | undefined {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [profile] = useMyProfile();
  const { data, subscribeToMore } = useGetCampaignAccessQuery({
    variables: { campaign_id: campaignId.serverId },
    fetchPolicy: 'cache-first',
    skip: (!user || !campaignId.serverId),
    returnPartialData: true,
  });
  useEffect(() => {
    if (user && subscribeToMore) {
      return subscribeToMore({
        document: CampaignAccessDocument,
        variables: { campaign_id: campaignId.serverId },
      });
    }
  }, [user, campaignId, subscribeToMore]);

  const getFriendStatus = useCallback((id: string): FriendStatus => {
    if (profile) {
      if (find(profile.friends, f => f.id === id)) {
        return FriendStatus.FRIEND;
      }
      if (find(profile.sentRequests, f => f.id === id)) {
        return FriendStatus.SENT;
      }
      if (find(profile.receivedRequests, f => f.id === id)) {
        return FriendStatus.RECEIVED;
      }
    }
    return FriendStatus.NONE;
  }, [profile]);

  return useMemo(() => {
    if (!data?.campaign_by_pk) {
      return undefined;
    }
    const owner: SimpleUser = {
      id: data.campaign_by_pk.owner.id,
      handle: data.campaign_by_pk.owner.handle || undefined,
      status: getFriendStatus(data.campaign_by_pk.owner.id),
    };
    return {
      owner,
      access: map(data.campaign_by_pk.access, u => {
        return {
          id: u.user.id,
          handle: u.user.handle || undefined,
          status: getFriendStatus(u.user.id),
        };
      }),
    };
  }, [data, getFriendStatus]);
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

export function useMyDecksRemote(actions: DeckActions): [MiniDeckT[], boolean, () => void] {
  const { user, loading: userLoading } = useContext(ArkhamCardsAuthContext);
  const dispatch = useDispatch();
  const checkForSync = useRef(false);
  const [loadMyDecks, { data, loading: dataLoading, refetch }] = useGetMyDecksLazyQuery({
    variables: { userId: user?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    if (user) {
      loadMyDecks();
    }
  }, [user, loadMyDecks]);
  const allDecks = data?.users_by_pk?.all_decks;
  useEffect(() => {
    if (allDecks) {
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
      dispatch(setServerDecks(uploadDecks, actions, checkForSync.current));
      checkForSync.current = false;
    }
  }, [allDecks, actions, dispatch])

  const refresh = useCallback(() => {
    if (user && refetch) {
      checkForSync.current = true;
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
  return [deckIds, userLoading || dataLoading, refresh];
}

export function useLatestDeckRemote(deckId: DeckId, campaign_id: number | undefined): LatestDeckT | undefined {
  const { cache } = useApolloClient();
  const currentDeck = cache.readFragment<LatestDeckFragment>({
    fragment: LatestDeckFragmentDoc,
    fragmentName: 'LatestDeck',
    id: cache.identify({
      __typename: 'campaign_deck',
      campaign_id: campaign_id || 0,
      local_uuid: deckId.local ? deckId.uuid : null,
      arkhamdb_id: deckId.local ? null : deckId.id,
    }),
  });

  return useMemo(() => {
    if (!campaign_id || !deckId.serverId) {
      return undefined;
    }
    return currentDeck ? new LatestDeckRemote(currentDeck) : undefined;
  }, [campaign_id, deckId, currentDeck]);
}