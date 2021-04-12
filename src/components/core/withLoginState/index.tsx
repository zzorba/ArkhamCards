import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import LoginStateComponent from './LoginStateComponent';
import { DeckActions, useDeckActions } from '@data/remote/decks';

export interface LoginStateProps {
  login: () => void;
  signedIn: boolean;
  signInError?: string;
  deckActions: DeckActions;
}

interface Options {
  noWrapper?: boolean;
}

/**
 * Simple component to block children rendering until a login flow is completed.
 */
export default function withLoginState<P>(
  WrappedComponent: React.ComponentType<P & LoginStateProps>,
  options?: Options
) {
  function LoginStateWrapper(props: P) {
    const actions = useDeckActions();
    return (
      <LoginStateComponent noWrapper={!!(options && options.noWrapper)} actions={actions}>
        { (login: () => void, signedIn: boolean, signInError?: string) => (
          <WrappedComponent
            {...props}
            login={login}
            signedIn={signedIn}
            signInError={signInError}
            deckActions={actions}
          />
        ) }
      </LoginStateComponent>
    );
  }

  hoistNonReactStatics(LoginStateWrapper, WrappedComponent);
  return LoginStateWrapper;
}
