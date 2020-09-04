import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SET_ALPHABETIZE_ENCOUNTER_SETS,
  SET_LANGUAGE_CHOICE,
  SetTabooSetAction,
  SetSingleCardViewAction,
  SetAlphabetizeEncounterSetsAction,
  SetLanguageChoiceAction,
  CardFetchSuccessAction,
  CARD_FETCH_SUCCESS,
} from '@actions/types';

interface SettingsState {
  tabooId?: number;
  singleCardView?: boolean;
  alphabetizeEncounterSets?: boolean;
  lang?: string;
}

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
  singleCardView: false,
  alphabetizeEncounterSets: false,
  lang: 'system',
};

type SettingAction = SetLanguageChoiceAction | SetTabooSetAction | SetSingleCardViewAction | SetAlphabetizeEncounterSetsAction | CardFetchSuccessAction;


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SettingAction
): SettingsState {
  switch (action.type) {
    case SET_LANGUAGE_CHOICE: {
      return {
        ...state,
        lang: action.choiceLang,
      };
    }
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
    case CARD_FETCH_SUCCESS: {
      return {
        ...state,
        lang: action.choiceLang,
      };
    }
    default: {
      return state;
    }
  }
}
