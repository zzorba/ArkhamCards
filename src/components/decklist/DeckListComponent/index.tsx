import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { forEach } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import DeckList from './DeckList';
import { Campaign, Deck } from '@actions/types';
import Card from '@data/Card';
import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { fetchPublicDeck } from '@components/deck/actions';
import { getAllDecks, getLangPreference } from '@reducers';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  deckIds: number[];
  deckClicked: (deck: Deck, investigator?: Card) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  deckToCampaign?: { [id: number]: Campaign };
  customHeader?: ReactNode;
  customFooter?: ReactNode;
  searchOptions?: SearchOptions;
  isEmpty?: boolean;
}

export default function DeckListComponent({
  deckIds,
  deckClicked,
  onRefresh,
  refreshing,
  deckToCampaign,
  customHeader,
  customFooter,
  searchOptions,
  isEmpty,
}: Props) {
  const { typography } = useContext(StyleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const decks = useSelector(getAllDecks);
  const lang = useSelector(getLangPreference);
  const handleDeckClick = useCallback((deck: Deck, investigator?: Card) => {
    Keyboard.dismiss();
    deckClicked(deck, investigator);
  }, [deckClicked]);
  const dispatch = useDispatch();
  useEffect(() => {
    forEach(deckIds, deckId => {
      if (!decks[deckId] && deckId > 0) {
        dispatch(fetchPublicDeck(deckId, false));
      }
    });
  },[]);
  const header = useMemo(() => (
    <View style={styles.header}>
      { !!customHeader && customHeader }
    </View>
  ),[customHeader])

  const renderFooter = useCallback((empty: boolean) => {
    if (isEmpty && !refreshing) {
      return (
        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={[styles.emptyStateText, typography.text, space.marginBottomM]}>
              { t`No decks yet.\n\nUse the + button to create a new one.` }
            </Text>
          </View>
          { customFooter }
        </View>
      );
    }
    if (searchTerm && empty) {
      return (
        <View style={[styles.footer, styles.emptyStateText]}>
          <View style={styles.footerText}>
            <Text style={[typography.text, typography.center, space.marginBottomM]}>
              { t`No matching decks for "${searchTerm}".` }
            </Text>
          </View>
          { customFooter }
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        { customFooter }
      </View>
    );
  }, [isEmpty, refreshing, customFooter, searchTerm, typography]);
  return (
    <CollapsibleSearchBox
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      prompt={t`Search decks`}
      advancedOptions={searchOptions}
    >
      { onScroll => (
        <DeckList
          lang={lang}
          deckIds={deckIds}
          header={header}
          footer={renderFooter}
          searchTerm={searchTerm}
          deckToCampaign={deckToCampaign}
          onRefresh={onRefresh}
          refreshing={refreshing}
          decks={decks}
          onScroll={onScroll}
          deckClicked={handleDeckClick}
        />
      ) }
    </CollapsibleSearchBox>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'column',
  },
  footer: {
    width: '100%',
    paddingTop: s,
    paddingBottom: s,
    marginBottom: 60,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  footerText: {
    padding: s,
  },
  emptyStateText: {
    marginLeft: s,
    marginRight: s,
  },
});
