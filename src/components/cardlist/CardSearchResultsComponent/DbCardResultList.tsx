import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  flatMap,
  forEach,
  map,
  random,
  filter,
  find,
  take,
  partition,
  debounce,
  uniq,
  concat,
  keys,
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
import { Brackets } from 'typeorm/browser';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import DatabaseContext from '@data/DatabaseContext';
import { addDbFilterSet } from '@components/filter/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { rowHeight } from '@components/cardlist/CardSearchResult/constants';
import CardSectionHeader, { CardSectionHeaderData, cardSectionHeaderHeight } from '@components/core/CardSectionHeader';
import { SortType, Slots, SORT_BY_TYPE } from '@actions/types';
import { combineQueries, where } from '@data/query';
import { getPacksInCollection, getTabooSet, AppState, getPackSpoilers } from '@reducers';
import Card, { CardsMap, PartialCard } from '@data/Card';
import { showCard, showCardSwipe } from '@components/nav/helper';
import { s, m } from '@styles/space';
import ArkhamButton, { ArkhamButtonIcon } from '@components/core/ArkhamButton';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useCards, useSlots, useToggles } from '@components/core/hooks';

interface Props {
  componentId: string;
  query?: Brackets;
  tabooSetOverride?: number;
  originalDeckSlots?: Slots;
  filterQuery?: Brackets;
  textQuery?: Brackets;
  sort?: SortType;
  deckCardCounts?: Slots;
  initialSort?: SortType;
  mythosToggle?: boolean;
  searchTerm?: string;
  expandSearchControls?: ReactNode;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  investigator?: Card;
  cardPressed?: (card: Card) => void;
  renderCard?: (card: Card) => React.ReactElement;
  header?: React.ReactElement;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  noSearch?: boolean;
  handleScroll?: (...args: any[]) => void;
  showHeader?: () => void;
  storyOnly?: boolean;
  showNonCollection?: boolean;
}

function getRandomLoadingMessage() {
  const messages = [
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
  prefix?: string;
  card: PartialCard;
}

type PartialItem = SectionHeaderItem | ButtonItem | PartialCardItem;

interface CardFetcher {
  cards: CardsMap;
  fetchMore?: () => void;
}
/**
 * This function turns partial cards into real cards, and provides a manual fetchMore function.
 * @param visibleCards list of partial cards that are trying to be rendered
 */
function useCardFetcher(visibleCards: PartialCard[]): CardFetcher {
  const { db } = useContext(DatabaseContext);
  const [cards, updateCards] = useCards('id');
  const [beingFetched, setBeingFetched] = useState(new Set<string>());
  const [fetchSize, setFetchSize] = useState(Platform.OS === 'ios' ? 100 : 30);
  const fetchMore = useCallback(
    () => {
      const ids = take(map(
        filter(visibleCards, card => !cards[card.id] && !beingFetched.has(card.id)),
        c => c.id
      ), fetchSize);
      if (ids.length) {
        setBeingFetched(new Set([
          ...Array.from(beingFetched),
          ...ids,
        ]));
        if (fetchSize < 100) {
          setFetchSize(100);
        }
        // const start = new Date();
        db.getCardsByIds(ids).then(newCards => {
          // console.log(`Got ${newCards.length} cards, elapsed: ${(new Date()).getTime() - start.getTime()}`);
          updateCards({ type: 'cards', cards: newCards });
        }, console.log);
      }
    },
    [visibleCards, cards, beingFetched, fetchSize, db, updateCards]
  );

  useEffect(() => {
    if (visibleCards.length) {
      // Initial fetch when we get back first set of results.
      fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCards, cards]);
  const allFetched = useMemo(() => !find(visibleCards, card => !cards[card.id]), [cards, visibleCards]);
  return {
    cards,
    fetchMore: allFetched ? undefined : fetchMore,
  };
}

function useDeckQuery(deckCardCounts: Slots, originalDeckSlots?: Slots): [Brackets | undefined, boolean, () => void] {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(-1);
  const refreshDeck = useCallback(() => {
    setRefreshCounter(updateCounter);
  }, [setRefreshCounter, updateCounter]);

  useEffect(() => {
    setUpdateCounter(updateCounter + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckCardCounts]);
  const hasDeckChanges = (updateCounter > refreshCounter);

  const deckCodes = useMemo(() => {
    if (!originalDeckSlots) {
      return [];
    }
    return filter(
      uniq(concat(keys(originalDeckSlots), keys(deckCardCounts))),
      code => originalDeckSlots[code] > 0 ||
        (deckCardCounts && deckCardCounts[code] > 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);
  const deckQuery = useMemo(() => {
    if (!deckCodes.length) {
      return undefined;
    }
    return where(`c.code in (:...codes)`, { codes: deckCodes });
  }, [deckCodes]);

  return [deckQuery, hasDeckChanges, refreshDeck];
}

interface SectionFeedProps {
  componentId: string;
  query?: Brackets;
  sort?: SortType;
  tabooSetId?: number;
  filterQuery?: Brackets;
  textQuery?: Brackets;
  showAllNonCollection?: boolean;
  deckCardCounts: Slots;
  originalDeckSlots?: Slots;
  storyOnly?: boolean;
}


interface SectionFeed {
  feed: Item[];
  fullFeed: PartialCard[];
  refreshing: boolean;
  fetchMore?: () => void;
  showSpoilerCards: boolean;
  refreshDeck?: () => void;
}

function useSectionFeed({
  componentId,
  query,
  sort,
  tabooSetId,
  filterQuery,
  textQuery,
  showAllNonCollection,
  storyOnly,
  originalDeckSlots,
  deckCardCounts,
}: SectionFeedProps): SectionFeed {
  const { db } = useContext(DatabaseContext);
  const packSpoiler = useSelector(getPackSpoilers);
  const [expandButtonPressed, setExpandButtonPressed] = useState(false);
  const packInCollection = useSelector(getPacksInCollection);
  const [showNonCollection, updateShowNonCollection] = useToggles({});
  const storyQuery = storyOnly ? query : undefined;
  const [deckCards, setDeckCards] = useState<PartialCard[]>([]);
  const [mainQueryCards, setMainQueryCards] = useState<PartialCard[]>([]);
  const [textQueryCards, setTextQueryCards] = useState<PartialCard[]>([]);
  const [deckQuery, hasDeckChanges, refreshDeck] = useDeckQuery(deckCardCounts, originalDeckSlots);

  useEffect(() => {
    let ignore = false;
    if (!deckQuery) {
      setDeckCards([]);
    } else {
      db.getPartialCards(
        combineQueries(
          deckQuery,
          [
            ...(storyQuery ? [storyQuery] : []),
            ...(filterQuery ? [filterQuery] : []),
            ...(textQuery ? [textQuery] : []),
          ],
          'and'
        ),
        tabooSetId,
        sort
      ).then(cards => {
        if (!ignore) {
          setDeckCards(cards);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [db, storyQuery, textQuery, filterQuery, deckQuery, tabooSetId, sort]);
  const partialCards = textQuery ? textQueryCards : mainQueryCards;
  const [showSpoilers, setShowSpoilers] = useState(false);

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
    const items: PartialItem[] = deckCards.length ? [] : [];
    const result: PartialCard[] = [];
    let currentSectionId: string | undefined = undefined;
    if (deckCards.length) {
      items.push({
        type: 'header',
        id: 'deck_superheader',
        header: {
          superTitle: t`In Deck`,
          superTitleIcon: 'refresh',
          onPress: hasDeckChanges ? refreshDeck : undefined,
        },
      });
      forEach(deckCards, card => {
        if (!currentSectionId || card.headerId !== currentSectionId) {
          items.push({
            type: 'header',
            id: `deck_${card.headerId}`,
            header: {
              subTitle: card.headerTitle,
            },
          });
          currentSectionId = card.headerId;
        }
        result.push({ ...card, headerId: `deck_${card.headerId}` });
        items.push({ type: 'pc', prefix: 'deck', card });
      });
      items.push({
        type: 'header',
        id: 'all_cards',
        header: {
          superTitle: t`All Eligible Cards`,
        },
      });
    }
    currentSectionId = undefined;
    let currentNonCollection: PartialCard[] = [];
    const [nonSpoilerCards, spoilerCards] = partition(partialCards, card => {
      if (!showAllNonCollection && card.pack_code !== 'core' && !packInCollection[card.pack_code]) {
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
              setExpandButtonPressed(true);
              updateShowNonCollection({ type: 'set', key: sectionId, value: true });
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
        if (!showAllNonCollection && card.pack_code !== 'core' && !packInCollection[card.pack_code]) {
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
  }, [partialCards, deckCards, showNonCollection, packInCollection, packSpoiler, showSpoilers, editCollectionSettings, updateShowNonCollection, showAllNonCollection, hasDeckChanges, refreshDeck]);

  const { cards, fetchMore } = useCardFetcher(visibleCards);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    setRefreshing(true);
  }, [query, sort, tabooSetId]);

  useEffect(() => {
    let ignore = false;
    // This is for the really big changes.
    // Initially or when query/sort/tabooSetId change, we need to cllear our fetched cards
    updateShowNonCollection({ type: 'clear' });
    setShowSpoilers(false);
    setExpandButtonPressed(false);
    if (!query) {
      setMainQueryCards([]);
      setRefreshing(false);
      return;
    }

    // const start = new Date();
    db.getPartialCards(
      combineQueries(query, filterQuery ? [filterQuery] : [], 'and'),
      tabooSetId,
      sort
    ).then((cards: PartialCard[]) => {
      // console.log(`Fetched partial cards (${cards.length}) in: ${(new Date()).getTime() - start.getTime()}`);
      if (!ignore) {
        setMainQueryCards(cards);
        setRefreshing(false);
      }
    }, console.log);
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, sort, tabooSetId, db]);

  useEffect(() => {
    if (textQuery) {
      let ignore = false;
      const delayedSearch = debounce(() => {
        if (!query) {
          setTextQueryCards([]);
          return;
        }
        // Look for textual card changes.
        // const start = new Date();
        db.getPartialCards(
          combineQueries(query,
            [
              ...(filterQuery ? [filterQuery] : []),
              ...(textQuery ? [textQuery] : []),
            ],
            'and'
          ),
          tabooSetId,
          sort
        ).then((cards: PartialCard[]) => {
          if (!ignore) {
            // console.log(`Fetched text cards (${cards.length}) in: ${(new Date()).getTime() - start.getTime()}`);
            setTextQueryCards(cards);
          }
        });
      }, 50);
      delayedSearch();
      return () => {
        ignore = true; delayedSearch.cancel();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, textQuery, sort, tabooSetId]);

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
        id: item.prefix ? `${item.prefix}_${headerId}.${id}` : `${headerId}.${id}`,
        card,
      });
    });
    if (!missingCards && spoilerCardsCount > 0) {
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
            setExpandButtonPressed(true);
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
    return result;
  }, [partialItems, cards, showSpoilers, spoilerCardsCount, editSpoilerSettings]);

  const feedLoading = useMemo(() => {
    return !!find(take(visibleCards, 1), c => !cards[c.id]);
  }, [visibleCards, cards]);
  return {
    feed: items,
    fullFeed: visibleCards,
    refreshing: refreshing || (feedLoading && !expandButtonPressed),
    fetchMore,
    showSpoilerCards: showSpoilers,
    refreshDeck: hasDeckChanges ? refreshDeck : undefined,
  };
}

function itemHeight(item: Item, fontScale: number): number {
  switch (item.type) {
    case 'button':
      return ArkhamButton.Height(fontScale);
    case 'card':
    case 'loading':
      return rowHeight(fontScale);
    case 'header':
      return cardSectionHeaderHeight(item.header, fontScale);
  }
}
export default function({
  componentId,
  query,
  filterQuery,
  textQuery,
  sort,
  tabooSetOverride,
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
  header,
  handleScroll,
  showHeader,
  originalDeckSlots,
  storyOnly,
  showNonCollection,
}: Props) {
  const { db } = useContext(DatabaseContext);
  const { colors, borderStyle, fontScale, typography } = useContext(StyleContext);
  const [deckCardCounts, setDeckCardCounts] = useSlots(propsDeckCardCounts || {});
  const handleDeckCountChange = useCallback((code: string, value: number) => {
    onDeckCountChange && onDeckCountChange(code, value);
    setDeckCardCounts({ type: 'set-slot', code, value });
  }, [onDeckCountChange, setDeckCardCounts]);
  const hasSecondCore = useSelector((state: AppState) => getPacksInCollection(state).core || false);
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const {
    feed,
    fullFeed,
    refreshing,
    fetchMore,
    showSpoilerCards,
    refreshDeck,
  } = useSectionFeed({
    componentId,
    query,
    sort,
    tabooSetId,
    filterQuery,
    textQuery,
    showAllNonCollection: showNonCollection,
    deckCardCounts,
    originalDeckSlots,
    storyOnly,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    // showHeader when somethings drastic happens, and get a new error message.
    showHeader && showHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, tabooSetId, sort]);
  useEffect(() => {
    if (!refreshing) {
      // Everytime refreshing goes to false, queue up a new fun loading message.
      setLoadingMessage(getRandomLoadingMessage());
    }
  }, [refreshing]);
  useEffect(() => {
    dispatch(addDbFilterSet(componentId, db, query, initialSort || SORT_BY_TYPE, tabooSetId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tabooSetId]);

  const cardOnPressId = useCallback((id: string, card: Card) => {
    console.log(`Card Pressed: ${id}`);
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
      if (headerId === partialCard.headerId && cardId === partialCard.id) {
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
  }, [feed, fullFeed, showSpoilerCards, tabooSetOverride, deckCardCounts, onDeckCountChange, investigator, renderFooter, colors, cardPressed, componentId, singleCardView]);
  const debouncedCardOnPressId = useMemo(() => debounce(cardOnPressId, 500, { leading: true }), [cardOnPressId]);
  const keyExtractor = useCallback((item: Item, index: number) => {
    switch (item.type) {
      case 'button': return `button_${item.id}`;
      case 'card': return `card_${item.id}`;
      case 'header': return `header_${item.id}`;
      case 'loading': return `loading_${item.id}`;
      default: return `${index}`;
    }
  }, []);
  const itemOffsets = useMemo(() => {
    let offset = 0;
    return map(feed, (item, index) => {
      const result = {
        length: itemHeight(item, fontScale),
        offset,
        index,
      };
      offset += result.length;
      return result;
    });
  }, [feed, fontScale]);
  const getItemLayout = useCallback((item: Item[] | null | undefined, index: number) => {
    return itemOffsets[index];
  }, [itemOffsets]);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Item>) => {
    switch (item.type) {
      case 'button':
        return (
          <ArkhamButton
            title={item.title}
            onPress={item.onPress}
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
            onDeckCountChange={onDeckCountChange ? handleDeckCountChange : undefined}
            onPressId={debouncedCardOnPressId}
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
        );
      default:
        return null;
    }
  }, [debouncedCardOnPressId, borderStyle, colors, fontScale, onDeckCountChange, handleDeckCountChange, hasSecondCore, deckCardCounts, investigator, limits, renderCard]);
  const listHeader = useMemo(() => {
    const searchBarPadding = !noSearch && Platform.OS === 'android';
    if (!searchBarPadding && !header) {
      return null;
    }

    return (
      <>
        { searchBarPadding && <View style={styles.searchBarPadding} /> }
        { header }
      </>
    );
  }, [header, noSearch]);
  const listFooter = useMemo(() => {
    return (
      <View style={styles.footer}>
        { (!refreshing && fullFeed.length === 0) ? (
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
  }, [searchTerm, expandSearchControls, borderStyle, fullFeed.length, typography, refreshing]);
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
          onRefresh={refreshDeck}
          tintColor={colors.lightText}
          progressViewOffset={noSearch ? 0 : SEARCH_BAR_HEIGHT}
        />
      }
      data={feed}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={40}
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
