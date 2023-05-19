import React, { useCallback, useContext, useMemo, useState } from 'react';
import { filter, forEach } from 'lodash';
import {
  Keyboard,
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
import { getPacksInCollection } from '@reducers';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import { useAllInvestigators, useSettingValue, useToggles } from '@components/core/hooks';
import CompactInvestigatorRow, { AnimatedCompactInvestigatorRow } from '@components/core/CompactInvestigatorRow';
import { TouchableShrink } from '@components/core/Touchables';
import CardDetailSectionHeader from '@components/card/CardDetailView/CardDetailSectionHeader';
import FactionIcon from '@icons/FactionIcon';
import ArkhamLargeList from '@components/core/ArkhamLargeList';
import AppIcon from '@icons/AppIcon';

interface Props {
  componentId: string;
  hideDeckbuildingRules?: boolean;
  sort: SortType[];
  onPress: (investigator: Card) => void;
  filterInvestigator?: (investigator: Card) => boolean;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
  searchOptions?: SearchOptions;
  customFooter?: React.ReactNode;
  includeParallelInvestigators?: boolean;
}

interface CardItem {
  type: 'card';
  card: Card;
}
interface HeaderItem {
  type: 'header';
  title: string;
}

interface FooterItem {
  type: 'footer';
  id: string;
  nonCollectionCount: number;
}

type Item = CardItem | HeaderItem | FooterItem;

interface Section {
  title: string;
  id: string;
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

function renderSectionHeader(item: HeaderItem) {
  return (
    <View style={space.paddingS} key={item.title}>
      <CardDetailSectionHeader title={item.title} color="dark" normalCase />
    </View>
  );
}

function CustomInvestigatorRow({ investigator, onInvestigatorPress, children, showFaction }: {
  investigator: Card;
  onInvestigatorPress: (card: Card) => void;
  children?: React.ReactNode;
  showFaction?: boolean;
}) {
  const { width } = useContext(StyleContext);
  const onPress = useCallback(() => {
    onInvestigatorPress(investigator);
  }, [onInvestigatorPress, investigator]);
  if (!children) {
    return (
      <View style={[space.paddingSideS, space.paddingVerticalXs]}>
        <TouchableShrink onPress={onPress}>
          <CompactInvestigatorRow
            investigator={investigator}
            width={width - s * 2}
          >
            { investigator.alternate_of_code ? <AppIcon color="#FFFFFF" name="parallel" size={36} /> : null }
            { showFaction ? <FactionIcon defaultColor="white" faction={investigator.factionCode()} size={32} /> : undefined }
          </CompactInvestigatorRow>
        </TouchableShrink>
      </View>
    );
  }
  return (
    <View style={[space.paddingSideS, space.paddingVerticalXs]}>
      <TouchableShrink onPress={onPress}>
        <AnimatedCompactInvestigatorRow
          disabled
          open
          investigator={investigator}
          width={width - s * 2}
        >
          { children }
        </AnimatedCompactInvestigatorRow>
      </TouchableShrink>
    </View>
  );
}

export default function InvestigatorsListComponent({
  componentId,
  sort,
  onPress,
  filterInvestigator,
  filterInvestigators = [],
  onlyInvestigators,
  searchOptions,
  customFooter,
  includeParallelInvestigators,
}: Props) {
  const { typography } = useContext(StyleContext);
  const [investigators, loading] = useAllInvestigators(undefined, sort);
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
  const [showNonCollection,, setShowNonCollection] = useToggles({});
  const [searchTerm, setSearchTerm] = useState('');

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

  const data = useMemo((): Item[] => {
    const onlyInvestigatorsSet = onlyInvestigators ? new Set(onlyInvestigators) : undefined;
    const filterInvestigatorsSet = new Set(filterInvestigators);
    const allInvestigators = filter(
      investigators,
      i => {
        if (!i) {
          return false;
        }
        if (i.mythos_card) {
          return false;
        }
        if (i.altArtInvestigator && !includeParallelInvestigators) {
          return false;
        }
        if (filterInvestigatorsSet.has(i.code)) {
          return false;
        }
        if (onlyInvestigatorsSet && !onlyInvestigatorsSet.has(i.code)) {
          return false;
        }
        if (filterInvestigator && !filterInvestigator(i)) {
          return false;
        }
        return searchMatchesText(
          searchTerm,
          [i.name, i.faction_name || '', i.traits || '']
        );
      });

    const results: Item[] = [];
    let nonCollectionCards: Card[] = [];
    let currentBucket: Section | undefined = undefined;
    forEach(allInvestigators, i => {
      const header = headerForInvestigator(sort[0], i);
      if (!currentBucket || currentBucket.title !== header) {
        if (currentBucket && nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, card => {
              results.push({
                type: 'card',
                card,
              });
            });
          } else {
            results.push({
              type: 'footer',
              id: currentBucket.id,
              nonCollectionCount: nonCollectionCards.length,
            });
          }
          currentBucket.nonCollectionCount = nonCollectionCards.length;
          nonCollectionCards = [];
        }
        currentBucket = {
          title: header,
          id: `${sort}-${results.length}`,
          nonCollectionCount: 0,
        };
        results.push({
          type: 'header',
          title: header,
        });
      }
      if (i) {
        if (i.pack_code && ((i.pack_code === 'core' && !in_collection.no_core) || ignore_collection || cardInCollection(i, in_collection))) {
          results.push({ type: 'card', card: i });
        } else {
          nonCollectionCards.push(i);
        }
      }
    });

    // One last snap of the non-collection cards
    if (currentBucket) {
      // @ts-ignore
      const id = currentBucket.id;
      if (nonCollectionCards.length > 0) {
        if (showNonCollection[id]) {
          forEach(nonCollectionCards, card => {
            results.push({
              type: 'card',
              card,
            });
          });
        } else {
          results.push({
            type: 'footer',
            id,
            nonCollectionCount: nonCollectionCards.length,
          });
        }
        // @ts-ignore
        currentBucket.nonCollectionCount = nonCollectionCards.length;
        nonCollectionCards = [];
      }
    }
    return results;
  }, [filterInvestigator, includeParallelInvestigators, investigators, in_collection, ignore_collection, showNonCollection, searchTerm, filterInvestigators, onlyInvestigators, sort]);

  const renderSectionFooter = useCallback((item: FooterItem) => {
    if (!item.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[item.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <ArkhamButton
          icon="edit"
          title={t`Edit Collection`}
          onPress={showEditCollection}
        />
      );
    }
    const section = { nonCollectionCount: item.nonCollectionCount };
    return (
      <ShowNonCollectionFooter
        id={item.id}
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

  const renderItem = useCallback((item: Item) => {
    switch (item.type) {
      case 'header':
        return renderSectionHeader(item);
      case 'footer':
        return renderSectionFooter(item);
      case 'card':
        return (
          <CustomInvestigatorRow
            key={item.card.code}
            investigator={item.card}
            onInvestigatorPress={onInvestigatorPress}
            showFaction
          />
        );
    }
  }, [onInvestigatorPress, renderSectionFooter]);
  const renderFooter = useCallback(() => {
    if (searchTerm && data.length === 0) {
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
  }, [typography, customFooter, searchTerm, data]);
  return (
    <CollapsibleSearchBox
      prompt={t`Search`}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      advancedOptions={searchOptions}
    >
      { onScroll => (
        <ArkhamLargeList
          refreshing={loading}
          onScroll={onScroll}
          data={data}
          renderFooter={renderFooter}
          renderItem={renderItem}
        />
      ) }
    </CollapsibleSearchBox>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginBottom: 60,
  },
});
