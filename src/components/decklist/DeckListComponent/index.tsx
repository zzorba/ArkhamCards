import React, { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find, filter, map, sortBy, partition, flatMap, uniq } from 'lodash';
import { t } from 'ttag';

import DeckList from './DeckList';
import { Campaign } from '@actions/types';
import Card from '@data/types/Card';
import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import space, { s, m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { ScrollView } from 'react-native-gesture-handler';
import { Toggles, useToggles } from '@components/core/hooks';
import { TagChicletButton } from '@components/deck/TagChiclet';
import ArkhamButton from '@components/core/ArkhamButton';

interface Props {
  deckIds: MiniDeckT[];
  deckToCampaign?: { [uuid: string]: Campaign };
  deckClicked: (deck: LatestDeckT, investigator: Card | undefined) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  connectionProblemBanner?: React.ReactNode;
  customFooter?: ReactNode;
  searchOptions?: SearchOptions;
  isEmpty?: boolean;
}

function useDeckTagPile(deckIds: MiniDeckT[], syncToggles: (toggles: Toggles) => void): [React.ReactNode, () => void] {
  const delayedSync = useCallback((toggles: Toggles) => {
    setTimeout(() => {
      syncToggles(toggles);
    }, 100);
  }, [syncToggles]);
  const [selection, onSelectTag,, setTags] = useToggles({}, delayedSync);
  const [selectedTags, otherTags] = useMemo(() => {
    const allTags = uniq(flatMap(deckIds, d => d.tags || []));
    const [selected, other] = partition(
      sortBy(allTags, t => Card.factionCodeToName(t, t)),
      t => !!selection[t]
    );
    return [selected, other];
  }, [deckIds, selection]);
  const possibleOtherTags = useMemo(() => {
    if (selectedTags.length === 0) {
      return otherTags;
    }
    const s = new Set(selectedTags);
    const eligibleDecks = filter(deckIds, d => !!find(d.tags, t => s.has(t)));
    const eligibleTags = new Set(flatMap(eligibleDecks, d => d.tags || []));
    return filter(otherTags, t => eligibleTags.has(t));
  }, [selectedTags, otherTags, deckIds]);
  const clear = useCallback(() => setTags({}), [setTags]);
  return [(
    <>
      { !!selectedTags.length && (
        <View style={[{ flexDirection: 'column' }, space.paddingTopS]}>
          <ScrollView overScrollMode="never" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[space.paddingSideXs, { flexDirection: 'row', alignItems: 'center' }]}>
            { map(selectedTags, t => <TagChicletButton key={t} selected onSelectTag={onSelectTag} tag={t} showIcon />) }
          </ScrollView>
        </View>
      ) }
      { !!possibleOtherTags.length && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[space.paddingTopS, space.paddingSideXs]}>
          { map(possibleOtherTags, t => <TagChicletButton key={t} selected={false} onSelectTag={onSelectTag} tag={t} />) }
        </ScrollView>
      ) }
    </>
  ), clear];
}

export default function DeckListComponent({
  deckIds,
  deckToCampaign,
  deckClicked,
  onRefresh,
  connectionProblemBanner,
  refreshing,
  customFooter,
  searchOptions,
  isEmpty,
}: Props) {
  const { width, typography } = useContext(StyleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const handleDeckClick = useCallback((deck: LatestDeckT, investigator: Card | undefined) => {
    Keyboard.dismiss();
    deckClicked(deck, investigator);
  }, [deckClicked]);

  const [selectedTags, setSelectedTags] = useState<Toggles>({});
  const [deckTagNode, clearSelectedTags] = useDeckTagPile(deckIds, setSelectedTags);
  const header = useMemo(() => (
    <View style={styles.header}>
      { !!connectionProblemBanner && connectionProblemBanner }
      { deckTagNode }
    </View>
  ), [deckTagNode, connectionProblemBanner]);
  const tagButton = useMemo(() => {
    if (find(selectedTags, t => !!t)) {
      return (
        <View style={{ flex: 1, width, paddingLeft: 12 }}>
          <ArkhamButton
            icon="filter-clear"
            title={t`Clear tags`}
            onPress={clearSelectedTags}
            grow
          />
        </View>
      )
    }
    return null;
  }, [selectedTags, clearSelectedTags, width]);

  const renderFooter = useCallback((empty: boolean) => {
    if (isEmpty && !refreshing) {
      return (
        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={[typography.text, space.marginBottomM]}>
              { t`No decks yet.\n\nUse the + button to create a new one.` }
            </Text>
          </View>
          { tagButton }
          { customFooter }
        </View>
      );
    }
    if (searchTerm && empty) {
      return (
        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={[typography.text, typography.center, space.marginBottomM]}>
              { t`No matching decks for "${searchTerm}".` }
            </Text>
          </View>
          { tagButton }
          { customFooter }
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        { tagButton }
        { customFooter }
      </View>
    );
  }, [isEmpty, refreshing, customFooter, searchTerm, typography, tagButton]);
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
          selectedTags={selectedTags}
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
    alignItems: 'flex-start',
  },
  footerText: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
