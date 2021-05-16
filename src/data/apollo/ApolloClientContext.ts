import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import React from 'react';

interface ApolloClientContextType {
  client: ApolloClient<NormalizedCacheObject>;
  anonClient: ApolloClient<NormalizedCacheObject>;
}

// eslint-disable-next-line
export const ApolloClientContext = React.createContext<ApolloClientContextType>({
  // @ts-ignore TS2345
  client: null,
  // @ts-ignore TS2345
  anonClient: null,
});

export default ApolloClientContext;
