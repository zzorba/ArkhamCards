import React, { useCallback, useContext } from 'react';
import { forEach, map } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Database from '@data/sqlite/Database';
import { t } from 'ttag';

import Card from '@data/types/Card';
import TabooSet from '@data/types/TabooSet';
import CardTextComponent from './CardTextComponent';
import { NavigationProps } from '@components/nav/types';
import { l, m, xs, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import useDbData from '@components/core/useDbData';

export interface CardTabooProps {
  id: string;
}

interface TabooSetMap {
  [id: number]: TabooSet;
}

interface TabooData {
  card?: Card;
  taboos: Card[];
  tabooSets: TabooSetMap;
}

type Props = NavigationProps & CardTabooProps;

async function fetchTabooData(db: Database, id: string): Promise<TabooData> {
  const cardsQuery = await db.cardsQuery();
  const card = await cardsQuery
    .where('c.code = :code and (c.taboo_set_id = 0 or c.taboo_set_id is null)', { code: id })
    .getOne();
  const taboos = await cardsQuery
    .where('c.code = :code and c.taboo_set_id > 0', { code: id })
    .getMany();
  const allTabooSets = await (await db.tabooSets()).createQueryBuilder().orderBy('id', 'ASC').getMany();
  const tabooSets: TabooSetMap = {};
  forEach(allTabooSets, tabooSet => {
    tabooSets[tabooSet.id] = tabooSet;
  });
  return {
    card,
    taboos,
    tabooSets,
  };
}

function TabooBlock({ taboo, tabooSets }: { taboo: Card, tabooSets: TabooSetMap }) {
  const { typography } = useContext(StyleContext);
  const tabooSet = taboo.taboo_set_id && tabooSets[taboo.taboo_set_id];
  if (taboo.taboo_placeholder) {
    return null;
  }

  return (
    <View>
      { !!tabooSet && (
        <Text style={[typography.large, styles.tabooHeader]}>
          { `${tabooSet.name} - ${tabooSet.date_start}` }
        </Text>
      ) }
      <View style={styles.gameTextBlock}>
        { !!taboo.extra_xp && (
          <Text style={typography.text}>
            { taboo.extra_xp > 0 ?
              t`Additional XP: ${taboo.extra_xp}.` :
              t`XP Discount: ${taboo.extra_xp}.` }
          </Text>
        ) }
        { !!taboo.taboo_text_change && (
          <CardTextComponent text={taboo.taboo_text_change} />
        ) }
      </View>
    </View>
  );
}

function TabooSection({ id }: { id: string }) {
  const fetch = useCallback((db: Database) => fetchTabooData(db, id), [id]);
  const tabooData = useDbData(fetch);
  if (!tabooData) {
    return null;
  }
  const {
    card,
    taboos,
    tabooSets,
  } = tabooData;
  if (!card) {
    return null;
  }
  return (
    <>
      { map(taboos, taboo => <TabooBlock taboo={taboo} tabooSets={tabooSets} key={taboo.id} />) }
    </>
  );
}

export default function CardTabooView({ id }: Props) {
  const { backgroundStyle, typography } = useContext(StyleContext);
  return (
    <ScrollView contentContainerStyle={[styles.container, backgroundStyle]}>
      <TabooSection id={id} />
      <Text style={[typography.small, styles.header]}>
        { t`The List of Taboos is a list of Arkham Horror: The Card Game cards with optional deckbuilding restrictions or text changes. This list is designed to craft a healthy balance between investigator power and scenario difficulty, and to enforce shifts in deckbuilding environments over time.` }
        { '\n\n' }
        { t`Adhering to The List of Taboos is completely optional. Investigators are not forced to adhere to the restrictions on this list, but if an investigator chooses to do so, they must do so in full (an investigator cannot pick and choose which restrictions to use).` }
        { '\n\n' }
        { t`You can opt-in to always seeing taboos and buiding decks with them in Settings.` }
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: m,
  },
  header: {
    marginTop: l,
    marginBottom: m,
  },
  gameTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
    paddingTop: m,
    paddingBottom: m,
  },
  tabooHeader: {
    marginTop: s,
    marginBottom: m,
  },
});
