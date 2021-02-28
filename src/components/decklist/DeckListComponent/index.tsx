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
import { Campaign, Deck, DeckId } from '@actions/types';
import Card from '@data/types/Card';
import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { fetchPublicDeck } from '@components/deck/actions';
import { getAllDecks, getDeck } from '@reducers';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import LanguageContext from '@lib/i18n/LanguageContext';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { useCreateDeckActions } from '@data/remote/decks';

interface Props {
  deckIds: DeckId[];
  deckClicked: (deck: Deck, investigator?: Card) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  deckToCampaign?: { [uuid: string]: Campaign };
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
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(ArkhamCardsAuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const decks = useSelector(getAllDecks);
  const handleDeckClick = useCallback((deck: Deck, investigator?: Card) => {
    Keyboard.dismiss();
    deckClicked(deck, investigator);
  }, [deckClicked]);
  const dispatch = useDispatch();
  const createDeckActions = useCreateDeckActions();
  useEffect(() => {
    // Only do this once, even though it might want to be done a second time.
    forEach(deckIds, deckId => {
      if (!getDeck(decks, deckId) && !deckId.local) {
        dispatch(fetchPublicDeck(user, createDeckActions, deckId, false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = useMemo(() => (
    <View style={styles.header}>
      { !!customHeader && customHeader }
    </View>
  ), [customHeader]);

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
