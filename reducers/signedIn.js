import {
  LOGIN_STARTED,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
} from '../actions/types';

const DEFAULT_SIGNED_IN_STATE = {
  loading: false,
  status: false,
  error: null,
};

export default function(state = DEFAULT_SIGNED_IN_STATE, action) {
  if (action.type === LOGIN_STARTED) {
    return Object.assign({}, state, {
      loading: true,
    });
  }
  if (action.type === LOGIN) {
    return Object.assign({}, state, {
      loading: false,
      status: true,
      error: null,
    });
  }
  if (action.type === LOGIN_ERROR) {
    return Object.assign({}, state, {
      loading: false,
      error: action.error == 'User Cancelled.' ? action.error : null,
    });
  }
  if (action.type === LOGOUT) {
    return Object.assign({}, state, {
      loading: false,
      status: false,
      error: null,
    });
  }
  return state;
}
