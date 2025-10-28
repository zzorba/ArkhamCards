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
  const FetchCardsResult = function(props: Props) {
    return (
      <FetchCardsGate promptForUpdate={promptForUpdate}>
        { /* @ts-ignore */ }
        <WrappedComponent {...props} />
      </FetchCardsGate>
    );
  };
  hoistNonReactStatics(FetchCardsResult, WrappedComponent);
  return FetchCardsResult;
}
