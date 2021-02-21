import React, { useEffect, useState } from 'react';
import Parse from 'parse/react-native';
import { EventEmitter } from 'events';

import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import ArkhamCardsAuthContext, { ArkhamCardsUser } from './ArkhamCardsAuthContext';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
export let currentUser: ArkhamCardsUser | undefined = undefined;
let currentUserLoading: boolean = true;

interface State {
  user?: ArkhamCardsUser;
  setUser: (user: ArkhamCardsUser | null) => void;
  loading: boolean;
}

function setUser(user: ArkhamCardsUser | null){
  if (eventListener) {
    currentUser = user || undefined;
    currentUserLoading = false;
    eventListener.emit('onAuthStateChanged', user || undefined);
  }
}

export default function ArkhamCardsAuthProvider({ children }: Props) {
  const [state, setState] = useState<State>({ user: currentUser, loading: currentUserLoading, setUser });

  useEffect(() => {
    if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
      const authUserChanged = (user: ArkhamCardsUser | undefined) => {
        console.log(user?.id);
        setState({
          user,
          setUser,
          loading: false,
        });
      };
      if (eventListener === null) {
        // We only want to listen to this once, hence the singleton pattern.
        eventListener = new EventEmitter();
        eventListener.addListener('onAuthStateChanged', authUserChanged);

        Parse.User.currentAsync().then(setUser);
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
