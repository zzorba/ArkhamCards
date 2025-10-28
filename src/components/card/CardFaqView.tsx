import React, { useCallback, useContext, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { head } from 'lodash';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { BasicStackParamList, RootStackParamList } from '@navigation/types';
import { t } from 'ttag';

import CardTextComponent from './CardTextComponent';
import Database from '@data/sqlite/Database';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { openUrl } from '@components/nav/helper';
import { getFaqEntry } from '@lib/publicApi';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useTabooSetId } from '@components/core/hooks';
import useDbData from '@components/core/useDbData';
import { useGetCardFaqQuery } from '@generated/graphql/apollo-schema';
import LanguageContext from '@lib/i18n/LanguageContext';
import ApolloClientContext from '@data/apollo/ApolloClientContext';
import { localizedDate } from '@lib/datetime';
import HeaderTitle from '@components/core/HeaderTitle';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export interface CardFaqProps {
  id: string;
  cardName: string;
}

export default function CardFaqView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Card.Faq'>>();
  const navigation = useNavigation();
  const { id, cardName } = route.params;
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, typography } = useContext(StyleContext);

  // Set screen title with subtitle
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle title={cardName} subtitle={t`FAQ`} color={colors.darkText} />
      ),
    });
  }, [navigation, cardName, colors, typography]);
  const { lang } = useContext(LanguageContext);
  const { anonClient } = useContext(ApolloClientContext);
  const { data, loading: dataLoading, refetch } = useGetCardFaqQuery({
    variables: {
      code: id,
      locale: lang,
    },
    skip: lang === 'en',
    fetchPolicy: 'cache-first',
    client: anonClient,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const fetchFaqEntries = useCallback(async(db: Database) => {
    const qb = await db.faqEntries();
    const faqEntries = await qb.createQueryBuilder('faq')
      .where('faq.code = :code', { code: id })
      .getMany();
    return faqEntries;
  }, [id]);
  const faqEntries = useDbData(fetchFaqEntries);

  const loadFaq = useCallback((initial?: boolean) => {
    if (!loading) {
      setLoading(true);
      if (!initial) {
        refetch({
          code: id,
          locale: lang,
        });
      }

      getFaqEntry(db, id).then(() => {
        setLoading(false);
        setError(undefined);
      }).catch(() => {
        setLoading(false);
        setError('Problem loading FAQ, please try again later.');
      });
    }
  }, [id, lang, refetch, db, loading, setLoading, setError]);

  useEffect(() => {
    // Initial load on mount.
    if (!head(faqEntries)) {
      loadFaq(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tabooSetId = useTabooSetId();
  const linkPressed = useCallback(async(url: string) => {
    await openUrl(navigation, url, db, colors, tabooSetId);
  }, [navigation, tabooSetId, db, colors]);

  const faqEntry = useMemo(() => {
    const arkhamDbEntry = head(faqEntries);
    if (lang === 'en') {
      return arkhamDbEntry;
    }
    if (dataLoading) {
      return undefined;
    }
    if (arkhamDbEntry && data && data.faq_by_pk && data.faq_by_pk.faq_texts?.length) {
      return {
        ...arkhamDbEntry,
        text: data.faq_by_pk.faq_texts[0].text,
      };
    }
    return arkhamDbEntry;
  }, [lang, faqEntries, data, dataLoading]);
  const lastUpdated = useMemo(() => faqEntry && faqEntry.fetched && localizedDate(faqEntry.fetched, lang, true), [faqEntry, lang]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, backgroundStyle]}
      refreshControl={
        <RefreshControl
          refreshing={loading || (lang !== 'en' && dataLoading)}
          onRefresh={loadFaq}
          tintColor={colors.lightText}
        />
      }
    >
      <View>
        { !!error && (
          <Text style={[typography.text, styles.error]}>
            { error }
          </Text>
        ) }
        <View>
          { (faqEntry && faqEntry.text) ? (
            <CardTextComponent
              text={faqEntry.text}
              onLinkPress={linkPressed}
            />
          ) : (
            <Text style={typography.text}>
              { loading ? t`Checking for FAQ` : t`No entries at this time.` }
            </Text>
          ) }
        </View>
        { !!lastUpdated && (
          <View style={space.marginTopS}>
            <Text style={typography.text}>
              { t`Last Updated: ${lastUpdated}` }
            </Text>
          </View>
        ) }
      </View>
    </ScrollView>
  );
}


function options<T extends BasicStackParamList>({ route }: { route: RouteProp<T, 'Card.Faq'> }): NativeStackNavigationOptions {
  return {
    title: route.params?.cardName || t`FAQ`,
  };
};
CardFaqView.options = options;

const styles = StyleSheet.create({
  container: {
    padding: m,
  },
  error: {
    color: 'red',
  },
});
