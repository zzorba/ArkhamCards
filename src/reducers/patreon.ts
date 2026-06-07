import {
  PATREON_LOGIN_STARTED,
  PATREON_LOGIN,
  PATREON_LOGIN_ERROR,
  PATREON_LOGOUT,
  PatreonActions,
} from '@actions/types';

export interface PatreonState {
  loading: boolean;
  status: boolean;
  error: string | null;
}

const DEFAULT_STATE: PatreonState = {
  loading: false,
  status: false,
  error: null,
};

export default function(
  state: PatreonState = DEFAULT_STATE,
  action: PatreonActions
): PatreonState {
  switch (action.type) {
    case PATREON_LOGIN_STARTED:
      return { ...state, loading: true };
    case PATREON_LOGIN:
      return { ...state, loading: false, status: true, error: null };
    case PATREON_LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error.toString() !== 'Cancelled' ? action.error.toString() : null,
      };
    case PATREON_LOGOUT:
      return { ...state, loading: false, status: false, error: null };
    default:
      return state;
  }
}
