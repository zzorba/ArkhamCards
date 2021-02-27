import React, { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';

import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import ArkhamCardsAuthContext from './ArkhamCardsAuthContext';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
let currentUser: FirebaseAuthTypes.User | undefined = undefined;
export let hasuraToken: string | undefined = undefined;
let currentUserLoading: boolean = true;

interface State {
  user?: FirebaseAuthTypes.User;
  token?: string;
  loading: boolean;
}
export default function ArkhamCardsAuthProvider({ children }: Props) {
  const [state, setState] = useState<State>({ user: currentUser, loading: currentUserLoading, token: hasuraToken });
  useEffect(() => {
    if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
      const authUserChanged = (user: FirebaseAuthTypes.User | undefined, token: string | undefined) => {
        setState({
          user,
          loading: false,
          token,
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
            const token = await user.getIdToken();
            const idTokenReuslt = await user.getIdTokenResult();
            const hasuraClaims = idTokenReuslt.claims['https://hasura.io/jwt/claims'];
            if (hasuraClaims) {
              console.log('Loaded hasura token');
              hasuraToken = token;
              eventListener?.emit('onAuthStateChanged', currentUser, token);
            } else {
              console.log('No Hasura');
              // Check if refresh is required.
              const metadataRef = database().ref(`metadata/${user.uid}/refreshTime`);
              metadataRef.on('value', async(data) => {
                if (!data.exists) {
                  eventListener?.emit('onAuthStateChanged', currentUser, token);
                  return;
                }
                // Force refresh to pick up the latest custom claims changes.
                const newToken = await user.getIdToken(true);
                console.log('Loaded hasura token');
                hasuraToken = newToken;
                eventListener?.emit('onAuthStateChanged', currentUser, newToken);
              });
            }
          } else {
            eventListener?.emit('onAuthStateChanged', currentUser, undefined);
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
