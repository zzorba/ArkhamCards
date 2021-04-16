import { Store } from 'redux';
import { stringify } from 'flatted';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import SerializingLink from 'apollo-link-serialize';

import { TypedTypePolicies } from '@generated/graphql/apollo-helpers';

import { getAuthToken } from '@lib/ArkhamCardsAuthProvider';

import trackerLink from './trackerLink';

export const GRAPHQL_SERVER = 'api.arkhamcards.com/v1';

const typePolicies: TypedTypePolicies = {
  campaign_deck: {
    keyFields: ['campaign_id', 'arkhamdb_id', 'local_uuid'],
  },
  campaign: {
    keyFields: ['id'],
  },
  chaos_bag_result: {
    keyFields: ['id'],
    fields: {
      drawn: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      sealed: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  campaign_guide: {
    keyFields: ['id'],
    fields: {
      guide_inputs: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      guide_achievements: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  guide_input: {
    keyFields: ['id', 'campaign_id'],
  },
  guide_achievement: {
    keyFields: ['id', 'campaign_id'],
  },
};

const cache = new InMemoryCache({
  typePolicies,
});

const errorLink = onError((e) => {
  // tslint:disable-next-line
  console.log('Caught Apollo Client Error');
  console.log(stringify(e));
});

const authLink = setContext(async(req, { headers }) => {
  const hasuraToken = await getAuthToken();
  if (hasuraToken) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${hasuraToken}`,
      },
    };
  }
  console.log('#################')
  console.log(`Sending request without auth: ${JSON.stringify(req.query)}`);
  console.log('#################')
  return { headers };
});

const httpsLink = authLink.concat(new HttpLink({
  uri: `https://${GRAPHQL_SERVER}/graphql`,
}));

const wsLink = new WebSocketLink(
  new SubscriptionClient(
    `wss://${GRAPHQL_SERVER}/graphql`, {
      reconnect: true,
      lazy: true,
      connectionParams: async() => {
        const hasuraToken = await getAuthToken();
        if (!hasuraToken) {
          console.log('*********\nno hasura token for subscription....\n**********');
        }
        return {
          headers: hasuraToken ? {
            Authorization: `Bearer ${hasuraToken}`,
          } : {},
        };
      },
    }
  ),
);
export const apolloQueueLink = new QueueLink();
apolloQueueLink.close();
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
  const links = __DEV__ ? [loggerLink] : [];
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      ...links,
      errorLink,
      trackerLink(store.dispatch),
      apolloQueueLink,
      serializingLink,
      retryLink,
      link,
    ]),
    assumeImmutableResults: true,
  });
}