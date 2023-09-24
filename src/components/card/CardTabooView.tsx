import React, { useCallback, useContext, useMemo, useState } from 'react';
import { find, forEach, flatMap, reverse } from 'lodash';
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
import space, { l, m, xs, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import useDbData from '@components/core/useDbData';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers/index';
import DeckButton from '@components/deck/controls/DeckButton';

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
    .where('c.code = :code and c.taboo_set_id > 0 and (c.taboo_placeholder is null or c.taboo_placeholder = false)', { code: id })
    .getMany();
  const allTabooSets = await (await db.tabooSets()).createQueryBuilder().orderBy('id', 'DESC').getMany();
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

function TabooBlock({ taboo, isCurrent }: { taboo: Card; isCurrent?: boolean }) {
  const { typography } = useContext(StyleContext);
  return (
    <>
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
      { !!isCurrent && taboo.taboo_original_text && (
        <>
          <Text style={typography.text}>{t`Original card text`}</Text>
          <View style={styles.gameTextBlock}>
            <CardTextComponent text={taboo.taboo_original_text} />
          </View>
        </>
      ) }
      { !!isCurrent && taboo.taboo_original_back_text && (
        <>
          <Text style={typography.text}>{t`Original card text (back)`}</Text>
          <View style={styles.gameTextBlock}>
            <CardTextComponent text={taboo.taboo_original_back_text} />
          </View>
        </>
      ) }
    </>
  );
}

function TabooVersionBlock({ taboo, tabooSets }: { taboo: Card, tabooSets: TabooSetMap }) {
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
      <TabooBlock taboo={taboo} />
    </View>
  );
}

function TabooSection({ id }: { id: string }) {
  const { typography } = useContext(StyleContext);
  const [showPastVersions, setShowPastVersions] = useState(false);
  const fetch = useCallback((db: Database) => fetchTabooData(db, id), [id]);
  const currentTabooSetId = useSelector((appState: AppState) => appState.settings.currentTabooSetId);

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
  const currentTaboo = currentTabooSetId !== undefined && find(taboos, card => card.taboo_set_id === currentTabooSetId);
  const currentTabooSet = !!currentTabooSetId ? tabooSets[currentTabooSetId] : undefined;
  return (
    <>
      { !!currentTabooSet && (
        <View>
          <Text style={[typography.large, styles.tabooHeader]}>{t`Latest Taboo List: ${currentTabooSet.name} - ${currentTabooSet.date_start}`}</Text>
          { currentTaboo && !currentTaboo.taboo_placeholder ? <TabooBlock taboo={currentTaboo} isCurrent /> : <Text style={typography.text}>{t`This card is no longer on the taboo list.`}</Text> }
        </View>
      ) }
      { !!find(taboos, taboo => taboo.taboo_set_id !== currentTaboo && !taboo.taboo_placeholder) && (
        <View style={space.paddingTopL}>
          { !showPastVersions ?
            <DeckButton icon="taboo" title={t`See taboo list history`} onPress={() => setShowPastVersions(true)} />
            : <Text style={typography.large}>{t`Taboo list history:`}</Text>
          }
          { !!showPastVersions &&
            flatMap(reverse(taboos), taboo => taboo.taboo_set_id !== currentTaboo ? <TabooVersionBlock taboo={taboo} tabooSets={tabooSets} key={taboo.id} /> : null)
          }
        </View>
      ) }
    </>
  );
}

export default function CardTabooView({ id }: Props) {
  const { backgroundStyle } = useContext(StyleContext);
  const text = useMemo(() => [
    t`The List of Taboos is a list of Arkham Horror: The Card Game cards with optional deckbuilding restrictions or text changes. This list is designed to craft a healthy balance between investigator power and scenario difficulty, and to enforce shifts in deckbuilding environments over time.`,
    t`Adhering to The List of Taboos is completely optional. Investigators are not forced to adhere to the restrictions on this list, but if an investigator chooses to do so, they must do so in full (an investigator cannot pick and choose which restrictions to use).`,
    t`You can opt-in to always seeing taboos and buiding decks with them in Settings.`,
  ].join('\n\n'), []);
  return (
    <ScrollView contentContainerStyle={[styles.container, backgroundStyle]}>
      <TabooSection id={id} />
      <CardTextComponent text={text} />
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
