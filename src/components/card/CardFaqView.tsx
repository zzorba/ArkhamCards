import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { head } from 'lodash';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import CardTextComponent from './CardTextComponent';
import Database from '@data/sqlite/Database';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { openUrl } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { getFaqEntry } from '@lib/publicApi';
import space, { m } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { useTabooSetId } from '@components/core/hooks';
import useDbData from '@components/core/useDbData';

export interface CardFaqProps {
  id: string;
}

type Props = NavigationProps & CardFaqProps;

export default function CardFaqView({ id, componentId }: Props) {
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
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

  const loadFaq = useCallback(() => {
    if (!loading) {
      setLoading(true);

      getFaqEntry(db, id).then(() => {
        setLoading(false);
        setError(undefined);
      }).catch(() => {
        setLoading(false);
        setError('Problem loading FAQ, please try again later.');
      });
    }
  }, [id, db, loading, setLoading, setError]);

  useEffect(() => {
    // Initial load on mount.
    if (!head(faqEntries)) {
      loadFaq();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tabooSetId = useTabooSetId();
  const linkPressed = useCallback(async(url: string, context: StyleContextType) => {
    await openUrl(url, context, db, componentId, tabooSetId);
  }, [componentId, tabooSetId, db]);

  const faqEntry = head(faqEntries);
  const lastUpdated = useMemo(() => faqEntry && faqEntry.fetched && faqEntry.fetched.toISOString().slice(0, 10), [faqEntry]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, backgroundStyle]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
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

const styles = StyleSheet.create({
  container: {
    padding: m,
  },
  error: {
    color: 'red',
  },
});
