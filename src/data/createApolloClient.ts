import { Store } from 'redux';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import SerializingLink from 'apollo-link-serialize';
import trackerLink from '../../utils/trackerLink';

const cache = new InMemoryCache();
const errorLink = onError(() => {
  // tslint:disable-next-line
  console.log('Caught Apollo Client Error');
});
const httpLink = new HttpLink({
  uri: 'http://localhost:1337/graphql',
});
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
  });
}