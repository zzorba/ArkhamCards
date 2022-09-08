import { uniq, filter, forEach } from 'lodash';

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
  SET_PLAYBACK_RATE,
  SetPlaybackRateAction,
  SyncDismissOnboardingAction,
  SYNC_DISMISS_ONBOARDING,
} from '@actions/types';
import { LOW_MEMORY_DEVICE } from '@components/DeckNavFooter/constants';

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
  hideCampaignDecks?: boolean;
  hideArkhamDbDecks?: boolean;
  playbackRate?: number | undefined;
  androidOneUiFix?: boolean;
  version?: number;
  customContent?: boolean;
  cardGrid?: boolean;
  draftList?: boolean;
  draftSeparatePacks?: boolean;
  dismissedOnboarding?: string[];
  campaignShowDeckId?: boolean;
  lowMemory?: boolean;
}
export const CURRENT_REDUX_VERSION = 1;

const DEFAULT_SETTINGS_STATE: SettingsState = {
  version: CURRENT_REDUX_VERSION,
  tabooId: undefined,
  singleCardView: false,
  alphabetizeEncounterSets: false,
  colorblind: false,
  ignore_collection: false,
  lang: 'system',
  fontScale: undefined,
  justifyContent: false,
  sortRespectQuotes: false,
  hideCampaignDecks: false,
  androidOneUiFix: false,
  customContent: false,
  dismissedOnboarding: [],
  cardGrid: false,
  draftList: false,
  draftSeparatePacks: false,
  campaignShowDeckId: false,
  lowMemory: false,
};

type SettingAction =
  SetLanguageChoiceAction |
  SetTabooSetAction |
  SetMiscSettingAction |
  CardFetchSuccessAction |
  SetThemeAction |
  SetFontScaleAction |
  ReduxMigrationAction |
  SetPlaybackRateAction |
  SyncDismissOnboardingAction;


export default function(
  state: SettingsState = DEFAULT_SETTINGS_STATE,
  action: SettingAction
): SettingsState {
  switch (action.type) {
    case SYNC_DISMISS_ONBOARDING: {
      let onboarding = [...(state.dismissedOnboarding || [])];
      forEach(action.updates, (value, key) => {
        if (value) {
          onboarding.push(key)
        } else {
          onboarding = filter(onboarding, x => x !== key);
        }
      });
      return {
        ...state,
        dismissedOnboarding: uniq(onboarding),
      };
    }
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
    case SET_PLAYBACK_RATE:
      return {
        ...state,
        playbackRate: action.rate,
      };
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
        case 'hide_campaign_decks':
          return {
            ...state,
            hideCampaignDecks: action.value,
          };
        case 'hide_arkhamdb_decks':
          return {
            ...state,
            hideArkhamDbDecks: action.value,
          };
        case 'android_one_ui_fix':
          return {
            ...state,
            androidOneUiFix: action.value,
          };
        case 'custom_content':
          return {
            ...state,
            customContent: action.value,
          };
        case 'card_grid':
          return {
            ...state,
            cardGrid: action.value,
          };
        case 'draft_grid':
          return {
            ...state,
            draftList: !action.value,
          };
        case 'draft_from_collection':
          return {
            ...state,
            draftSeparatePacks: !action.value,
          };
        case 'campaign_show_deck_id':
          return {
            ...state,
            campaignShowDeckId: action.value,
          };
        case 'low_memory':
          return {
            ...state,
            lowMemory: LOW_MEMORY_DEVICE ? !action.value : action.value,
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
