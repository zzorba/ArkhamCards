import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SetTabooSetAction,
  SetSingleCardViewAction,
} from 'actions/types';

interface SettingsState {
  tabooId?: number;
  singleCardView?: boolean;
}

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
  singleCardView: false,
};

type SettingAction = SetTabooSetAction | SetSingleCardViewAction;


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SettingAction
): SettingsState {
  switch (action.type) {
    case SET_TABOO_SET: {
      return {
        ...state,
        tabooId: action.tabooId,
      };
    }
    case SET_SINGLE_CARD_VIEW: {
      return {
        ...state,
        singleCardView: action.singleCardView,
      };
    }
    default: {
      return state;
    }
  }
}
