import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import database from '@react-native-firebase/database';
import functions from '@react-native-firebase/functions';
import { useObjectVal } from 'react-firebase-hooks/database';
import { filter, forEach, keys } from 'lodash';

import { ArkhamCardsProfile, FriendStatus } from './types';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import LanguageContext from '@lib/i18n/LanguageContext';

export function useFunction<RequestT, ResponseT>(functionName: string) {
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
        const handle = await database().ref('/profiles/').child(uid).child('handle').once('value');
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
  const [selfProfileDifferent, loadingSelfProfile] = useObjectVal<ArkhamCardsProfile>(!isSelf && user ? database().ref('/profiles').child(user.uid) : undefined);
  const [profile, loadingProfile] = useObjectVal<ArkhamCardsProfile>(database().ref('/profiles').child(userId));
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