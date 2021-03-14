import React, { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import ArkhamCardsAuthContext from './ArkhamCardsAuthContext';

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
  loading: boolean;
}
export default function ArkhamCardsAuthProvider({ children }: Props) {
  const [state, setState] = useState<State>({ user: currentUser, loading: currentUserLoading });
  useEffect(() => {
    if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
      const authUserChanged = (user: FirebaseAuthTypes.User | undefined) => {
        setState({
          user,
          loading: false,
        });
      };
      if (eventListener === null) {
        // We only want to listen to this once, hence the singleton pattern.
        eventListener = new EventEmitter();
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
              console.log('No Hasura');
              // Check if refresh is required.
              const metadataRef = database().ref(`metadata/${user.uid}/refreshTime`);
              metadataRef.on('value', async(data) => {
                if (!data.exists) {
                  eventListener?.emit('onAuthStateChanged', currentUser);
                  return;
                }
                // Force refresh to pick up the latest custom claims changes.
                eventListener?.emit('onAuthStateChanged', currentUser);
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
  return (
    <ArkhamCardsAuthContext.Provider value={state}>
      { children }
    </ArkhamCardsAuthContext.Provider>
  );
}
