import {
  SET_TABOO_SET,
  SET_MISC_SETTING,
  SET_LANGUAGE_CHOICE,
  SetTabooSetAction,
  SetMiscSettingAction,
  SetLanguageChoiceAction,
  CardFetchSuccessAction,
  CARD_FETCH_SUCCESS,
  SET_THEME,
  SetThemeAction,
  SET_FONT_SCALE,
  SetFontScaleAction,
  ReduxMigrationAction,
  REDUX_MIGRATION,
} from '@actions/types';

interface SettingsState {
  tabooId?: number;
  singleCardView?: boolean;
  ignore_collection?: boolean;
  alphabetizeEncounterSets?: boolean;
  colorblind?: boolean;
  lang?: string;
  theme?: 'dark' | 'light';
  fontScale?: number;
  justifyContent?: boolean;
  sortRespectQuotes?: boolean;
  beta1?: boolean;

  version?: number;
}
export const CURRENT_REDUX_VERSION = 1;

const DEFAULT_SETTINGS_STATE: SettingsState = {
  tabooId: undefined,
  singleCardView: false,
  alphabetizeEncounterSets: false,
  colorblind: false,
  ignore_collection: false,
  lang: 'system',
  fontScale: undefined,
  justifyContent: false,
  sortRespectQuotes: false,
  version: CURRENT_REDUX_VERSION,
};

type SettingAction = SetLanguageChoiceAction | SetTabooSetAction | SetMiscSettingAction | CardFetchSuccessAction | SetThemeAction | SetFontScaleAction | ReduxMigrationAction;


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SettingAction
): SettingsState {
  switch (action.type) {
    case REDUX_MIGRATION:
      return {
        ...state,
        version: action.version,
      };
    case SET_FONT_SCALE:
      return {
        ...state,
        fontScale: action.fontScale,
      };
    case SET_THEME: {
      return {
        ...state,
        theme: action.theme === 'system' ? undefined : action.theme,
      };
    }
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
    case SET_MISC_SETTING:
      switch (action.setting) {
        case 'alphabetize':
          return {
            ...state,
            alphabetizeEncounterSets: action.value,
          };
        case 'ignore_collection':
          return {
            ...state,
            ignore_collection: action.value,
          };
        case 'single_card':
          return {
            ...state,
            singleCardView: action.value,
          };
        case 'colorblind':
          return {
            ...state,
            colorblind: action.value,
          };
        case 'justify':
          return {
            ...state,
            justifyContent: action.value,
          };
        case 'sort_quotes':
          return {
            ...state,
            sortRespectQuotes: action.value,
          };
        case 'beta1':
          return {
            ...state,
            beta1: action.value,
          };
      }
      return state;
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
