import { Store } from 'redux';
import { stringify } from 'flatted';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import SerializingLink from 'apollo-link-serialize';

import { hasuraToken } from '@lib/ArkhamCardsAuthProvider';

import trackerLink from './trackerLink';

export const GRAPHQL_SERVER = 'api.arkhamcards.com/v1';

const cache = new InMemoryCache({
  freezeResults: true,
});
const errorLink = onError((e) => {
  // tslint:disable-next-line
  console.log('Caught Apollo Client Error');
  console.log(stringify(e));
});

const authLink = setContext((req, { headers }) => {
  const newHeaders = {
    ...headers,
  };
  if (hasuraToken) {
    newHeaders.Authorization = `Bearer ${hasuraToken}`;
    console.log(newHeaders.Authorization);
  } else {
    console.log('Sending request without auth.');
  }
  return {
    headers: newHeaders,
  };
});
const httpsLink = new HttpLink({
  uri: `https://${GRAPHQL_SERVER}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `wss://${GRAPHQL_SERVER}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {},
    },
  },
});
const queueLink = new QueueLink();
const retryLink = new RetryLink();
const serializingLink = new SerializingLink();

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpsLink
);
export default function constructApolloClient(store: Store) {
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      loggerLink,
      errorLink,
      trackerLink(store.dispatch),
      queueLink,
      serializingLink,
      retryLink,
      authLink,
      link,
    ]),
    assumeImmutableResults: true,
  });
}