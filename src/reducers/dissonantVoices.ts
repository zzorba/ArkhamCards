import {
  DISSONANT_VOICES_LOGIN_STARTED,
  DISSONANT_VOICES_LOGIN,
  DISSONANT_VOICES_LOGIN_ERROR,
  DISSONANT_VOICES_LOGOUT,
  DissonantVoicesActions,
} from '@actions/types';

export interface DissonantVoicesState {
  loading: boolean;
  status: boolean;
  error: string | null;
}
const DEFAULT_DISSONANT_VOICES_STATE: DissonantVoicesState = {
  loading: false,
  status: false,
  error: null,
};

export default function(
  state: DissonantVoicesState = DEFAULT_DISSONANT_VOICES_STATE,
  action: DissonantVoicesActions
): DissonantVoicesState {
  if (action.type === DISSONANT_VOICES_LOGIN_STARTED) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === DISSONANT_VOICES_LOGIN) {
    return {
      ...state,
      loading: false,
      status: true,
      error: null,
    };
  } else if (action.type === DISSONANT_VOICES_LOGIN_ERROR) {
    return {
      ...state,
      loading: false,
      error: action.error.toString() !== 'User Cancelled.' ? action.error.toString() : null,
    };
  } else if (action.type === DISSONANT_VOICES_LOGOUT) {
    return {
      ...state,
      loading: false,
      status: false,
      error: null,
    };
  }
  return state;
}
