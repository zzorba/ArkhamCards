import { Store } from 'redux';
import { stringify } from 'flatted';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject, split } from '@apollo/client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import loggerLink from 'apollo-link-logger';
import QueueLink from 'apollo-link-queue';
import deepEqual from 'deep-equal';
import SerializingLink from 'apollo-link-serialize';
import { map, zip } from 'lodash';

import { TypedTypePolicies } from '@generated/graphql/apollo-helpers';

import { getAuthToken } from '@lib/ArkhamCardsAuthProvider';

import trackerLink from './trackerLink';

export const GRAPHQL_SERVER = 'gapi.arkhamcards.com/v1';

const typePolicies: TypedTypePolicies = {
  campaign_deck: {
    keyFields: ['campaign_id', 'arkhamdb_id', 'local_uuid'],
  },
  campaign: {
    keyFields: ['id'],
    fields: {
      standaloneId(rawVal: string) {
        return rawVal ?? null;
      },
      cycleCode(rawVal: string) {
        return rawVal ?? null;
      },
      archived(rawVal: boolean) {
        return rawVal ?? null;
      },
      latest_decks: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      investigators: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
      investigator_data: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
    },
  },
  chaos_bag_result: {
    keyFields: ['id'],
    fields: {
      drawn: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
      sealed: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
    },
  },
  campaign_guide: {
    keyFields: ['id'],
    merge: true,
    fields: {
      guide_inputs: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
      guide_achievements: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
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
  investigator_data: {
    keyFields: ['id'],
    fields: {
      spentXp(rawValue) {
        return rawValue ?? null;
      },
      specialXp(rawValue) {
        return rawValue ?? null;
      },
    },
  },
  users: {
    fields: {
      decks: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
      all_decks: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          if (deepEqual(existing, incoming)) {
            return existing;
          }
          return incoming;
        },
      },
      campaigns: {
        merge(existing, incoming) {
          if (existing?.length !== incoming?.length) {
            return incoming;
          }
          return map(zip(existing, incoming), ([e, i]) => {
            if (deepEqual(e, i)) {
              return e;
            }
            return i;
          });
        },
      },
    },
  },
};

const cache = new InMemoryCache({
  typePolicies,
});

const anonCache = new InMemoryCache();

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
export default function createApolloClient(store: Store): [ApolloClient<NormalizedCacheObject>, ApolloClient<NormalizedCacheObject>] {
  const links = __DEV__ ? [loggerLink] : [];
  const authClient = new ApolloClient({
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

  const anonClient = new ApolloClient({
    cache: anonCache,
    link: ApolloLink.from([
      ...links,
      errorLink,
      retryLink,
      new HttpLink({
        uri: `https://${GRAPHQL_SERVER}/graphql`,
      }),
    ]),
    assumeImmutableResults: true,
  });

  return [authClient, anonClient];
}
