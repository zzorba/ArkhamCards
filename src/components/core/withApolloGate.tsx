import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { parse } from 'flatted';
import { t } from 'ttag';

import { AppState, getTrackedQueries } from '@reducers';
import StyleContext from '@styles/StyleContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { apolloQueueLink } from '@data/apollo/createApolloClient';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useApolloClient } from '@apollo/client';
import { genericOptimisticUpdates } from '@data/remote/apollo';
import { trackedQueriesRemove } from '@data/apollo/trackerLink';
import ArkhamLoadingSpinner from './ArkhamLoadingSpinner';

interface Props {
  children: JSX.Element;
}

/**
 * Simple component to block to handle apollo singleton stuff.
 */
function ApolloGate({ children }: Props) {
  const { user } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected }] = useNetworkStatus();
  const trackedQueries = useSelector(getTrackedQueries);
  const [trackedLoaded, setTrackedLoaded] = useState(false);
  const loading = useSelector((state: AppState) => state.packs.loading || state.cards.loading);
  useEffect(() => {
    if (user && isConnected) {
      user.getIdTokenResult().then(idTokenResult => {
        const hasuraClaims = idTokenResult.claims['https://hasura.io/jwt/claims'];
        if (hasuraClaims) {
          // console.log('Opening apollo');
          apolloQueueLink.open();
        } else {
          apolloQueueLink.close();
        }
      });
    } else {
      // console.log('Closing apollo');
      apolloQueueLink.close();
    }
  }, [user, isConnected]);
  const client = useApolloClient();
  const dispatch = useDispatch();
  useEffect(() => {
    const execute = async() => {
      const promises: Array<Promise<any>> = [];
      trackedQueries.forEach(trackedQuery => {
        const optimisticUpdate = genericOptimisticUpdates[trackedQuery.name];
        if (!optimisticUpdate) {
          console.log(`Something weird here, we cannot handle tracked query: ${trackedQuery.name}`);
        } else {
          const context = parse(trackedQuery.contextJSON);
          const variables = parse(trackedQuery.variablesJSON);
          promises.push(
            client.mutate({
              context,
              mutation: optimisticUpdate.mutation,
              optimisticResponse: context.optimisticResponse,
              update: optimisticUpdate.update,
              variables,
            })
          );
          dispatch(trackedQueriesRemove(trackedQuery.id));
        }
      });

      if (isConnected) {
        try {
          await Promise.all(promises);
        } catch (e) {
          // ALLOW TRACKED QUERIES TO FAIL
        }
      }
      setTrackedLoaded(true);
    };
    execute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { backgroundStyle, typography } = useContext(StyleContext);
  if (loading || !trackedLoaded) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <Text style={typography.text}>
          { loading ? t`Loading latest cards...` : t`Loading...` }
        </Text>
        <ArkhamLoadingSpinner autoPlay loop />
      </View>
    );
  }
  return children;
}

export default function withApolloGate<Props>(WrappedComponent: React.ComponentType<Props>) {
  const result = function(props: Props) {
    return (
      <ApolloGate>
        <WrappedComponent {...props} />
      </ApolloGate>
    );
  };
  hoistNonReactStatics(result, WrappedComponent);
  return result;
}


const styles = StyleSheet.create({
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
