import {
  SET_TABOO_SET,
  SET_SINGLE_CARD_VIEW,
  SET_ALPHABETIZE_ENCOUNTER_SETS,
  ENSURE_UUID,
  SetTabooSetAction,
  SetSingleCardViewAction,
  SetAlphabetizeEncounterSetsAction,
  EnsureUuidAction,
  SET_THEME,
  SET_FONT_SCALE,
  SetFontScaleAction,
} from '@actions/types';

export function setTabooSet(tabooId?: number): SetTabooSetAction {
  return {
    type: SET_TABOO_SET,
    tabooId,
  };
}

export function setTheme(theme: 'light' | 'dark' | 'system') {
  return {
    type: SET_THEME,
    theme,
  };
}


export function setFontSize(fontScale: number): SetFontScaleAction {
  return {
    type: SET_FONT_SCALE,
    fontScale,
  };
}

export function setSingleCardView(value: boolean): SetSingleCardViewAction {
  return {
    type: SET_SINGLE_CARD_VIEW,
    singleCardView: value,
  };
}

export function setAlphabetizeEncounterSets(value: boolean): SetAlphabetizeEncounterSetsAction {
  return {
    type: SET_ALPHABETIZE_ENCOUNTER_SETS,
    alphabetizeEncounterSets: value,
  };
}

export function ensureUuid(): EnsureUuidAction {
  return {
    type: ENSURE_UUID,
  };
}
