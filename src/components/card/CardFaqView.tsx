import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { head } from 'lodash';
import { connect } from 'react-redux';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import CardTextComponent from './CardTextComponent';
import Database from '@data/Database';
import DatabaseContext from '@data/DatabaseContext';
import FaqEntry from '@data/FaqEntry';
import connectDb from '@components/data/connectDb';
import { openUrl } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { getFaqEntry } from '@lib/publicApi';
import { getTabooSet, AppState } from '@reducers';
import space, { m } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { useTabooSetId } from '@components/core/hooks';

export interface CardFaqProps {
  id: string;
}

interface Data {
  faqEntries: FaqEntry[];
}

type Props = NavigationProps & CardFaqProps & Data;

function CardFaqView({ id, faqEntries, componentId }: Props) {
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
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

export default connectDb<NavigationProps & CardFaqProps, Data, string>(
  CardFaqView,
  (props: NavigationProps & CardFaqProps) => props.id,
  async(db: Database, code: string) => {
    const qb = await db.faqEntries();
    const faqEntries = await qb.createQueryBuilder('faq')
      .where('faq.code = :code', { code })
      .getMany();
    return {
      faqEntries,
    };
  }
);

const styles = StyleSheet.create({
  container: {
    padding: m,
  },
  error: {
    color: 'red',
  },
});
