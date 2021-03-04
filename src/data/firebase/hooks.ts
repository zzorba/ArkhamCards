import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import functions from '@react-native-firebase/functions';
import { useObjectVal } from 'react-firebase-hooks/database';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { filter, find, flatMap, forEach, map, keys, values, sortBy } from 'lodash';

import { ArkhamCardsProfile, ArkhamCardsUserCampaigns, FriendStatus, UploadedCampaign, UploadedCampaignGuideState } from './types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import fbdb from './fbdb';
import { Campaign, CampaignGuideState, CampaignId, getCampaignLastUpdated, getLastUpdated, SingleCampaign } from '@actions/types';
import { useCounter } from '@components/core/hooks';
import { processCampaign } from '@reducers';

export interface ErrorResponse {
  error?: string;
}

export interface EmptyRequest {}

export function useFunction<RequestT=EmptyRequest, ResponseT=ErrorResponse>(functionName: string) {
  const { lang } = useContext(LanguageContext);
  return useCallback(async(request: RequestT): Promise<ResponseT> => {
    const response = await functions().httpsCallable(functionName)({ ...request, locale: lang });
    return response.data as ResponseT;
  }, [lang, functionName]);
}

export interface Handles {
  [userId: string]: string | undefined;
}
export function useProfileHandles(userIds: string[]): Handles {
  const [handles, setHandles] = useState<Handles>({});
  useEffect(() => {
    let canceled = false;
    const userIdsToFetch = filter(userIds, uid => !handles[uid]);
    if (userIdsToFetch.length) {
      const promises = userIdsToFetch.map(async(uid: string) => {
        const handle = await fbdb.profile({ uid }).child('handle').once('value');
        return { userId: uid, handle: handle.val() as string };
      });

      Promise.all(promises).then((fetchedHandles) => {
        const allHandles = { ...handles };
        forEach(fetchedHandles, ({ userId, handle }) => {
          allHandles[userId] = handle;
        });
        if (!canceled) {
          setHandles(allHandles);
        }
      });
    }
    return () => {
      canceled = true;
    };
  }, [userIds, handles, setHandles]);
  return handles;
}

export interface FriendUser {
  userId: string;
  handle?: string;
}
export function useFriends(userId: string): {
  isSelf: boolean;
  loading: boolean;
  friends: FriendUser[];
  pendingRequests: FriendUser[];
  receivedRequests: FriendUser[];
  selfFriendStatus?: { [uid: string]: FriendStatus | undefined };
} {
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const isSelf = !!user && user.uid === userId;
  const [selfProfileDifferent, loadingSelfProfile] = useObjectVal<ArkhamCardsProfile>(!isSelf && user ? fbdb.profile(user) : undefined);
  const [profile, loadingProfile] = useObjectVal<ArkhamCardsProfile>(fbdb.profile({ uid: userId }));
  const selfProfile = isSelf ? profile : selfProfileDifferent;
  const selfFriendStatus = useMemo(() => selfProfile?.friends || {}, [selfProfile]);
  const handleUserIds = useMemo(() => {
    if (isSelf) {
      return keys(profile?.friends || {});
    }
    const friends: string[] = [];
    forEach(profile?.friends || {}, (status, uid) => {
      if (status === FriendStatus.FRIENDS || uid === userId) {
        friends.push(uid);
      }
    });
    return friends;
  }, [profile, isSelf, userId]);
  const handles = useProfileHandles(handleUserIds);
  const [friends, pendingRequests, receivedRequests] = useMemo(() => {
    if (!profile?.friends) {
      return [[],[],[]];
    }
    const friends: FriendUser[] = [];
    const pendingRequests: FriendUser[] = [];
    const receivedRequests: FriendUser[] = [];
    forEach(profile?.friends || {}, (status, uid) => {
      const item = {
        userId: uid,
        handle: handles[uid],
      };
      switch (status) {
        case FriendStatus.FRIENDS:
          friends.push(item);
          break;
        case FriendStatus.RECEIVED:
          if (isSelf || uid === userId) {
            receivedRequests.push(item);
          }
          break;
        case FriendStatus.SENT:
          if (isSelf || uid === userId) {
            pendingRequests.push(item);
          }
          break;
        default:
          break;
      }
    });
    return [friends, pendingRequests, receivedRequests];
  }, [handles, profile, userId, isSelf]);
  return {
    loading: loading || loadingProfile || loadingSelfProfile,
    isSelf,
    friends,
    pendingRequests,
    receivedRequests,
    selfFriendStatus: user ? selfFriendStatus : undefined,
  };
}


interface SnapshotReference {
  id: string;
  ref: FirebaseDatabaseTypes.Reference;
}

interface Snapshots<T> {
  [id: string]: {
    value: T;
    version: number;
  } | undefined;
}
function useSnapshot<T>(refs: SnapshotReference[]): [Snapshots<T>, boolean, () => void] {
  const [refreshCounter, incRefreshCounter] = useCounter(0, {});
  const [result, updateResult] = useReducer(
    (state: Snapshots<T>, action: { type: 'set'; id: string; value: T; version: number }) => {
      switch (action.type) {
        case 'set': {
          return {
            ...state,
            [action.id]: {
              value: action.value,
              version: action.version,
            },
          };
        }
      }
    }, {}
  );
  useEffect(() => {
    forEach(refs, ({ ref, id }) => {
      ref.once('value').then(
        val => updateResult({ type: 'set', id, value: val.val(), version: refreshCounter }),
        err => {
          console.log(err);
        }
      );
    });
  }, [refs, refreshCounter]);
  const loading = useMemo(() => {
    if (refs.length === 0) {
      return false;
    }
    const missing = find(refs, ({ id }) => !result[id] || (result[id]?.version || 0) < refreshCounter);
    return !!missing;
  }, [refs, result, refreshCounter]);

  const doRefresh = useCallback(() => {
    incRefreshCounter();
  }, [incRefreshCounter]);
  return [result, loading, doRefresh];
}


export function useMyCampaigns(): [{ campaign: Campaign; sort: number }[], boolean, undefined | (() => void)] {
  const { user, loading } = useContext(ArkhamCardsAuthContext);
  const [myCampaigns, loadingMyCampaigns] = useObjectVal<ArkhamCardsUserCampaigns>(user ? fbdb.myCampaigns(user) : undefined);
  const campaignRefs: SnapshotReference[] = useMemo(() => {
    return flatMap(values(myCampaigns?.campaigns || {}), campaignId => {
      if (!campaignId) {
        return [];
      }
      return {
        id: campaignId.serverId,
        ref: fbdb.campaign(campaignId),
      };
    });
  }, [myCampaigns]);
  const [serverCampaigns, loadingServerCampaigns, refreshSnapshot] = useSnapshot<UploadedCampaign>(campaignRefs);
  const campaigns = useMemo(() => {
    if (!user) {
      return [];
    }
    const campaignsMap: { [uuid: string]: Campaign | undefined } = {};
    const guidesMap: { [uuid: string]: UploadedCampaignGuideState | undefined } = {};
    return sortBy(
      map(
        flatMap(serverCampaigns, (entry, serverId) => {
          if (!entry) {
            return [];
          }
          const uploadedCampaign = entry.value;
          if (uploadedCampaign?.guides) {
            forEach(uploadedCampaign.guides, (guide, campaignId) => {
              guidesMap[campaignId] = guide;
            });
          }
          if (!uploadedCampaign?.campaigns) {
            return [];
          }
          return flatMap(uploadedCampaign.campaigns, campaign => {
            if (!campaign) {
              return [];
            }
            const c: Campaign = {
              ...campaign,
              serverId,
            };
            campaignsMap[campaign.uuid] = c;
            if (c.linkedCampaignUuid) {
              return [];
            }
            return c;
          });
        }),
        campaign => {
          if (campaign.linkUuid) {
            const campaignA = campaignsMap[campaign.linkUuid.campaignIdA];
            const campaignB = campaignsMap[campaign.linkUuid.campaignIdB];
            if (campaignA && campaignB) {
              return {
                campaign,
                sort: Math.min(
                  getCampaignLastUpdated(campaignA, guidesMap[campaignA.uuid]),
                  getCampaignLastUpdated(campaignB, guidesMap[campaignB.uuid])
                ),
              };
            }
          }
          return {
            campaign,
            sort: getCampaignLastUpdated(campaign, guidesMap[campaign.uuid]),
          };
        }
      ),
      c => c.sort
    );
  }, [user, serverCampaigns]);
  return [
    campaigns,
    loading || (!user ? false : loadingMyCampaigns || loadingServerCampaigns),
    user ? refreshSnapshot : undefined,
  ];
}

export function useServerCampaign(campaignId?: CampaignId): [SingleCampaign | undefined, boolean] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [serverCampaign, loading] = useObjectVal<Campaign>(user && campaignId?.serverId ? fbdb.campaignDetail(campaignId) : undefined);
  const serverSingleCampaign = useMemo(() => {
    if (!serverCampaign) {
      return undefined;
    }
    return {
      ...processCampaign(serverCampaign),
      serverId: campaignId?.serverId,
    };
  }, [serverCampaign, campaignId]);
  return [serverSingleCampaign, loading];
}


export function useServerCampaignGuideState(campaignId?: CampaignId): [CampaignGuideState | undefined, boolean] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [uploadedCampaignGuideState, loading] = useObjectVal<UploadedCampaignGuideState>(user && campaignId?.serverId ? fbdb.campaignGuide(campaignId) : undefined);
  const campaignGuideState: CampaignGuideState | undefined = useMemo(() => {
    if (!uploadedCampaignGuideState || !campaignId) {
      return undefined;
    }
    const undo = flatMap(uploadedCampaignGuideState.undo || {}, (value, key) => {
      if (value) {
        return key;
      }
      return [];
    });
    const undoSet = new Set(undo);
    const inputs = flatMap(uploadedCampaignGuideState.inputs || {}, (value, key) => {
      if (!value || undoSet.has(key)) {
        return [];
      }
      return value;
    });
    return {
      uuid: campaignId.campaignId,
      inputs,
      undo,
      lastUpdated: new Date(getLastUpdated(uploadedCampaignGuideState)),
    };
  }, [uploadedCampaignGuideState, campaignId]);
  return [campaignGuideState, loading];
}