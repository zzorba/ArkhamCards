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
import { SORT_BY_FACTION, SORT_BY_TITLE, SORT_BY_PACK, SortType } from '@actions/types';
import Card, { cardInCollection } from '@data/types/Card';
import { searchMatchesText } from '@components/core/searchHelpers';
import ShowNonCollectionFooter from '@components/cardlist/CardSearchResultsComponent/ShowNonCollectionFooter';
import { getPacksInCollection, AppState } from '@reducers';
import space, { s } from '@styles/space';
import { searchBoxHeight } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { CUSTOM_INVESTIGATOR } from '@app_constants';
import { useInvestigatorCards, usePlayerCards, useToggles } from '@components/core/hooks';
import CompactInvestigatorRow, { AnimatedCompactInvestigatorRow } from '@components/core/CompactInvestigatorRow';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';

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
  return (
    <View style={space.paddingS} key={section.title}>
      <CardDetailSectionHeader title={section.title} color="dark" normalCase />
    </View>
  );
}

function investigatorToCode(investigator: Card) {
  return investigator.code;
}

function Header() {
  const { fontScale } = useContext(StyleContext);
  if (Platform.OS === 'android') {
    return <View style={{ height: searchBoxHeight(fontScale) }} />;
  }
  return null;
}

function CustomInvestigatorRow({ investigator, onInvestigatorPress, children }: { investigator: Card; onInvestigatorPress: (card: Card) => void; children: React.ReactNode }) {
  const { width } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onInvestigatorPress(investigator);
  }, [onInvestigatorPress, investigator]);
  if (!children) {
    return (
      <View style={[space.paddingSideS, space.paddingVerticalXs]}>
        <TouchableOpacity onPress={onPress}>
          <CompactInvestigatorRow
            investigator={investigator}
            width={width - s * 2}
          />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={[space.paddingSideS, space.paddingVerticalXs]}>
      <TouchableOpacity onPress={onPress}>
        <AnimatedCompactInvestigatorRow
          disabled
          open
          investigator={investigator}
          width={width - s * 2}
        >
          { children }
        </AnimatedCompactInvestigatorRow>
      </TouchableOpacity>
    </View>
  );
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
  const { fontScale, typography } = useContext(StyleContext);
  const cards = usePlayerCards();
  const investigators = useInvestigatorCards();

  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
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
  const deckbuildingDetails = useCallback((investigator: Card): React.ReactNode => {
    if (!cards || hideDeckbuildingRules || !investigator.deck_requirements) {
      return null;
    }
    return (
      <View style={[styles.column, space.paddingBottomS, space.paddingLeftS]}>
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
      <CustomInvestigatorRow key={item.code} investigator={item} onInvestigatorPress={onInvestigatorPress}>
        { deckbuildingDetails(item) }
      </CustomInvestigatorRow>
    );
  }, [onInvestigatorPress, deckbuildingDetails]);

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
          if (i.code === CUSTOM_INVESTIGATOR) {
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
        if (i.pack_code && (i.pack_code === 'core' || ignore_collection || cardInCollection(i, in_collection))) {
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
  }, [investigators, in_collection, ignore_collection, showNonCollection, searchTerm, filterInvestigators, onlyInvestigators, sort]);

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
        noBorder
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
  const searchBarHeight = searchBoxHeight(fontScale);
  return (
    <CollapsibleSearchBox
      prompt={t`Search`}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      advancedOptions={searchOptions}
    >
      { onScroll => (
        <SectionList
          contentInset={Platform.OS === 'ios' ? { top: searchBarHeight } : undefined}
          contentOffset={Platform.OS === 'ios' ? { x: 0, y: -searchBarHeight } : undefined}
          onScroll={onScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          sections={groupedInvestigators}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={renderSectionFooter}
          ListHeaderComponent={Header}
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
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});
