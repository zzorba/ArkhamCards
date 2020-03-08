import {
  LOGIN_STARTED,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  SignInActions,
} from 'actions/types';

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
      error: action.error.toString() === 'User Cancelled.' ? action.error : null,
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
