import { forEach, values } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  SET_TABOO_SET,
  SET_MISC_SETTING,
  ENSURE_UUID,
  SetTabooSetAction,
  SetMiscSettingAction,
  EnsureUuidAction,
  SET_THEME,
  SET_FONT_SCALE,
  SetFontScaleAction,
  ReduxMigrationAction,
  LegacyDeck,
  LegacyCampaign,
  LegacyCampaignGuideState,
  ChaosBagResults,
  REDUX_MIGRATION,
} from '@actions/types';
import { migrateCampaigns, migrateDecks, migrateGuides } from '@reducers/migrators';
import { AppState } from '@reducers';

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

export function setSingleCardView(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'single_card',
    value,
  };
}

export function setAlphabetizeEncounterSets(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'alphabetize',
    value,
  };
}


export function setIgnoreCollection(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'ignore_collection',
    value,
  };
}

export function setColorblind(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'colorblind',
    value,
  };
}


export function setJustifyContent(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'justify',
    value,
  };
}


export function setSortQuotes(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'sort_quotes',
    value,
  };
}


export function setBeta1(value: boolean): SetMiscSettingAction {
  return {
    type: SET_MISC_SETTING,
    setting: 'beta1',
    value,
  };
}

export function ensureUuid(): EnsureUuidAction {
  return {
    type: ENSURE_UUID,
  };
}


function migrateV1(
  legacyDecks: { [id: string]: LegacyDeck },
  legacyCampaigns: { [id: string]: LegacyCampaign },
  legacyGuides: { [id: string]: LegacyCampaignGuideState | undefined },
  legacyChaosBags?: { [id: string]: ChaosBagResults | undefined },
): ReduxMigrationAction {
  const [decks, deckMap] = migrateDecks(values(legacyDecks || {}));
  const [campaigns, campaignMapping] = migrateCampaigns(values(legacyCampaigns || {}), deckMap, decks);
  const chaosBags: { [uuid: string]: ChaosBagResults } = {};
  forEach(legacyChaosBags || {}, (bag, id) => {
    if (campaignMapping[id] && bag) {
      chaosBags[campaignMapping[id]] = bag;
    }
  });
  const guides = migrateGuides(legacyGuides || {}, campaignMapping, deckMap);
  return {
    type: REDUX_MIGRATION,
    version: 1,
    decks: values(decks),
    campaigns: values(campaigns),
    guides: values(guides),
    chaosBags,
  };
}

export function migrateReduxV1(): ThunkAction<Promise<true>, AppState, unknown, ReduxMigrationAction> {
  return async(dispatch, getState) => {
    const state = getState();
    const version = state.settings.version || 0;
    if (version < 1) {
      dispatch(migrateV1(state.legacyDecks.all, state.campaigns.all, state.legacyGuides.all, state.campaigns.chaosBagResults));
    }
    return true;
  };
}