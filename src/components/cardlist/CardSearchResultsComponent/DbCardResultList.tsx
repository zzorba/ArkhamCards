import React, { ReactNode, useCallback, useContext, useEffect, useRef, useMemo, useReducer, useState, Reducer, ReducerWithoutAction } from 'react';
import {
  flatMap,
  forEach,
  map,
  random,
  filter,
  find,
  take,
  dropWhile,
  partition,
} from 'lodash';
import {
  Keyboard,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  Platform,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { throttle } from 'throttle-debounce';
import { Brackets } from 'typeorm/browser';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import DbRender from '@components/data/DbRender';
import Database, { SectionCount } from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { addDbFilterSet, addFilterSet } from '@components/filter/actions';
import ShowNonCollectionFooter, { rowNonCollectionHeight } from './ShowNonCollectionFooter';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { rowHeight } from '@components/cardlist/CardSearchResult/constants';
import CardSectionHeader, { CardSectionHeaderData } from '@components/core/CardSectionHeader';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_FACTION_PACK,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
  Slots,
} from '@actions/types';
import { combineQueries, where } from '@data/query';
import { getPacksInCollection, getTabooSet, AppState, getShowSpoilers, getPackSpoilers } from '@reducers';
import Card, { CardsMap, PartialCard } from '@data/Card';
import { showCard, showCardSwipe } from '@components/nav/helper';
import { s, m } from '@styles/space';
import ArkhamButton, { ArkhamButtonIcon } from '@components/core/ArkhamButton';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useCards, useToggles, Toggles } from '@components/core/hooks';

interface Props {
  componentId: string;
  query: Brackets;
  tabooSetOverride?: number;
  filterQuery?: Brackets;
  sort?: SortType;
  deckCardCounts?: Slots;
  refreshDeck: number;
  initialSort?: SortType;
  mythosToggle?: boolean;
  searchTerm?: string;
  expandSearchControls?: ReactNode;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  investigator?: Card;
  cardPressed?: (card: Card) => void;
  renderCard?: (card: Card) => React.ReactElement;
  renderHeader?: () => React.ReactElement;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  noSearch?: boolean;
  handleScroll: (...args: any[]) => void;
  showHeader: () => void;
}

function getRandomLoadingMessage() {
  const messages =  [
    t`Investigating for clues`,
    t`Cursing at the tentacle token`,
    t`Drawing a mythos card with surge`,
    t`Placing doom on the agenda`,
    t`Reticulating spines`,
    t`Trying to make sense of the Time Warp FAQ`,
    t`Taking three damage and three horror`,
    t`Up by 5, hope I don't draw the tentacle`,
  ];
  return messages[random(0, messages.length - 1)];
}

interface QueryCounts {
  query: Brackets;
  nonCollection?: {
    [key: string]: number | undefined;
  };
  spoiler?: {
    [key: string]: number | undefined;
  };
}

interface SectionHeaderItem {
  type: 'header';
  id: string;
  header: CardSectionHeaderData
}
interface CardItem {
  type: 'card';
  id: string;
  card: Card;
}
interface LoadingItem {
  type: 'loading';
  id: string;
}
interface ButtonItem {
  type: 'button';
  id: string;
  onPress: () => void;
  title: string;
  icon: ArkhamButtonIcon;
}

type Item = SectionHeaderItem | CardItem | ButtonItem | LoadingItem;

interface PartialCardItem {
  type: 'pc';
  card: PartialCard;
}

type PartialItem = SectionHeaderItem | ButtonItem | PartialCardItem;

function countPartialCards(partialCards: PartialCard[], predicate: (card: PartialCard) => boolean): {
  [key: string]: number | undefined;
} {
  const result: { [key: string]: number } = {};
  forEach(partialCards, card => {
    if (predicate(card)) {
      result[card.headerId] = 1 + (result[card.headerId] || 0);
    }
  });
  return result;
}

function sectionFeed(componentId: string, query: Brackets, sort?: SortType, tabooSetId?: number, filterQuery?: Brackets): [
  Item[],
  PartialCard[],
  boolean,
  () => void,
  boolean,
] {
  const { db } = useContext(DatabaseContext);
  const packSpoiler = useSelector(getPackSpoilers);
  const packInCollection = useSelector(getPacksInCollection);
  const [showNonCollection, updateShowNonCollection] = useToggles({});
  const [cards, updateCards] = useCards('id');
  const [partialCards, setPartialCards] = useState<PartialCard[]>([]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const nonCollectionSectionCounts = useMemo(
    () => countPartialCards(partialCards, card => card.pack_code !== 'core' && !packInCollection[card.pack_code]),
    [partialCards, packInCollection]);
  const [fetchSize, setFetchSize] = useState(30);

  const editCollectionSettings = useCallback(() => {
    Keyboard.dismiss();
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
        options: {
          topBar: {
            title: {
              text: t`Edit Collection`,
            },
          },
        },
      },
    });
  }, [componentId]);
  const [visibleCards, partialItems, spoilerCardsCount] = useMemo(() => {
    const items: PartialItem[] = []
    const result: PartialCard[] = [];
    let currentSectionId: string | undefined = undefined;
    let currentNonCollection: PartialCard[] = [];
    const [nonSpoilerCards, spoilerCards] = partition(partialCards, card => {
      if (card.pack_code !== 'core' && !packInCollection[card.pack_code]) {
        return true;
      }
      return !card.spoiler || packSpoiler[card.pack_code];
    });
    const appendFooterButtons = (sectionId: string, prefix: string | number) => {
      const nonCollectionCount = currentNonCollection.length;
      if (nonCollectionCount) {
        if (showNonCollection[sectionId]) {
          forEach(currentNonCollection, card => {
            result.push(card);
            items.push({ type: 'pc', card });
          });
          items.push({
            type: 'button',
            id: `${prefix}_enc_${sectionId}`,
            onPress: editCollectionSettings,
            title: t`Edit Collection`,
            icon: 'edit',
          });
        } else {
          items.push({
            type: 'button',
            id: `${prefix}_nc_${sectionId}`,
            onPress: () => {
              updateShowNonCollection({ type: 'set', key: sectionId, value: true })
            },
            title: ngettext(
              msgid`Show ${nonCollectionCount} non-collection card`,
              `Show ${nonCollectionCount} non-collection cards`,
              nonCollectionCount),
            icon: 'expand',
          });
        }
      }
    };
    forEach([nonSpoilerCards, ...(showSpoilers ? [spoilerCards] : [])], (cardSegment, idx) => {
      forEach(cardSegment, card => {
        if (!currentSectionId || card.headerId !== currentSectionId) {
          if (currentSectionId) {
            appendFooterButtons(currentSectionId, idx);
          }
          currentNonCollection = [];
          items.push({
            type: 'header',
            id: `${idx}_${card.headerId}`,
            header: {
              subTitle: card.headerTitle,
            },
          });
          currentSectionId = card.headerId;
        }
        if (card.pack_code !== 'core' && !packInCollection[card.pack_code]) {
          currentNonCollection.push(card);
        } else {
          result.push(card);
          items.push({ type: 'pc', card });
        }
      });
    });
    if (currentSectionId) {
      appendFooterButtons(currentSectionId, showSpoilers ? 1 : 0);
    }
    return [result, items, spoilerCards.length];
  }, [partialCards, showNonCollection, packInCollection, packSpoiler, showSpoilers, editCollectionSettings, updateShowNonCollection]);

  const [beingFetched, setBeingFetched] = useState(new Set<string>());
  const [refreshing, setRefreshing] = useState(true);
  const fetchMore = useCallback(
    () => {
      const ids = take(map(
        filter(visibleCards, card => !cards[card.id] && !beingFetched.has(card.id)),
        c => c.id
      ), 50);
      if (ids.length) {
        setBeingFetched(new Set([
          ...Array.from(beingFetched),
          ...ids
        ]));
        /*if (fetchSize < 100) {
          setFetchSize(100);
        }*/
        const start = new Date();
        db.getCardsByIds(ids)
          .then(newCards => {
            console.log(`Got ${newCards.length} cards, elapsed: ${(new Date()).getTime() - start.getTime()}`)
            updateCards({ type: 'cards', cards: newCards });
          }, console.log);
      }
    },
    [visibleCards, cards, beingFetched]
  );

  useEffect(() => {
    if (visibleCards.length) {
      // Initial fetch when we get back first set of results.
      fetchMore();
    }
  }, [visibleCards]);

  useEffect(() => {
    // Look for holes in visibleCards after we complete one load, in case we need to load more.
    const visibleCardsAtInitialSpinner = dropWhile(visibleCards, card => !!cards[card.id]);
    const hasGap = !!find(visibleCardsAtInitialSpinner, card => !!cards[card.id]);
    if (hasGap) {
      // Have gaps, keep loading.
      fetchMore();
    }
    // Intentionally not listeneing for 'visibleCards' changes because everytime visibleCards changes we do one fetch regardless.
  }, [cards]);
  const fetchPartialCards = useCallback((theQuery: Brackets, theSort?: SortType, theTabooSetId?: number) => {
    setRefreshing(true);
    const start = new Date();
    db.getPartialCards(
      combineQueries(theQuery, filterQuery ? [filterQuery]: [], 'and'),
      theTabooSetId,
      theSort
    ).then((cards: PartialCard[]) => {
      console.log(`Fetched partial cards (${cards.length}) in: ${(new Date()).getTime() - start.getTime()}`);
      if (theQuery === query && theSort === sort && theTabooSetId === tabooSetId) {
        setPartialCards(cards);
        setRefreshing(false);
      } else {
        console.log('inputs changed, rejecting page of results.')
      }
    }, console.log);
  }, [query, filterQuery, sort, tabooSetId]);

  useEffect(() => {
    // Initially or when query/sort/tabooSetId change, we need to cllear our fetched cards
    fetchPartialCards(query, sort, tabooSetId);
    updateShowNonCollection({ type: 'clear' });
    setShowSpoilers(false);
  }, [query, filterQuery, sort, tabooSetId]);

  const editSpoilerSettings = useCallback(() => {
    Keyboard.dismiss();
    Navigation.push(componentId, {
      component: {
        name: 'My.Spoilers',
        options: {
          topBar: {
            title: {
              text: t`Spoiler Settings`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId]);

  const items = useMemo(() => {
    const result: Item[] = [];
    let currentSection: string | undefined = undefined;
    let missingCards = false;
    let loadingSection = false;
    forEach(partialItems, item => {
      if (item.type !== 'pc') {
        result.push(item);
        loadingSection = false;
        return;
      }
      const { headerId, id } = item.card;
      const card = cards[id];
      if (!card) {
        if (!loadingSection) {
          result.push({ type: 'loading', id: id });
          loadingSection = true;
          missingCards = true;
        }
        return;
      }
      loadingSection = false;
      result.push({
        type: 'card',
        id: `${headerId}.${id}`,
        card,
      });
    });
    if (!missingCards) {
      if (spoilerCardsCount > 0) {
        if (showSpoilers) {
          result.push({
            type: 'button',
            id: 'edit_spoilers',
            onPress: editSpoilerSettings,
            title: t`Edit spoiler settings`,
            icon: 'edit',
          });
        } else {
          result.push({
            type: 'button',
            id: 'show_spoilers',
            onPress: () => {
              setShowSpoilers(true);
            },
            title: ngettext(
              msgid`Show ${spoilerCardsCount} spoiler`,
              `Show ${spoilerCardsCount} spoilers`,
              spoilerCardsCount),
            icon: 'expand',
          });
        }
      }
    }
    return result;
  }, [partialItems, cards, showSpoilers, spoilerCardsCount]);

  const feedLoading = useMemo(() => {
    return !!find(take(visibleCards, 5), c => !cards[c.id]);
  }, [visibleCards, cards]);
  return [items, visibleCards, refreshing || feedLoading, fetchMore, showSpoilers];
}

export default function({
  componentId,
  query,
  filterQuery,
  sort,
  refreshDeck,
  tabooSetOverride,
  mythosToggle,
  initialSort,
  searchTerm,
  expandSearchControls,
  deckCardCounts: propsDeckCardCounts,
  investigator,
  renderCard,
  renderFooter,
  cardPressed,
  onDeckCountChange,
  limits,
  noSearch,
  renderHeader,
  handleScroll,
  showHeader,
}: Props) {
  const { db } = useContext(DatabaseContext);
  const { colors, borderStyle, fontScale, typography } = useContext(StyleContext);
  const [deckCardCounts, setDeckCardCounts] = useState(propsDeckCardCounts || {});
  const hasSecondCore = useSelector((state: AppState) => getPacksInCollection(state).core || false);
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const [feed, fullFeed, refreshing, fetchMore, showSpoilerCards] = sectionFeed(componentId, query, sort, tabooSetId, filterQuery);
  const dispatch = useDispatch();
  // showHeader when somethings drastic happens.
  useEffect(() => {
    showHeader();
    dispatch(addDbFilterSet(componentId, db, query, sort, tabooSetId));
  }, [query, tabooSetId, sort]);

  const cardOnPressId = useCallback((id: string, card: Card) => {
    cardPressed && cardPressed(card);

    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        colors,
        true,
        tabooSetOverride
      );
      return;
    }
    let index = 0;
    const [headerId, cardId] = id.split('.');
    const codes = map(fullFeed, (partialCard, idx) => {
      if (headerId == partialCard.headerId && cardId == partialCard.id) {
        index = idx;
      }
      return partialCard.code;
    });
    const cards = flatMap(feed, item => item.type === 'card' ? item.card : []);
    showCardSwipe(
      componentId,
      codes,
      index,
      colors,
      cards,
      showSpoilerCards,
      tabooSetOverride,
      deckCardCounts,
      onDeckCountChange,
      investigator,
      renderFooter,
    );
  }, [feed, fullFeed, showSpoilerCards, tabooSetOverride, deckCardCounts, onDeckCountChange, investigator, renderFooter, colors]);
  const keyExtractor = useCallback((item: Item, index: number) => {
    switch (item.type) {
      case 'button': return `button_${item.id}`;
      case 'card':  return `card_${item.id}`;
      case 'header': return `header_${item.id}`;
      case 'loading': return `loading_${item.id}`;
      default: return `${index}`;
    }
  }, []);
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<Item>) => {
    switch (item.type) {
      case 'button':
        return (
          <ArkhamButton
            title={item.title}
            onPress={() => item.onPress()}
            icon={item.icon}
          />
        );
      case 'card': {
        const card = item.card;
        if (renderCard) {
          return renderCard(card);
        }
        return (
          <CardSearchResult
            card={card}
            count={deckCardCounts && deckCardCounts[card.code]}
            onDeckCountChange={onDeckCountChange}
            onPressId={cardOnPressId}
            id={item.id}
            limit={limits ? limits[card.code] : undefined}
            hasSecondCore={hasSecondCore}
          />
        );
      }
      case 'header':
        return (
          <CardSectionHeader
            section={item.header}
            investigator={investigator}
          />
        );
      case 'loading':
        return (
          <View style={[borderStyle, styles.loadingRow, { height: rowHeight(fontScale) }]}>
            <ActivityIndicator color={colors.lightText} animating size="small" />
          </View>
        )
      default:
        return null;
    }
  }, [cardOnPressId, onDeckCountChange, hasSecondCore, deckCardCounts, investigator, limits, renderCard]);
  const listHeader = useMemo(() => {
    const searchBarPadding = !noSearch && Platform.OS === 'android';
    if (!searchBarPadding && !renderHeader) {
      return null;
    }

    return (
      <>
        { searchBarPadding && <View style={styles.searchBarPadding} /> }
        { !!renderHeader && renderHeader() }
      </>
    );
  }, [renderHeader]);
  const listFooter = useMemo(() => {
    return (
      <View style={styles.footer}>
        { (!refreshing && feed.length === 0) ? (
          <View>
            <View style={[styles.emptyText, borderStyle]}>
              <Text style={typography.text}>
                { searchTerm ?
                  t`No matching cards for "${searchTerm}"` :
                  t`No matching cards` }
              </Text>
            </View>
            { expandSearchControls }
          </View>
        ) : expandSearchControls }
      </View>
    );
  }, [searchTerm, expandSearchControls, fullFeed, refreshing]);
  const handleScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);
  if (refreshing) {
    return (
      <View style={styles.loading}>
        { !noSearch && <View style={styles.searchBarPadding} />}
        <View style={styles.loadingText}>
          <Text style={typography.text}>
            { `${loadingMessage}...` }
          </Text>
        </View>
        <ActivityIndicator
          style={[{ height: 80 }]}
          color={colors.lightText}
          size="small"
          animating
        />
      </View>
    );
  }
  return (
    <FlatList
      contentInset={noSearch || Platform.OS === 'android' ? undefined : { top: SEARCH_BAR_HEIGHT }}
      contentOffset={noSearch || Platform.OS === 'android' ? undefined : { x: 0, y: -SEARCH_BAR_HEIGHT }}
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing}
          //onRefresh={this._refreshInDeck}
          tintColor={colors.lightText}
          progressViewOffset={noSearch ? 0 : SEARCH_BAR_HEIGHT}
        />
      }
      data={feed}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={20}
      onEndReached={fetchMore}
      onEndReachedThreshold={3}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      scrollEventThrottle={1}
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 300,
  },
  loading: {
    flex: 1,
    margin: m,
    paddingTop: SEARCH_BAR_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingText: {
    paddingLeft: m,
    paddingRight: m,
    paddingTop: m,
    paddingBottom: s,
  },
  emptyText: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBarPadding: {
    height: SEARCH_BAR_HEIGHT,
  },
});
