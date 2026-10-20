import {
  ARKHAM_BUILD_LOGIN_STARTED,
  ARKHAM_BUILD_LOGIN,
  ARKHAM_BUILD_LOGIN_ERROR,
  ARKHAM_BUILD_LOGOUT,
  ArkhamBuildActions,
} from '@actions/types';

export interface ArkhamBuildState {
  loading: boolean;
  status: boolean;
  error: string | null;
}
const DEFAULT_ARKHAM_BUILD_STATE: ArkhamBuildState = {
  loading: false,
  status: false,
  error: null,
};

export default function(
  state: ArkhamBuildState = DEFAULT_ARKHAM_BUILD_STATE,
  action: ArkhamBuildActions
): ArkhamBuildState {
  if (action.type === ARKHAM_BUILD_LOGIN_STARTED) {
    return {
      ...state,
      loading: true,
    };
  } else if (action.type === ARKHAM_BUILD_LOGIN) {
    return {
      ...state,
      loading: false,
      status: true,
      error: null,
    };
  } else if (action.type === ARKHAM_BUILD_LOGIN_ERROR) {
    return {
      ...state,
      loading: false,
      error: action.error.toString() !== 'User Cancelled.' ? action.error.toString() : null,
    };
  } else if (action.type === ARKHAM_BUILD_LOGOUT) {
    return {
      ...state,
      loading: false,
      status: false,
      error: null,
    };
  }
  return state;
}
