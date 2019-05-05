import {
  SET_TABOO_SET,
  SetTabooSetAction,
} from '../actions/types';

interface SettingsState {
  tabooId?: number;
}

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
};


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SetTabooSetAction
): SettingsState {
  switch (action.type) {
    case SET_TABOO_SET: {
      return {
        ...state,
        tabooId: action.tabooId,
      };
    }
    default: {
      return state;
    }
  }
}
