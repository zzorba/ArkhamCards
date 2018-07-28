import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import FetchCardsGate from './FetchCardsGate';

export default function withFetchCardsGate(WrappedComponent) {
  const result = function(props) {
    return (
      <FetchCardsGate {...props}>
        <WrappedComponent {...props} />
      </FetchCardsGate>
    );
  };
  hoistNonReactStatics(result, WrappedComponent);
  return result;
}
