import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  flatMap,
  forEach,
  map,
  random,
  filter,
  find,
  take,
  partition,
  uniq,
  concat,
  keys,
} from 'lodash';
import {
  Keyboard,
  StyleSheet,
  View,
  Platform,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { DataProvider, ContextProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { Brackets } from 'typeorm/browser';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';
import useDebouncedEffect from 'use-debounced-effect-hook';

import DatabaseContext from '@data/sqlite/DatabaseContext';
import { addDbFilterSet } from '@components/filter/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { rowHeight } from '@components/cardlist/CardSearchResult/constants';
import CardSectionHeader, { CardSectionHeaderData, cardSectionHeaderHeight } from '@components/core/CardSectionHeader';
import { SortType, Slots, SORT_BY_TYPE, DeckId } from '@actions/types';
import { combineQueries, where } from '@data/sqlite/query';
import { getPacksInCollection, makeTabooSetSelector, AppState, getPackSpoilers } from '@reducers';
import Card, { cardInCollection, CardsMap, PartialCard } from '@data/types/Card';
import { showCard, showCardSwipe } from '@components/nav/helper';
import { s, m } from '@styles/space';
import ArkhamButton from '@components/core/ArkhamButton';
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useDeck } from '@data/hooks';
import { useCards, useEffectUpdate, useToggles } from '@components/core/hooks';
import LoadingCardSearchResult from '../LoadingCardSearchResult';
import { ControlType } from '../CardSearchResult/ControlComponent';
import { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import { useDebounce } from 'use-debounce/lib';

interface Props {
  componentId: string;
  deckId?: DeckId;
  currentDeckOnly?: boolean;
  query?: Brackets;
  filterQuery?: Brackets;
  textQuery?: Brackets;
  sort?: SortType;
  initialSort?: SortType;
  mythosToggle?: boolean;
  searchTerm?: string;
  expandSearchControls?: ReactNode;
  investigator?: Card;
  cardPressed?: (card: Card) => void;
  renderCard?: (card: Card) => JSX.Element;
  headerItems?: React.ReactNode[];
  headerHeight?: number;
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

interface PaddingItem {
  type: 'padding',
  id: string;
  size: number;
}

interface ListHeader {
  type: 'list_header';
  id: string;
}

interface SectionHeaderItem {
  type: 'header';
  id: string;
  header: CardSectionHeaderData
}
interface TextItem {
  type: 'text';
  id: string;
  text: string;
  border?: boolean;
}
interface CardItem {
  type: 'card';
  id: string;
  card: Card;
}
interface LoadingCardItem {
  type: 'loading';
  id: string;
}
interface LoadingMessageItem {
  type: 'loading_message';
  id: string;
}

interface ButtonItem {
  type: 'button';
  id: string;
  onPress: () => void;
  title: string;
  icon: ArkhamButtonIconType;
}

type Item = SectionHeaderItem | CardItem | ButtonItem | TextItem | LoadingCardItem | LoadingMessageItem | PaddingItem | ListHeader;

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
  const beingFetched = useRef(new Set<string>());
  const fetchSize = useRef(Platform.OS === 'ios' ? 100 : 30);
  const fetchMore = useCallback(
    () => {
      const ids = take(map(
        filter(visibleCards, card => !beingFetched.current.has(card.id)),
        c => c.id
      ), fetchSize.current);
      if (ids.length) {
        beingFetched.current = new Set([
          ...Array.from(beingFetched.current),
          ...ids,
        ]);
        if (fetchSize.current < 100) {
          fetchSize.current = 100;
        }
        // const start = new Date();
        db.getCardsByIds(ids).then(newCards => {
          // console.log(`Got ${newCards.length} cards, elapsed: ${(new Date()).getTime() - start.getTime()}`);
          updateCards({ type: 'cards', cards: newCards });
        }, console.log);
      }
    },
    [visibleCards, beingFetched, fetchSize, db, updateCards]
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

function useDeckQuery(deckCardCounts?: Slots, originalDeckSlots?: Slots): [Brackets | undefined, boolean, () => void] {
  const [{ refreshCounter, updateCounter }, updateRefreshCounts] = useReducer((
    { refreshCounter, updateCounter }: { refreshCounter: number; updateCounter: number },
    action: 'update' | 'refresh'
  ) => {
    switch (action) {
      case 'refresh':
        return {
          refreshCounter: updateCounter,
          updateCounter,
        };
      case 'update':
        return {
          refreshCounter,
          updateCounter: updateCounter + 1,
        };
    }
  }, { refreshCounter: 0, updateCounter: 0 });
  const refreshDeck = useCallback(() => {
    updateRefreshCounts('refresh');
  }, [updateRefreshCounts]);

  useEffectUpdate(() => {
    updateRefreshCounts('update');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckCardCounts]);

  const hasDeckChanges = (updateCounter > refreshCounter);
  const deckCodes = useMemo(() => {
    if (!originalDeckSlots && !deckCardCounts) {
      return [];
    }
    return filter(
      uniq(concat(keys(originalDeckSlots), keys(deckCardCounts))),
      code => !!(
        (originalDeckSlots && originalDeckSlots[code] > 0) ||
        (deckCardCounts && deckCardCounts[code] > 0)
      )
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
  searchTerm?: string;
  textQuery?: Brackets;
  showAllNonCollection?: boolean;
  deckCardCounts?: Slots;
  originalDeckSlots?: Slots;
  storyOnly?: boolean;
  noSearch?: boolean;
  hasHeader?: boolean;
}


interface SectionFeed {
  feed: DataProvider;
  fullFeed: PartialCard[];
  refreshing: boolean;
  refreshingSearch: boolean;
  fetchMore?: () => void;
  showSpoilerCards: boolean;
  refreshDeck?: () => void;
}

interface LoadedState {
  cards: PartialCard[];
  textQuery: Brackets | undefined;
}
function useSectionFeed({
  componentId,
  hasHeader,
  query,
  sort,
  tabooSetId,
  filterQuery,
  noSearch,
  searchTerm,
  textQuery,
  showAllNonCollection,
  storyOnly,
  originalDeckSlots,
  deckCardCounts,
}: SectionFeedProps): SectionFeed {
  const { db } = useContext(DatabaseContext);
  const sortIgnoreQuotes = useSelector((state: AppState) => !state.settings.sortRespectQuotes);
  const packSpoiler = useSelector(getPackSpoilers);
  const [expandButtonPressed, setExpandButtonPressed] = useState(false);
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const [showNonCollection, , setShowNonCollection, clearShowNonCollection] = useToggles({});
  const storyQuery = storyOnly ? query : undefined;
  const [{ cards: deckCards, textQuery: deckCardsTextQuery }, setDeckCards] = useState<LoadedState>({
    cards: [],
    textQuery: undefined,
  });
  const [mainQueryCards, setMainQueryCards] = useState<PartialCard[]>([]);
  const [{ cards: textQueryCards, textQuery: textQueryCardsTextQuery }, setTextQueryCards] = useState<LoadedState>({
    cards: [],
    textQuery: undefined,
  });
  const [deckQuery, hasDeckChanges, refreshDeck] = useDeckQuery(deckCardCounts, originalDeckSlots);
  useEffect(() => {
    let ignore = false;
    if (!deckQuery) {
      setDeckCards({ cards: [], textQuery: undefined });
    } else {
      const searchTextQuery = textQuery;
      db.getPartialCards(
        sortIgnoreQuotes,
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
          setDeckCards({ cards, textQuery: searchTextQuery });
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [db, storyQuery, textQuery, filterQuery, deckQuery, sortIgnoreQuotes, tabooSetId, sort]);
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
      if (!showAllNonCollection && card.pack_code !== 'core' && !cardInCollection(card, packInCollection)) {
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
              setShowNonCollection(sectionId, true);
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
        if (!showAllNonCollection && !ignore_collection && card.pack_code !== 'core' && !cardInCollection(card, packInCollection)) {
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
  }, [partialCards, deckCards, showNonCollection, ignore_collection, packInCollection, packSpoiler, showSpoilers, editCollectionSettings, setShowNonCollection, showAllNonCollection, hasDeckChanges, refreshDeck]);

  const { cards, fetchMore } = useCardFetcher(visibleCards);
  const [refreshing, setRefreshing] = useState(true);

  const androidFilterQuery = Platform.OS === 'android' ? filterQuery : undefined;
  useEffect(() => {
    setRefreshing(true);
  }, [query, androidFilterQuery, sort, tabooSetId]);

  useEffect(() => {
    let ignore = false;
    // This is for the really big changes.
    // Initially or when query/sort/tabooSetId change, we need to cllear our fetched cards
    clearShowNonCollection();
    setShowSpoilers(false);
    setExpandButtonPressed(false);
    if (!query) {
      setMainQueryCards([]);
      setRefreshing(false);
      return;
    }

    // const start = new Date();
    db.getPartialCards(
      sortIgnoreQuotes,
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
  }, [query, filterQuery, sort, tabooSetId, sortIgnoreQuotes, db]);

  useDebouncedEffect(() => {
    if (textQuery) {
      let ignore = false;
      if (!query) {
        setTextQueryCards({ cards: [], textQuery: undefined });
        return;
      }
      // Look for textual card changes.
      // const start = new Date();
      const searchTextQuery = textQuery;
      db.getPartialCards(
        sortIgnoreQuotes,
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
          setTextQueryCards({ cards, textQuery: searchTextQuery });
        }
      });
      return () => {
        ignore = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, textQuery, sort, tabooSetId, sortIgnoreQuotes], 200);

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
  // tslint:disable-next-line: strict-comparisons
  const refreshingSearch = (!!deckQuery && deckCardsTextQuery !== textQuery) || (textQueryCardsTextQuery !== textQuery);
  const feedLoading = useMemo(() => {
    return (visibleCards.length > 0) && !!find(take(visibleCards, 1), c => !cards[c.id]);
  }, [visibleCards, cards]);

  const refreshingResult = refreshing || (feedLoading && !expandButtonPressed);
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

  const [startOfFeedLoading, feed] = useMemo(() => {
    const topLoading = !searchTerm && !!find(take(items, 15), x => x.type === 'loading');
    const result = topLoading ? [] : items;
    if (!result.length && !topLoading && !refreshingResult) {
      if (refreshingSearch) {
        result.push({
          type: 'text',
          id: 'searching',
          text: t`Searching cards...`,
        });
      } else {
        if (searchTerm) {
          result.push({
            type: 'text',
            id: 'no_results_search',
            text: t`No matching cards for "${searchTerm}"`,
            border: true,
          });
        } else {
          result.push({
            type: 'text',
            id: 'no_results_search',
            text: t`No matching cards`,
            border: true,
          });
        }
      }
    }
    return [topLoading, new DataProvider((a: Item, b: Item) => {
      return a.type === b.type && a.id === b.id;
    }).cloneWithRows([
      ...(!noSearch ? [{ type: 'padding', id: 'padding', size: SEARCH_BAR_HEIGHT }] : []),
      ...(hasHeader ? [{ type: 'list_header', id: 'list_header' }] : []),
      ...(refreshingResult || topLoading ? [{ type: 'loading_message', id: 'loading_message' }] : []),
      ...result,
    ])];
  }, [items, noSearch, hasHeader, refreshingResult, refreshingSearch, searchTerm]);
  return {
    feed,
    fullFeed: visibleCards,
    refreshing: startOfFeedLoading || refreshingResult,
    refreshingSearch,
    fetchMore,
    showSpoilerCards: showSpoilers,
    refreshDeck: hasDeckChanges ? refreshDeck : undefined,
  };
}

function itemHeight(item: Item, fontScale: number, headerHeight: number): number {
  switch (item.type) {
    case 'button':
      return ArkhamButton.Height(fontScale);
    case 'card':
    case 'loading':
      return rowHeight(fontScale);
    case 'loading_message':
      return s * 3 + fontScale * 24 + (Platform.OS === 'android' ? SEARCH_BAR_HEIGHT * 2 : 0);
    case 'header':
      return cardSectionHeaderHeight(item.header, fontScale);
    case 'text':
      return s * 2 + fontScale * 24 * 2;
    case 'padding':
      return item.size;
    case 'list_header':
      return headerHeight;
  }
}


class ContextHelper extends ContextProvider {
  _uniqueKey: string;
  _contextStore: { [key: string]: string | number };

  constructor(uniqueKey: string) {
    super();
    this._contextStore = {};
    this._uniqueKey = uniqueKey;
  }

  getUniqueKey() {
    return this._uniqueKey;
  }

  save(key: string, value: string | number) {
    this._contextStore[key] = value;
  }

  get(key: string) {
    return this._contextStore[key];
  }

  remove(key: string) {
    delete this._contextStore[key];
  }
}
export default function({
  componentId,
  deckId,
  currentDeckOnly,
  query,
  filterQuery,
  textQuery,
  sort,
  initialSort,
  searchTerm,
  expandSearchControls,
  investigator,
  renderCard,
  cardPressed,
  noSearch,
  headerItems,
  headerHeight,
  handleScroll,
  showHeader,
  storyOnly,
  showNonCollection,
}: Props) {
  const { db } = useContext(DatabaseContext);
  const contextHelper = useMemo(() => new ContextHelper(componentId), [componentId]);
  const deck = useDeck(deckId);
  const deckEdits = useSimpleDeckEdits(deckId);
  const { colors, borderStyle, fontScale, typography, width } = useContext(StyleContext);
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const tabooSetOverride = deckId !== undefined ? ((deckEdits?.tabooSetChange || deck?.deck.taboo_id) || 0) : undefined;
  const tabooSetSelctor = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelctor(state, tabooSetOverride));
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const {
    feed,
    fullFeed,
    refreshing,
    refreshingSearch,
    fetchMore,
    showSpoilerCards,
    refreshDeck,
  } = useSectionFeed({
    componentId,
    query,
    sort,
    noSearch,
    hasHeader: (headerItems?.length || 0) > 0,
    tabooSetId,
    filterQuery,
    textQuery,
    searchTerm,
    showAllNonCollection: showNonCollection,
    deckCardCounts: deckEdits?.slots,
    originalDeckSlots: currentDeckOnly ? undefined : deck?.deck.slots,
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

  const feedValues = useRef<{
    feed: DataProvider;
    fullFeed: PartialCard[];
  }>();
  useEffect(() => {
    feedValues.current = {
      feed,
      fullFeed,
    };
  }, [feed, fullFeed]);
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
    if (!feedValues.current) {
      return;
    }
    const { feed, fullFeed } = feedValues.current;
    const codes = map(fullFeed, (partialCard, idx) => {
      if (headerId === partialCard.headerId && cardId === partialCard.id) {
        index = idx;
      }
      return partialCard.code;
    });
    const cards = flatMap(feed.getAllData(), item => item.type === 'card' ? item.card : []);
    showCardSwipe(
      componentId,
      codes,
      index,
      colors,
      cards,
      showSpoilerCards,
      tabooSetOverride,
      deckId,
      investigator
    );
  }, [feedValues, showSpoilerCards, tabooSetOverride, singleCardView, colors, deckId, investigator, componentId, cardPressed]);
  const layoutProvider = useMemo(() => {
    return new LayoutProvider(
      index => itemHeight(feed.getDataForIndex(index), fontScale, headerHeight || 0),
      (height, dim) => {
        dim.height = height as number;
        dim.width = width;
      }
    );
  }, [width, feed, fontScale, headerHeight]);
  const deckLimits: ControlType[] = useMemo(() => deckId ? [
    {
      type: 'deck',
      deckId,
      limit: 0,
    },
    {
      type: 'deck',
      deckId,
      limit: 1,
    },
    {
      type: 'deck',
      deckId,
      limit: 2,
    },
    {
      type: 'deck',
      deckId,
      limit: 3,
    },
  ] : [], [deckId]);
  const renderItem = useCallback((type: string | number, item: Item) => {
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
        const deck_limit: number = card.collectionDeckLimit(packInCollection, ignore_collection);
        const control = deck_limit < deckLimits.length ? deckLimits[deck_limit] : undefined;
        return (
          <CardSearchResult
            card={card}
            onPressId={cardOnPressId}
            id={item.id}
            control={deckId !== undefined ? (control || {
              type: 'deck',
              deckId,
              limit: deck_limit,
            }) : undefined}
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
          <LoadingCardSearchResult />
        );
      case 'loading_message':
        return (
          <View style={{ width, paddingTop: Platform.OS === 'android' ? SEARCH_BAR_HEIGHT * 2 : 0 }}>
            <View style={styles.loadingText}>
              <Text style={[typography.text, typography.center]}>
                { `${loadingMessage}...` }
              </Text>
            </View>
          </View>
        );
      case 'text':
        return (
          <View style={item.border ? [styles.emptyText, borderStyle] : undefined}>
            <Text style={[typography.text, typography.center]}>
              { item.text}
            </Text>
          </View>
        )
      case 'padding':
        return <View style={{ height: item.size }} />;
      case 'list_header':
        return (
          <View style={[styles.column, { width: width }]}>
            { headerItems }
          </View>
        );
      default:
        return null;
    }
  }, [headerItems, width, cardOnPressId, deckId, packInCollection, ignore_collection, investigator, loadingMessage, renderCard, typography, deckLimits, borderStyle]);
  const listFooter = useCallback(() => {
    if (refreshing) {
      return null;
    }
    return (
      <View style={styles.footer}>
        { expandSearchControls }
      </View>
    );
  }, [expandSearchControls, refreshing]);
  const handleScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);
  const [debouncedRefreshing] = useDebounce(refreshing, 50, { leading: true });

  return (
    <RecyclerListView
      scrollViewProps={{
        onScrollBeginDrag: handleScrollBeginDrag,
        keyboardShouldPersistTaps: 'always',
        keyboardDismissMode: 'on-drag',
      }}
      refreshControl={
        <RefreshControl
          refreshing={!!debouncedRefreshing}
          onRefresh={refreshDeck}
          tintColor={colors.lightText}
          progressViewOffset={noSearch ? 0 : SEARCH_BAR_HEIGHT}
        />
      }
      dataProvider={feed}
      renderAheadOffset={width * 4}
      layoutProvider={layoutProvider}
      onScroll={handleScroll}
      rowRenderer={renderItem}
      onEndReached={fetchMore}
      scrollThrottle={1}
      onEndReachedThreshold={width * 2}
      renderFooter={listFooter}
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 300,
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
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
