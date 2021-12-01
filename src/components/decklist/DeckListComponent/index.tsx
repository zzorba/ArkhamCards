import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import DeckList from './DeckList';
import { Campaign } from '@actions/types';
import Card from '@data/types/Card';
import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';

interface Props {
  deckIds: MiniDeckT[];
  deckToCampaign?: { [uuid: string]: Campaign };
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  customHeader?: ReactNode;
  customFooter?: ReactNode;
  searchOptions?: SearchOptions;
  isEmpty?: boolean;
}

export default function DeckListComponent({
  deckIds,
  deckToCampaign,
  deckClicked,
  onRefresh,
  refreshing,
  customHeader,
  customFooter,
  searchOptions,
  isEmpty,
}: Props) {
  const { typography } = useContext(StyleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const handleDeckClick = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    Keyboard.dismiss();
    deckClicked(deck, investigator);
  }, [deckClicked]);
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
          deckIds={deckIds}
          header={header}
          footer={renderFooter}
          searchTerm={searchTerm}
          deckToCampaign={deckToCampaign}
          onRefresh={onRefresh}
          refreshing={refreshing}
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
    alignItems: 'center',
  },
  footerText: {
    padding: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginLeft: s,
    marginRight: s,
  },
});
