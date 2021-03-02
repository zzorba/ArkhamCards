import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import Database from '@data/sqlite/Database';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { fetchCards, dismissUpdatePrompt } from './actions';
import { AppState } from '@reducers';
import { localizedName, getSystemLanguage } from '@lib/i18n';
import space, { l, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useEffectUpdate } from '@components/core/hooks';
import useReduxMigrator from '@components/settings/useReduxMigrator';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import useNetworkStatus from '@components/core/useNetworkStatus';
import { apolloQueueLink } from '@data/apollo/createApolloClient';

const REFETCH_DAYS = 7;
const REPROMPT_DAYS = 3;
const REFETCH_SECONDS = REFETCH_DAYS * 24 * 60 * 60;
const REPROMPT_SECONDS = REPROMPT_DAYS * 24 * 60 * 60;

interface ReduxProps {
  loading?: boolean;
  error?: string;
  currentCardLang: string;
  choiceLang: string;
  useSystemLang: boolean;
  fetchNeeded?: boolean;
  dateFetched?: number;
  dateUpdatePrompt?: number;
}

let CHANGING_LANGUAGE = false;

interface ReduxActionProps {
  fetchCards: (db: Database, cardLang: string, choiceLang: string) => void;
  dismissUpdatePrompt: () => void;
}

interface Props {
  promptForUpdate?: boolean;
  children: JSX.Element;
}

/**
 * Simple component to block children rendering until cards/packs are loaded.
 */
export default function FetchCardsGate({ promptForUpdate, children }: Props): JSX.Element {
  const { db } = useContext(DatabaseContext);
  const [needsMigration, migrating, doMigrate] = useReduxMigrator();
  const { user } = useContext(ArkhamCardsAuthContext);
  const [{ isConnected }] = useNetworkStatus();

  const dispatch = useDispatch();
  const fetchNeeded = useSelector((state: AppState) => state.packs.all.length === 0);
  const currentCardLang = useSelector((state: AppState) => state.cards.card_lang || 'en');
  const { lang: choiceLang } = useContext(LanguageContext);
  const useSystemLang = currentCardLang === 'system';
  const loading = useSelector((state: AppState) => state.packs.loading || state.cards.loading);
  const error = useSelector((state: AppState) => state.packs.error || state.cards.error || undefined);
  const dateFetched = useSelector((state: AppState) => state.packs.dateFetched || undefined);
  const dateUpdatePrompt = useSelector((state: AppState) => state.packs.dateUpdatePrompt || undefined);
  const cardCount = useCallback(async() => {
    const cards = await db.cards();
    return await cards.count();
  }, [db]);

  const doFetch = useCallback(() => {
    dispatch(fetchCards(db, choiceLang, useSystemLang ? 'system' : choiceLang));
  }, [dispatch, db, choiceLang, useSystemLang]);

  const ignoreUpdate = useCallback(() => {
    dispatch(dismissUpdatePrompt());
  }, [dispatch]);

  const langUpdateNeeded = !!(currentCardLang && useSystemLang && choiceLang !== currentCardLang);
  const updateNeeded = useMemo(() => {
    const nowSeconds = (new Date()).getTime() / 1000;
    return (
      !dateFetched ||
      (dateFetched + REFETCH_SECONDS) < nowSeconds
    ) && (
      !dateUpdatePrompt ||
      (dateUpdatePrompt + REPROMPT_SECONDS) < nowSeconds
    );
  }, [dateFetched, dateUpdatePrompt]);

  useEffect(() => {
    if (promptForUpdate) {
      if (user && isConnected) {
        apolloQueueLink.open();
      } else {
        apolloQueueLink.close();
      }
    }
  }, [promptForUpdate, user, isConnected]);

  useEffect(() => {
    if (fetchNeeded) {
      if (promptForUpdate) {
        doFetch();
      }
    }
    if (promptForUpdate) {
      cardCount().then(cardCount => {
        if (cardCount === 0) {
          doFetch();
          return;
        }
        if (langUpdateNeeded && !CHANGING_LANGUAGE) {
          CHANGING_LANGUAGE = true;
          const lang = localizedName(getSystemLanguage());
          Alert.alert(
            t`Download language cards`,
            t`Would you like to download updated cards from ArkhamDB to match your phone's preferred language (${lang})?\n\nYou can override your language preference for this app in Settings.`,
            [
              { text: t`Not now`, style: 'cancel' },
              { text: t`Download now`, onPress: doFetch },
            ]
          );
        } else if (updateNeeded) {
          Alert.alert(
            t`Check for updated cards?`,
            t`It has been more than a week since you checked for new cards.\nCheck for new cards from ArkhamDB?`,
            [
              { text: t`Ask me later`, onPress: ignoreUpdate, style: 'cancel' },
              { text: t`Check for updates`, onPress: doFetch },
            ],
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffectUpdate(() => {
    if (fetchNeeded && promptForUpdate) {
      doFetch();
      return;
    }
  }, [fetchNeeded]);
  const { colors, backgroundStyle, typography } = useContext(StyleContext);
  if (error) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <View style={styles.errorBlock}>
          <Text style={[typography.text, styles.error]}>
            { t`Error loading cards, make sure your network is working.` }
          </Text>
          <Text style={[typography.text, styles.error]}>
            { error }
          </Text>
        </View>
        <BasicButton onPress={doFetch} title={t`Try Again`} />
      </View>
    );
  }
  if (loading || fetchNeeded) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <Text style={typography.text}>
          { t`Loading latest cards...` }
        </Text>
        <ActivityIndicator
          style={styles.spinner}
          size="small"
          animating
          color={colors.lightText}
        />
      </View>
    );
  }
  if (needsMigration) {
    return (
      <View style={[styles.activityIndicatorContainer, backgroundStyle]}>
        <Text style={[typography.header, space.paddingBottomS]}>
          { t`Database migration required` }
        </Text>
        { migrating ? (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            animating
            color={colors.lightText}
          />
        ) : (
          <>
            <Text style={[typography.text, space.paddingM]}>
              { t`This should only take a few seconds and no network is required.` }
            </Text>
            <Text style={[typography.text, space.paddingM]}>
              { t`If you run into any problems with this migration, please contact arkhamcards@gmail.com.` }
            </Text>
            <BasicButton onPress={doMigrate} title={t`Migrate now`} />
          </>
        ) }
      </View>
    );
  }
  return children;
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spinner: {
    height: 80,
  },
  errorBlock: {
    marginLeft: l,
    marginRight: l,
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: s,
  },
});
