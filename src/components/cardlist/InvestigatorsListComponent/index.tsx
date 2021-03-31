import React, { useCallback, useContext, useMemo, useState } from 'react';
import { filter, forEach, map, sortBy } from 'lodash';
import {
  Keyboard,
  Platform,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import CollapsibleSearchBox, { SearchOptions } from '@components/core/CollapsibleSearchBox';
import InvestigatorRow from '@components/core/InvestigatorRow';
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK, SortType } from '@actions/types';
import Card, { cardInCollection } from '@data/Card';
import { searchMatchesText } from '@components/core/searchHelpers';
import ShowNonCollectionFooter from '@components/cardlist/CardSearchResultsComponent/ShowNonCollectionFooter';
import { getPacksInCollection } from '@reducers';
import space from '@styles/space';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import { useInvestigatorCards, usePlayerCards, useToggles } from '@components/core/hooks';

interface Props {
  componentId: string;
  hideDeckbuildingRules?: boolean;
  sort: SortType;
  onPress: (investigator: Card) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
  searchOptions?: SearchOptions;
  customFooter?: React.ReactNode;
}

interface Section extends SectionListData<Card> {
  title: string;
  id: string;
  data: Card[];
  nonCollectionCount: number;
}

function headerForInvestigator(
  sort: SortType,
  investigator?: Card
): string {
  if (!investigator) {
    return t`N/A`;
  }
  switch (sort) {
    case SORT_BY_FACTION:
      return investigator.faction_name || t`N/A`;
    case SORT_BY_TITLE:
      return t`All Investigators`;
    case SORT_BY_PACK:
      return investigator.pack_name || t`N/A`;
    default:
      return t`N/A`;
  }
}

function renderSectionHeader({ section }: { section: SectionListData<Card> }) {
  return <CardSectionHeader section={{ title: section.title }} />;
}

function investigatorToCode(investigator: Card) {
  return investigator.code;
}

function renderHeader() {
  if (Platform.OS === 'android') {
    return <View style={styles.searchBarPadding} />;
  }
  return null;
}

export default function InvestigatorsListComponent({
  componentId,
  hideDeckbuildingRules,
  sort,
  onPress,
  filterInvestigators = [],
  onlyInvestigators,
  searchOptions,
  customFooter,
}: Props) {
  const { typography } = useContext(StyleContext);
  const cards = usePlayerCards();
  const investigators = useInvestigatorCards();

  const in_collection = useSelector(getPacksInCollection);
  const [showNonCollection,, setShowNonCollection] = useToggles({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const onInvestigatorPress = useCallback((investigator: Card) => {
    onPress(investigator);
  }, [onPress]);

  const showEditCollection = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }, [componentId]);

  const showNonCollectionCards = useCallback((id: string) => {
    Keyboard.dismiss();
    setShowNonCollection(id, true);
  }, [setShowNonCollection]);
  const deckbuildingDetails = useCallback((investigator: Card) => {
    if (!cards || hideDeckbuildingRules || !investigator.deck_requirements) {
      return null;
    }
    return (
      <View style={[styles.column, space.paddingBottomS]}>
        <Text style={typography.text}>
          { t`${investigator.deck_requirements.size} Cards` }
        </Text>
        { map(investigator.deck_requirements.card, req => {
          const card = req.code && cards[req.code];
          if (!card) {
            return (
              <Text key={req.code} style={typography.small}>
                { t`Unknown card: ${req.code}` }
              </Text>
            );
          }
          return (
            <Text key={req.code} style={typography.small}>
              { card.quantity }x { card.name }
            </Text>
          );
        }) }
      </View>
    );
  }, [cards, hideDeckbuildingRules, typography]);

  const renderItem = useCallback(({ item }: SectionListRenderItemInfo<Card>) => {
    return (
      <InvestigatorRow
        key={item.code}
        investigator={item}
        onPress={onInvestigatorPress}
        button={deckbuildingDetails(item)}
        bigImage={!hideDeckbuildingRules}
      />
    );
  }, [hideDeckbuildingRules, onInvestigatorPress, deckbuildingDetails]);

  const groupedInvestigators = useMemo((): Section[] => {
    const onlyInvestigatorsSet = onlyInvestigators ? new Set(onlyInvestigators) : undefined;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const allInvestigators = sortBy(
      filter(
        investigators,
        i => {
          if (!i) {
            return false;
          }
          if (i.altArtInvestigator || i.mythos_card) {
            return false;
          }
          if (filterInvestigatorsSet.has(i.code)) {
            return false;
          }
          if (onlyInvestigatorsSet && !onlyInvestigatorsSet.has(i.code)) {
            return false;
          }
          return searchMatchesText(
            searchTerm,
            [i.name, i.faction_name || '', i.traits || '']
          );
        }),
      investigator => {
        if (!investigator) {
          return '';
        }
        switch (sort) {
          case SORT_BY_FACTION:
            return investigator.factionCode();
          case SORT_BY_TITLE:
            return investigator.name;
          case SORT_BY_PACK:
          default:
            return investigator.code;
        }
      });

    const results: Section[] = [];
    let nonCollectionCards: Card[] = [];
    let currentBucket: Section | undefined = undefined;
    forEach(allInvestigators, i => {
      const header = headerForInvestigator(sort, i);
      if (!currentBucket || currentBucket.title !== header) {
        if (currentBucket && nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, c => {
              currentBucket && currentBucket.data.push(c);
            });
          }
          currentBucket.nonCollectionCount = nonCollectionCards.length;
          nonCollectionCards = [];
        }
        currentBucket = {
          title: header,
          id: `${sort}-${results.length}`,
          data: [],
          nonCollectionCount: 0,
        };
        results.push(currentBucket);
      }
      if (i) {
        if (i.pack_code && cardInCollection(i, in_collection)) {
          currentBucket.data.push(i);
        } else {
          nonCollectionCards.push(i);
        }
      }
    });

    // One last snap of the non-collection cards
    if (currentBucket) {
      if (nonCollectionCards.length > 0) {
        // @ts-ignore
        if (showNonCollection[currentBucket.id]) {
          forEach(nonCollectionCards, c => {
            currentBucket && currentBucket.data.push(c);
          });
        }
        // @ts-ignore
        currentBucket.nonCollectionCount = nonCollectionCards.length;
        nonCollectionCards = [];
      }
    }
    const customInvestigator = investigators && investigators[CUSTOM_INVESTIGATOR];
    if (customInvestigator) {
      results.push({
        title: t`Custom`,
        id: 'custom',
        data: [customInvestigator],
        nonCollectionCount: 0,
      });
    }
    return results;
  }, [investigators, in_collection, showNonCollection, searchTerm, filterInvestigators, onlyInvestigators, sort]);

  const renderSectionFooter = useCallback(({ section }: { section: SectionListData<Card> }) => {
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <ArkhamButton
          icon="edit"
          title={t`Edit Collection`}
          onPress={showEditCollection}
        />
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        title={ngettext(
          msgid`Show ${section.nonCollectionCount} non-collection investigator`,
          `Show ${section.nonCollectionCount} non-collection investigators`,
          section.nonCollectionCount
        )}
        onPress={showNonCollectionCards}
      />
    );
  }, [showNonCollection, showNonCollectionCards, showEditCollection]);

  const renderFooter = useCallback(() => {
    if (searchTerm && groupedInvestigators.length === 0) {
      return (
        <>
          { !!customFooter && customFooter }
          <View style={[space.marginS, styles.footer]}>
            <Text style={[typography.text, typography.center]}>
              { t`No matching investigators for "${searchTerm}".` }
            </Text>
          </View>
        </>
      );
    }
    return (
      <>
        { !!customFooter && customFooter }
        <View style={styles.footer} />
      </>
    );
  }, [typography, customFooter, searchTerm, groupedInvestigators]);

  return (
    <CollapsibleSearchBox
      prompt={t`Search`}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      advancedOptions={searchOptions}
    >
      { onScroll => (
        <SectionList
          contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}
          onScroll={onScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          sections={groupedInvestigators}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          renderItem={renderItem}
          initialNumToRender={24}
          keyExtractor={investigatorToCode}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          scrollEventThrottle={1}
        />
      ) }
    </CollapsibleSearchBox>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginBottom: 60,
  },
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});
