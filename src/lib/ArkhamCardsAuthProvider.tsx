import React, { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import ArkhamCardsAuthContext from './ArkhamCardsAuthContext';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
let currentUser: FirebaseAuthTypes.User | undefined = undefined;
let currentUserLoading: boolean = true;

interface State {
  user?: FirebaseAuthTypes.User;
  loading: boolean;
}
export default function ArkhamCardsAuthProvider({ children }: Props) {
  const [state, setState] = useState<State>({ user: currentUser, loading: currentUserLoading });
  useEffect(() => {
    if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
      const authUserChanged = (user?: FirebaseAuthTypes.User) => {
        setState({
          user,
          loading: false,
        });
      };
      if (eventListener === null) {
        // We only want to listen to this once, hence the singleton pattern.
        eventListener = new EventEmitter();
        eventListener.addListener('onAuthStateChanged', authUserChanged);
        const callback = (user: FirebaseAuthTypes.User | null) => {
          currentUserLoading = false;
          currentUser = user || undefined;
          eventListener?.emit('onAuthStateChanged', currentUser);
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
