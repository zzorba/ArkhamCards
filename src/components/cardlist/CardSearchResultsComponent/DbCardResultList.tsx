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
  Animated,
  Keyboard,
  StyleSheet,
  View,
  Platform,
  Text,
} from 'react-native';
import { IndexPath, LargeList, WaterfallList } from 'react-native-largelist';
import { Brackets } from 'typeorm/browser';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';
import useDebouncedEffect from 'use-debounced-effect-hook';

import { useArkhamLottieHeader } from '@components/core/ArkhamLoadingSpinner';
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
import { NormalFooter } from 'react-native-spring-scrollview';

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

interface ButtonItem {
  type: 'button';
  id: string;
  onPress: () => void;
  title: string;
  icon: ArkhamButtonIconType;
}

type Item = SectionHeaderItem | CardItem | ButtonItem | TextItem | LoadingCardItem | PaddingItem | ListHeader;

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
  investigator?: Card;
  listRef?: Ref<LargeList>;
}

interface Section {
  header?: SectionHeaderItem;
  items: Item[];
}

interface SectionFeed {
  feed: Section[];
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
  investigator,
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
  listRef,
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
  useEffectUpdate(() => {
    setDeckCards({ cards: [], textQuery: undefined });
  }, [sort]);
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
      if (investigator) {
        items.push({
          type: 'header',
          id: 'deck_superheader',
          header: {
            superTitle: t`In Deck`,
            superTitleIcon: 'refresh',
            onPress: hasDeckChanges ? refreshDeck : undefined,
          },
        });
      }
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
  }, [partialCards, investigator, deckCards, showNonCollection, ignore_collection, packInCollection, packSpoiler, showSpoilers, editCollectionSettings, setShowNonCollection, showAllNonCollection, hasDeckChanges, refreshDeck]);

  const { cards, fetchMore } = useCardFetcher(visibleCards);
  const [refreshing, setRefreshing] = useState(true);
  const [deckRefreshing, setDeckRefreshing] = useState(false);
  const doRefresh = useCallback(() => {
    if (deckQuery) {
      setDeckRefreshing(true);
      refreshDeck();
      let canceled = false;
      setTimeout(() => {
        if (!canceled) {
          setDeckRefreshing(false);
        }
      }, 1000);
      return () => {
        canceled = true;
      };
    }
  }, [deckQuery, refreshDeck]);

  useEffectUpdate(() => {
    // Dump the cards when our search changes dramatically.
    setRefreshing(true);
    setMainQueryCards([]);
  }, [sort]);


  useEffect(() => {
    let ignore = false;
    // This is for the really big changes.
    // Initially or when query/sort/tabooSetId change, we need to clear our fetched cards
    clearShowNonCollection();
    setShowSpoilers(false);
    setExpandButtonPressed(false);
    if (!query) {
      setMainQueryCards([]);
      setRefreshing(false);
      return;
    }
    setRefreshing(true);

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
  const [sections, hasCards] = useMemo(() => {
    const result: Section[] = [];
    let currentSection: Section = { items: [] };
    let missingCards = false;
    let loadingSection = false;
    let noCards = true;
    forEach(partialItems, item => {
      if (item.type !== 'pc') {
        if (item.type === 'header' && !item.header.superTitle) {
          if (currentSection.header || currentSection.items.length) {
            result.push(currentSection);
          }
          currentSection = {
            header: item,
            items: [],
          };
        } else {
          currentSection.items.push(item);
        }
        loadingSection = false;
        return;
      }
      const { headerId, id } = item.card;
      const card = cards[id];
      if (!card) {
        if (!loadingSection) {
          currentSection.items.push({ type: 'loading', id: id });
          loadingSection = true;
          missingCards = true;
        }
        return;
      }
      loadingSection = false;
      noCards = false;
      currentSection.items.push({
        type: 'card',
        id: item.prefix ? `${item.prefix}_${headerId}.${id}` : `${headerId}.${id}`,
        card,
      });
    });
    if (!missingCards && spoilerCardsCount > 0) {
      if (showSpoilers) {
        currentSection.items.push({
          type: 'button',
          id: 'edit_spoilers',
          onPress: editSpoilerSettings,
          title: t`Edit spoiler settings`,
          icon: 'edit',
        });
      } else {
        currentSection.items.push({
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
    if (currentSection.header || currentSection.items.length) {
      result.push(currentSection);
    }
    return [result, !noCards];
  }, [partialItems, cards, showSpoilers, spoilerCardsCount, editSpoilerSettings]);

  const feed = useMemo(() => {
    let loadingItem: Item | undefined = undefined;
    if (!sections.length && !refreshingResult) {
      if (refreshingSearch) {
        loadingItem = {
          type: 'text',
          id: 'searching',
          text: t`Searching cards...`,
        };
      } else {
        if (searchTerm) {
          loadingItem = {
            type: 'text',
            id: 'no_results_search',
            text: t`No matching cards for "${searchTerm}"`,
            border: true,
          };
        } else {
          loadingItem = {
            type: 'text',
            id: 'no_results_search',
            text: t`No matching cards`,
            border: true,
          };
        }
      }
    }
    const paddingItem: Item | undefined = !noSearch ? { type: 'padding', id: 'padding', size: SEARCH_BAR_HEIGHT } : undefined;
    const headerItem: Item | undefined = hasHeader ? { type: 'list_header', id: 'list_header' } : undefined;
    const leadingItems: Item[] = [
      ...(paddingItem ? [paddingItem] : []),
      ...(headerItem ? [headerItem] : []),
      ...(loadingItem ? [loadingItem] : []),
    ];
    const sectionItems: Section[] = [
      ...(leadingItems.length ? [{ items: leadingItems }] : []),
      ...(hasCards ? sections : []),
    ];
    return sectionItems;
  }, [sections, noSearch, hasHeader, refreshingResult, refreshingSearch, searchTerm, hasCards]);
  return {
    feed,
    fullFeed: visibleCards,
    refreshing: !hasCards || refreshingResult || deckRefreshing,
    refreshingSearch,
    fetchMore,
    showSpoilerCards: showSpoilers,
    refreshDeck: deckQuery ? doRefresh : undefined,
  };
}

function itemHeight(item: Item, fontScale: number, headerHeight: number): number {
  switch (item.type) {
    case 'button':
      return ArkhamButton.Height(fontScale);
    case 'card':
    case 'loading':
      return rowHeight(fontScale);
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
  const deck = useDeck(deckId);
  const deckEdits = useSimpleDeckEdits(deckId);
  const { colors, borderStyle, fontScale, typography, height, width } = useContext(StyleContext);
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const tabooSetOverride = deckId !== undefined ? ((deckEdits?.tabooSetChange || deck?.deck.taboo_id) || 0) : undefined;
  const tabooSetSelctor = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelctor(state, tabooSetOverride));
  const singleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const listRef = useRef<LargeList>(null);
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
    investigator,
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
    listRef,
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
    feed: Section[];
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
    const cards = flatMap(feed, ({ items }) => flatMap(items, item => item.type === 'card' ? item.card : []));
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
  const listFooter = useCallback(() => {
    if (refreshing) {
      return <View />;
    }
    return (
      <View style={styles.footer}>
        { expandSearchControls }
      </View>
    );
  }, [expandSearchControls, refreshing]);
  const [debouncedRefreshing] = useDebounce(refreshing || refreshingSearch, 50, { leading: true });
  const extraPaddingTop = useRef(new Animated.Value(0));
  useEffect(() => {
    if (debouncedRefreshing) {
      listRef.current?.beginRefresh();
      Animated.timing(extraPaddingTop.current, {
        toValue: SEARCH_BAR_HEIGHT,
        duration: 0,
        useNativeDriver: false,
      }).start();
    } else {
      setTimeout(() => {
        listRef.current?.endRefresh();
        Animated.timing(extraPaddingTop.current, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }, 200);
    }
  }, [listRef, debouncedRefreshing]);

  const renderSection = useCallback((section: number) => {
    const item = feed[section].header;
    if (!item) {
      return <View />;
    }
    return (
      <CardSectionHeader
        section={item.header}
        investigator={investigator}
      />
    )
  }, [feed, investigator]);

  const renderIndexPath = useCallback(({ section, row }: IndexPath) => {
    const item = feed[section].items[row];
    switch (item.type) {
      case 'button':
        return (
          <ArkhamButton
            key={item.id}
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
            key={item.id}
            card={card}
            onPressId={cardOnPressId}
            id={item.id}
            backgroundColor="transparent"
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
            key={item.id}
            section={item.header}
            investigator={investigator}
          />
        );
      case 'loading':
        return (
          <LoadingCardSearchResult key={item.id} />
        );
      case 'text':
        return (
          <View key={item.id} style={item.border ? [styles.emptyText, borderStyle] : undefined}>
            <Text style={[typography.text, typography.center]}>
              { item.text}
            </Text>
          </View>
        )
      case 'padding':
        return <View key={item.id} style={{ height: item.size }} />;
      case 'list_header':
        return (
          <View key={item.id} style={[styles.column, { width: width }]}>
            { headerItems }
          </View>
        );
      default:
        return <View />;
    }
  }, [feed, headerItems, width, cardOnPressId, deckId, packInCollection, ignore_collection, investigator, loadingMessage, renderCard, typography, deckLimits, borderStyle]);
  const renderItem = useCallback((item: Item) => {
    switch (item.type) {
      case 'button':
        return (
          <ArkhamButton
            key={item.id}
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
            key={item.id}
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
            key={item.id}
            section={item.header}
            investigator={investigator}
          />
        );
      case 'loading':
        return (
          <LoadingCardSearchResult key={item.id} />
        );
      case 'loading_message':
        return (
          <View
            key={item.id}
            style={{ width, paddingTop: Platform.OS === 'android' ? SEARCH_BAR_HEIGHT * 2 : 0 }}
          >
            <View style={styles.loadingText}>
              <Text style={[typography.text, typography.center]}>
                { `${loadingMessage}...` }
              </Text>
            </View>
          </View>
        );
      case 'text':
        return (
          <View
            key={item.id}
            style={item.border ? [styles.emptyText, borderStyle] : undefined}
          >
            <Text style={[typography.text, typography.center]}>
              { item.text}
            </Text>
          </View>
        )
      case 'padding':
        return <View style={{ height: item.size }} key={item.id} />;
      case 'list_header':
        return (
          <View key={item.id} style={[styles.column, { width: width }]}>
            { headerItems }
          </View>
        );
      default:
        return <View />;
    }
  }, [headerItems, width, cardOnPressId, deckId, packInCollection, ignore_collection, investigator, loadingMessage, renderCard, typography, deckLimits, borderStyle]);
  const heightForSection = useCallback((section: number) => {
    const header = feed[section].header;
    if (!header) {
      return 0;
    }
    return itemHeight(header, fontScale, headerHeight || 0);
  }, [feed, fontScale, headerHeight]);
  const heightForIndexPath = useCallback(({ section, row }: IndexPath) => {
    const item = feed[section].items[row];
    return itemHeight(item, fontScale, headerHeight || 0);
  }, [feed, fontScale, headerHeight]);

  const heightForItem = useCallback((item: Item) => {
    return itemHeight(item, fontScale, headerHeight || 0);
  }, [fontScale, headerHeight]);
  const onRefresh = useCallback(() => {
    if (debouncedRefreshing) {
      return;
    }
    console.log('onRefresh called');
    if (refreshDeck) {
      refreshDeck?.();
    } else {
      // Just let it spin for half a second
      setTimeout(() => {
        console.log('Finished spinning down from onRefresh');
        listRef.current?.endRefresh();
      }, 500)
    }
  }, [debouncedRefreshing, refreshDeck]);
  const ArkhamLottieHeader = useArkhamLottieHeader(noSearch, !!deckId);
  const listHeader = useCallback(() => {
    return <Animated.View style={{ height: deckId ? 0 : extraPaddingTop.current }} />;
  }, [deckId, extraPaddingTop]);
  return (
    <LargeList
      ref={listRef}
      data={feed}
      contentStyle={{ overflow: 'visible' }}
      heightForSection={heightForSection}
      heightForIndexPath={heightForIndexPath}
      renderSection={renderSection}
      renderIndexPath={renderIndexPath}
      renderHeader={listHeader}
      renderFooter={listFooter}
      refreshHeader={ArkhamLottieHeader}
      dragToHideKeyboard
      onRefresh={onRefresh}
      onScroll={handleScroll}
      onLoading={fetchMore}
      headerStickyEnabled={false}
      updateTimeInterval={Platform.OS === 'ios' ? 100 : 50}
      groupCount={Platform.OS === 'ios' ? 20 : 16}
      groupMinHeight={height / 2}
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
