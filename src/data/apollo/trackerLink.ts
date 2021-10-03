import { ApolloLink } from '@apollo/client';
import { stringify } from 'flatted';
import { Action, Dispatch } from 'redux';
import uuid from 'react-native-uuid';

import { TrackedQuery, TrackedQueriesAddAction, TrackedQueriesRemoveAction, TRACKED_QUERIES_ADD, TRACKED_QUERIES_REMOVE } from '@actions/types';
import { genericOptimisticUpdates } from '@data/remote/apollo';

export function trackedQueriesAdd(trackedQuery: TrackedQuery): TrackedQueriesAddAction {
  return {
    payload: trackedQuery,
    type: TRACKED_QUERIES_ADD,
  };
}

export function trackedQueriesRemove(id: string): TrackedQueriesRemoveAction {
  return {
    payload: id,
    type: TRACKED_QUERIES_REMOVE,
  };
}

export default (dispatch: Dispatch<Action>) => (
  new ApolloLink((operation, forward) => {
    if (forward === undefined) {
      return null;
    }
    const name: string = operation.operationName;
    const variablesJSON: string = stringify(operation.variables);
    const context = operation.getContext();
    const contextJSON = stringify(context);
    const id = uuid.v4();
    const tracked = !!genericOptimisticUpdates[name];
    if (tracked) {
      dispatch(
        trackedQueriesAdd({
          contextJSON,
          id,
          name,
          variablesJSON,
        })
      );
    } else {
      // console.log(`Skipping tracking of: ${name}`);
    }
    return forward(operation).map(data => {
      if (tracked) {
        dispatch(trackedQueriesRemove(id));
      }
      return data;
    });
  })
);
