import { useContext, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { keys, forEach, union } from 'lodash';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useGetSettingsQuery, useUpdateSettingAlphabetizeMutation, useUpdateSettingCampaignShowDeckIdMutation, useUpdateSettingColorblindMutation, useUpdateSettingCustomContentMutation, useUpdateSettingIgnoreCollectionMutation, useUpdateSettingSingleCardMutation, useUpsertSettingsMutation, useUpdateSettingSortQuotesMutation, useUpdateInCollectionMutation, useUpdateShowSpoilersMutation, useUpdateOnboardingMutation } from '@generated/graphql/apollo-schema';
import { AppState } from '@reducers';
import { setMiscSetting } from '@components/settings/actions';
import { MiscRemoteSetting, SYNC_DISMISS_ONBOARDING } from '@actions/types';
import { syncPackSettings } from '@actions';
import { useEffectUpdate } from '@components/core/hooks';

export function useRemoteSettings(live?: boolean): void {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const downSynced = useRef(false);
  const synced = useRef(false);
  const { data, loading, error, refetch } = useGetSettingsQuery({
    variables: {
      userId: userId || '',
    },
    skip: !userId,
    fetchPolicy: live ? 'network-only' : 'cache-only',
  });

  useEffectUpdate(() => {
    if (userId) {
      refetch({ userId });
    } else {
      // Logged out, so clear the settings so we reload them.
      downSynced.current = false;
    }
  }, [userId]);

  const [upsertSettings] = useUpsertSettingsMutation();
  const settings = useSelector((state: AppState) => state.settings);
  const in_collection = useSelector((state: AppState) => state.packs.in_collection);
  const show_spoilers = useSelector((state: AppState) => state.packs.show_spoilers);
  useEffect(() => {
    if (live && userId && !loading && !error && !synced.current) {
      if (!data?.user_settings_by_pk) {
        const onboarding: { [code: string]: boolean } = {};
        forEach(settings.dismissedOnboarding || [], code => {
          onboarding[code] = true;
        });
        // Seems like we don't have a result, so we should sync something over.
        synced.current = true;
        upsertSettings({
          variables: {
            userId,
            in_collection,
            show_spoilers,
            alphabetize: !!settings.alphabetizeEncounterSets,
            colorblind: !!settings.colorblind,
            ignore_collection: !!settings.ignore_collection,
            single_card: !!settings.singleCardView,
            sort_quotes: !!settings.sortRespectQuotes,
            custom_content: !!settings.customContent,
            campaign_show_deck_id: !!settings.campaignShowDeckId,
            onboarding,
          },
        });
      }
    }
  }, [live, userId, data, loading, error, upsertSettings, settings, in_collection, show_spoilers]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (live && userId && !error && !loading && data?.user_settings_by_pk && !downSynced.current) {
      downSynced.current = true;
      const remoteSettings = data.user_settings_by_pk;
      if (!!remoteSettings.alphabetize !== !!settings.alphabetizeEncounterSets) {
        dispatch(setMiscSetting('alphabetize', !!remoteSettings.alphabetize));
      }
      if (!!remoteSettings.colorblind !== !!settings.colorblind) {
        dispatch(setMiscSetting('colorblind', !!remoteSettings.colorblind));
      }
      if (!!remoteSettings.ignore_collection !== !!settings.ignore_collection) {
        dispatch(setMiscSetting('ignore_collection', !!remoteSettings.ignore_collection));
      }
      if (!!remoteSettings.single_card !== !!settings.singleCardView) {
        dispatch(setMiscSetting('single_card', !!remoteSettings.single_card));
      }
      if (!!remoteSettings.sort_quotes !== !!settings.sortRespectQuotes) {
        dispatch(setMiscSetting('sort_quotes', !!remoteSettings.sort_quotes));
      }
      if (!!remoteSettings.custom_content !== !!settings.customContent) {
        dispatch(setMiscSetting('custom_content', !!remoteSettings.custom_content));
      }
      if (!!remoteSettings.campaign_show_deck_id !== !!settings.campaignShowDeckId) {
        dispatch(setMiscSetting('campaign_show_deck_id', !!remoteSettings.campaign_show_deck_id));
      }
      if (remoteSettings.in_collection) {
        const updates: { [code: string]: boolean } = {};
        forEach(
          union(keys(remoteSettings.in_collection), keys(in_collection)),
          code => {
            const remoteValue: boolean = !!remoteSettings.in_collection[code];
            if (remoteValue !== !!in_collection[code]) {
              updates[code] = remoteValue;
            }
          });
        if (keys(updates).length) {
          dispatch(syncPackSettings('in_collection', updates))
        }
      }
      if (remoteSettings.show_spoilers) {
        const updates: { [code: string]: boolean } = {};
        forEach(
          union(keys(remoteSettings.show_spoilers), keys(show_spoilers)),
          code => {
            const remoteValue: boolean = !!remoteSettings.show_spoilers[code];
            if (remoteValue !== !!show_spoilers[code]) {
              updates[code] = remoteValue;
            }
          });
        if (keys(updates).length) {
          dispatch(syncPackSettings('show_spoilers', updates))
        }
      }
      if (remoteSettings.onboarding) {
        const updates: { [code: string]: boolean } = {};
        const existing = new Set(settings.dismissedOnboarding || []);
        forEach(
          union(keys(remoteSettings.onboarding), settings.dismissedOnboarding),
          code => {
            const remoteValue: boolean = !!remoteSettings.onboarding[code];
            if (remoteValue !== existing.has(code)) {
              updates[code] = remoteValue;
            }
          });
        if (keys(updates).length) {
          dispatch({
            type: SYNC_DISMISS_ONBOARDING,
            updates,
          });
        }
      }
    }
    // Intentionally don't listen to 'settings' here, only changes to 'remoteSettings'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, userId, data, error, loading]);
}

export function useUpdateRemotePack() {
  const { userId } = useContext(ArkhamCardsAuthContext);

  const [updateInCollection] = useUpdateInCollectionMutation();
  const [updatePackSpoiler] = useUpdateShowSpoilersMutation();
  return useCallback((type: 'in_collection' | 'show_spoilers', update: { [code: string]: boolean}) => {
    if (userId) {
      if (type === 'in_collection') {
        updateInCollection({ variables: { userId, update } });
      } else {
        updatePackSpoiler({ variables: { userId, update } });
      }
    }
  }, [updateInCollection, updatePackSpoiler, userId]);
}

export function useUpdateOnboarding() {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [updateOnboarding] = useUpdateOnboardingMutation();
  return useCallback((update: { [code: string]: boolean}) => {
    if (userId) {
      updateOnboarding({ variables: { userId, update } });
    }
  }, [updateOnboarding, userId]);
}

export function useUpdateRemoteSetting() {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [updateAlphabetize] = useUpdateSettingAlphabetizeMutation();
  const [updateColorblind] = useUpdateSettingColorblindMutation();
  const [updateCustomContent] = useUpdateSettingCustomContentMutation();
  const [updateSingleCard] = useUpdateSettingSingleCardMutation();
  const [updateIgnoreCollection] = useUpdateSettingIgnoreCollectionMutation();
  const [updateSortQuotes] = useUpdateSettingSortQuotesMutation();
  const [updateCampaignShowDeckId] = useUpdateSettingCampaignShowDeckIdMutation();

  return useCallback((setting: MiscRemoteSetting, value: boolean) => {
    if (userId) {
      const update = { variables: { userId, value } };
      switch (setting) {
        case 'alphabetize': updateAlphabetize(update); break;
        case 'campaign_show_deck_id': updateCampaignShowDeckId(update); break;
        case 'colorblind': updateColorblind(update);
        case 'custom_content': updateCustomContent(update);
        case 'ignore_collection': updateIgnoreCollection(update);
        case 'sort_quotes': updateSortQuotes(update);
        case 'single_card': updateSingleCard(update);
      }
    }
  }, [userId, updateAlphabetize, updateColorblind, updateCustomContent, updateSingleCard, updateIgnoreCollection, updateSortQuotes, updateCampaignShowDeckId]);
}