import React, { useMemo, useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import ArkhamCardsAuthContext from './ArkhamCardsAuthContext';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
export let currentUser: FirebaseAuthTypes.User | undefined = undefined;

let currentUserLoading: boolean = true;

export async function getAuthToken(): Promise<string | undefined> {
  if (!currentUser) {
    console.log('***********');
    console.log('trying to get token with no user.');
    return undefined;
  }
  return await currentUser.getIdToken();
}

interface State {
  user?: FirebaseAuthTypes.User;
  userId?: string;
  loading: boolean;
}

export default function ArkhamCardsAuthProvider({ children }: Props) {
  const arkhamDb = useSelector((state: AppState) => state.signedIn.status);
  const arkhamDbUser = useSelector((state: AppState) => state.signedIn.status ? state.decks.arkhamDbUser : undefined);
  const [state, setState] = useState<State>({
    user: currentUser,
    userId: currentUser?.uid,
    loading: currentUserLoading,
  });
  useEffect(() => {
    if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
      const authUserChanged = (user: FirebaseAuthTypes.User | undefined) => {
        setState({
          user,
          userId: user?.uid,
          loading: false,
        });
      };
      if (eventListener === null) {
        // We only want to listen to this once, hence the singleton pattern.
        eventListener = new EventEmitter();
        eventListener.setMaxListeners(100);
        eventListener.addListener('onAuthStateChanged', authUserChanged);
        const callback = async(user: FirebaseAuthTypes.User | null) => {
          currentUserLoading = false;
          currentUser = user || undefined;
          if (user) {
            const idTokenReuslt = await user.getIdTokenResult();
            const hasuraClaims = idTokenReuslt.claims['https://hasura.io/jwt/claims'];
            if (hasuraClaims) {
              eventListener?.emit('onAuthStateChanged', currentUser);
            } else {
              // Check if refresh is required.
              const metadataRef = database().ref(`metadata/${user.uid}/refreshTime`);
              metadataRef.on('value', async(data) => {
                if (!data.exists()) {
                  setTimeout(() => callback(user), 500);
                  return;
                }
                const idTokenReuslt = await user.getIdTokenResult(true);
                if (idTokenReuslt.claims['https://hasura.io/jwt/claims']) {
                  // Force refresh to pick up the latest custom claims changes.
                  eventListener?.emit('onAuthStateChanged', currentUser);
                } else {
                  setTimeout(() => callback(user), 500);
                }
              });
            }
          } else {
            eventListener?.emit('onAuthStateChanged', currentUser);
          }
        };
        auth().onAuthStateChanged(callback);
      } else {
        eventListener.addListener('onAuthStateChanged', authUserChanged);
      }
      return () => {
        eventListener?.removeListener('onAuthStateChanged', authUserChanged);
      };
    }
  }, []);
  const context = useMemo(() => {
    return {
      ...state,
      arkhamDbUser,
      arkhamDb,
    };
  }, [state, arkhamDbUser, arkhamDb])
  return (
    <ArkhamCardsAuthContext.Provider value={context}>
      { children }
    </ArkhamCardsAuthContext.Provider>
  );
}
