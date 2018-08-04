import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import FetchCardsGate from './FetchCardsGate';

export default function withFetchCardsGate(WrappedComponent, { promptForUpdate }) {
  const result = function(props) {
    return (
      <FetchCardsGate promptForUpdate={promptForUpdate} {...props}>
        <WrappedComponent {...props} />
      </FetchCardsGate>
    );
  };
  hoistNonReactStatics(result, WrappedComponent);
  return result;
}
