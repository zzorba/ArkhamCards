import { Store } from 'redux';
import { stringify } from 'flatted';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import SerializingLink from 'apollo-link-serialize';

import { currentUser } from '@lib/ArkhamCardsAuthProvider';

import trackerLink from './trackerLink';

export const PARSE_BASE_SERVER = 'http://localhost:1337';
export const PARSE_APPLICATION_ID = 'd3LMO8279uM3e6mTjwXLLWrUxYums3aqrxsNgS39';
export const PARSE_JAVASCRIPT_KEY = 'Gw0kvpxOqh2CBBk1vnIWmfmzDPcDmF99BdJc6mvf';

const cache = new InMemoryCache({
  freezeResults: true,
});
const errorLink = onError((e) => {
  // tslint:disable-next-line
  console.log('Caught Apollo Client Error');
  console.log(stringify(e));
});

const authLink = setContext((_, { headers }) => {
  const newHeaders = {
    ...headers,
    'X-Parse-Application-Id': PARSE_APPLICATION_ID,
    'X-Parse-Javascript-Key': PARSE_JAVASCRIPT_KEY,
  };
  if (currentUser) {
    console.log(currentUser.getSessionToken());
    newHeaders['X-Parse-Session-Token'] = currentUser.getSessionToken();
  }
  console.log(newHeaders);
  return {
    headers: newHeaders,
  };
});
const httpLink = authLink.concat(new HttpLink({
  uri: `${PARSE_BASE_SERVER}/graphql`,
}));
const queueLink = new QueueLink();
const retryLink = new RetryLink();
const serializingLink = new SerializingLink();

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
      httpLink,
    ]),
    assumeImmutableResults: true,
  });
}