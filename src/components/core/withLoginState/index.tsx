import React from 'react';

import LoginStateComponent from './LoginStateComponent';

export interface LoginStateProps {
  login: () => void;
  signedIn: boolean;
  signInError?: string;
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
    return (
      <LoginStateComponent noWrapper={!!(options && options.noWrapper)}>
        { (login: () => void, signedIn: boolean, signInError?: string) => (
          <WrappedComponent
            {...props}
            login={login}
            signedIn={signedIn}
            signInError={signInError}
          />
        ) }
      </LoginStateComponent>
    );
  }

  return LoginStateWrapper;
}
