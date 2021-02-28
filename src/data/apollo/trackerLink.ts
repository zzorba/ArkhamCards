import { ApolloLink } from 'apollo-link';
import { stringify } from 'flatted';
import { Action, Dispatch } from 'redux';
import uuid from 'react-native-uuid';

import { TrackedQuery, TrackedQueriesAddAction, TrackedQueriesRemoveAction, TRACKED_QUERIES_ADD, TRACKED_QUERIES_REMOVE } from '@actions/types';

const trackedQueriesAdd = (trackedQuery: TrackedQuery): TrackedQueriesAddAction => ({
  payload: trackedQuery,
  type: TRACKED_QUERIES_ADD,
});

const trackedQueriesRemove = (id: string): TrackedQueriesRemoveAction => ({
  payload: id,
  type: TRACKED_QUERIES_REMOVE,
});

export default (dispatch: Dispatch<Action>) => (
  new ApolloLink((operation, forward) => {
    if (forward === undefined) {
      return null;
    }
    const name: string = operation.operationName;
    const queryJSON: string = stringify(operation.query);
    const variablesJSON: string = stringify(operation.variables);
    const context = operation.getContext();
    const contextJSON = stringify(context);
    const id = uuid.v4();
    if (context.tracked !== undefined) {
      dispatch(
        trackedQueriesAdd({
          contextJSON,
          id,
          name,
          queryJSON,
          variablesJSON,
        })
      );
    }
    return forward(operation).map(data => {
      if (context.tracked !== undefined) {
        dispatch(trackedQueriesRemove(id));
      }
      return data;
    });
  })
);
