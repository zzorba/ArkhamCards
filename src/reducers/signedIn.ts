import {
  ARKHAMDB_LOGIN_STARTED,
  ARKHAMDB_LOGIN,
  ARKHAMDB_LOGIN_ERROR,
  ARKHAMDB_LOGOUT,
  SignInActions,
} from '@actions/types';

interface SignedInState {
  loading: boolean;
  status: boolean;
  error: string | null;
}
const DEFAULT_SIGNED_IN_STATE: SignedInState = {
  loading: false,
  status: false,
  error: null,
};

export default function(
  state: SignedInState = DEFAULT_SIGNED_IN_STATE,
  action: SignInActions
): SignedInState {
  if (action.type === ARKHAMDB_LOGIN_STARTED) {
    return Object.assign({}, state, {
      loading: true,
    });
  }
  if (action.type === ARKHAMDB_LOGIN) {
    return Object.assign({}, state, {
      loading: false,
      status: true,
      error: null,
    });
  }
  if (action.type === ARKHAMDB_LOGIN_ERROR) {
    return Object.assign({}, state, {
      loading: false,
      error: action.error.toString() === 'User Cancelled.' ? action.error : null,
    });
  }
  if (action.type === ARKHAMDB_LOGOUT) {
    return Object.assign({}, state, {
      loading: false,
      status: false,
      error: null,
    });
  }
  return state;
}
