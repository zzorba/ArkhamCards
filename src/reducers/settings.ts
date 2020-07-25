import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SET_ALPHABETIZE_ENCOUNTER_SETS,
  SetTabooSetAction,
  SetSingleCardViewAction,
  SetAlphabetizeEncounterSetsAction,
} from '@actions/types';

interface SettingsState {
  tabooId?: number;
  singleCardView?: boolean;
  alphabetizeEncounterSets?: boolean;
}

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
  singleCardView: false,
  alphabetizeEncounterSets: false,
};

type SettingAction = SetTabooSetAction | SetSingleCardViewAction | SetAlphabetizeEncounterSetsAction;


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
    case SET_ALPHABETIZE_ENCOUNTER_SETS:
      return {
        ...state,
        alphabetizeEncounterSets: action.alphabetizeEncounterSets,
      };
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
