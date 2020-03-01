import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import FetchCardsGate from './FetchCardsGate';

interface Arguments {
  promptForUpdate?: boolean;
}

export default function withFetchCardsGate<Props>(
  WrappedComponent: React.ComponentType<Props>,
  { promptForUpdate }: Arguments
) {
  const result = function(props: Props) {
    return (
      <FetchCardsGate promptForUpdate={promptForUpdate}>
        <WrappedComponent {...props} />
      </FetchCardsGate>
    );
  };
  hoistNonReactStatics(result, WrappedComponent);
  return result;
}
