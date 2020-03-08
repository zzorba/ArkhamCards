import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

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
  class LoginStateWrapper extends React.Component<P> {
    _renderWrappedComponent = (
      login: () => void,
      signedIn: boolean,
      signInError?: string,
    ) => {
      return (
        <WrappedComponent
          {...this.props}
          login={login}
          signedIn={signedIn}
          signInError={signInError}
        />
      );
    };

    render() {
      return (
        <LoginStateComponent
          noWrapper={!!(options && options.noWrapper)}
          render={this._renderWrappedComponent}
          otherProps={this.props}
        />
      );
    }
  }

  hoistNonReactStatics(LoginStateWrapper, WrappedComponent);
  return LoginStateWrapper;
}
