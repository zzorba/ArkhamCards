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
  values,
} from 'lodash';
import {
  Keyboard,
  StyleSheet,
  View,
  Platform,
  Text,
} from 'react-native';
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
import space, { m } from '@styles/space';
import ArkhamButton from '@components/core/ArkhamButton';
import { searchBoxHeight } from '@components/core/SearchBox';
import StyleContext from '@styles/StyleContext';
import { useSimpleDeckEdits } from '@components/deck/hooks';
import { useDeck } from '@data/hooks';
import { useCards, useEffectUpdate, useSettingValue, useToggles } from '@components/core/hooks';
import LoadingCardSearchResult from '../LoadingCardSearchResult';
import { ControlType } from '../CardSearchResult/ControlComponent';
import { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import ArkhamLargeList from '@components/core/ArkhamLargeList';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useBondedFromCards } from '@components/card/CardDetailView/BondedCardsComponent';
import { useAppDispatch } from '@app/store';

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
  expandSearchControlsHeight?: number;
  investigator?: Card;
  cardPressed?: (card: Card) => void;
  renderCard?: (card: Card) => JSX.Element;
  headerItems?: React.ReactNode[];
  headerHeight?: number;
  noSearch?: boolean;
  handleScroll?: (...args: any[]) => void;
  showHeader?: () => void;
  storyOnly?: boolean;
  sideDeck?: boolean;
  showNonCollection?: boolean;
  footerPadding?: number;
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
  paddingTop?: number;
}
interface CardItem {
  type: 'card';
  id: string;
  card: Card;
}
interface LoadingCardItem {
  type: 'loading';
  id: string;
  message: boolean;
}

interface ButtonItem {
  type: 'button';
  id: string;
  onPress: () => void;
  title: string;
  icon: ArkhamButtonIconType;
}

interface FooterItem {
  type: 'footer';
  height: number;
  refreshing: boolean;
}

type Item = SectionHeaderItem | CardItem | ButtonItem | TextItem | LoadingCardItem | PaddingItem | ListHeader | FooterItem;

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
  sideDeck?: boolean;
  hasHeader?: boolean;
  investigator?: Card;
  footerPadding?: number;
  includeBonded?: boolean;
  expandSearchControlsHeight?: number;
}

interface SectionFeed {
  feed: Item[];
  fullFeed: PartialCard[];
  refreshing: boolean;
  refreshingSearch: boolean;
  fetchMore?: () => void;
  showSpoilerCards: boolean;
  refreshDeck?: () => void;
}

interface LoadedState {
  cards: PartialCard[];
  textQuery?: Brackets;
  loading: boolean;
}

function useSectionFeed({
  componentId,
  hasHeader,
  query,
  investigator,
  sort,
  tabooSetId,
  filterQuery,
  searchTerm,
  textQuery,
  showAllNonCollection,
  storyOnly,
  sideDeck,
  originalDeckSlots,
  deckCardCounts,
  includeBonded,
  footerPadding = 0,
  expandSearchControlsHeight = 0,
}: SectionFeedProps): SectionFeed {
  const { db } = useContext(DatabaseContext);
  const { fontScale } = useContext(StyleContext);
  const sortIgnoreQuotes = !useSettingValue('sort_quotes');
  const packSpoiler = useSelector(getPackSpoilers);
  const [expandButtonPressed, setExpandButtonPressed] = useState(false);
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
  const [showNonCollection, , setShowNonCollection, clearShowNonCollection] = useToggles({});
  const storyQuery = storyOnly ? query : undefined;

  const [deckQuery, hasDeckChanges, refreshDeck] = useDeckQuery(deckCardCounts, originalDeckSlots);
  const [{ cards: deckCards, textQuery: deckCardsTextQuery, loading: deckCardsLoading }, setDeckCards] = useState<LoadedState>({
    cards: [],
    loading: !!deckQuery,
  });
  const [{ cards: mainQueryCards, loading: mainQueryCardsLoading }, setMainQueryCards] = useState<LoadedState>({ cards: [], loading: true });
  const [{ cards: textQueryCards, textQuery: textQueryCardsTextQuery }, setTextQueryCards] = useState<LoadedState>({
    cards: [],
    loading: true,
  });

  useEffectUpdate(() => {
    setMainQueryCards({ cards: [], loading: true });
    setDeckCards({ cards: [], loading: true });
  }, [sort]);
  useEffect(() => {
    let ignore = false;
    if (!deckQuery) {
      setDeckCards({ cards: [], loading: false });
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
          setDeckCards({ cards, textQuery: searchTextQuery, loading: false });
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [db, storyQuery, textQuery, filterQuery, deckQuery, sortIgnoreQuotes, tabooSetId, sort, sideDeck]);
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
    const items: PartialItem[] = [];
    const result: PartialCard[] = [];
    let currentSectionId: string | undefined = undefined;
    if (deckCards.length && !deckCardsLoading) {
      if (investigator) {
        items.push({
          type: 'header',
          id: 'deck_superheader',
          header: {
            superTitle: sideDeck ? t`Side Deck` : t`In Deck`,
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
      if (!includeBonded) {
        items.push({
          type: 'header',
          id: 'all_cards',
          header: {
            superTitle: t`All Eligible Cards`,
          },
        });
      }
    }
    currentSectionId = undefined;
    let currentNonCollection: PartialCard[] = [];
    const [nonSpoilerCards, spoilerCards] = partition(partialCards, card => {
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
            icon: 'show',
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
        if (!showAllNonCollection && !ignore_collection && (card.pack_code !== 'core' || packInCollection.no_core) && !cardInCollection(card, packInCollection)) {
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
  }, [includeBonded, partialCards, deckCardsLoading, deckCards, showNonCollection, ignore_collection, packInCollection, packSpoiler, showSpoilers, hasDeckChanges,
    sideDeck, investigator, showAllNonCollection, editCollectionSettings, setShowNonCollection, refreshDeck]);

  const { cards, fetchMore } = useCardFetcher(visibleCards);
  const flatDeckCards: Card[] = useMemo(() => {
    if (includeBonded) {
      return flatMap(values(cards), c => c ? c : []);
    }
    return [];
  }, [cards, includeBonded]);
  const [bondedCards] = useBondedFromCards(flatDeckCards, sort || SORT_BY_TYPE, tabooSetId);

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

  useEffect(() => {
    let ignore = false;
    // This is for the really big changes.
    // Initially or when query/sort/tabooSetId change, we need to clear our fetched cards
    clearShowNonCollection();
    setShowSpoilers(false);
    setExpandButtonPressed(false);
    if (!query) {
      setMainQueryCards({ cards: [], loading: false });
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
        setMainQueryCards({ cards, loading: false });
        setRefreshing(false);
      }
    }, console.log);

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, sort, tabooSetId, sortIgnoreQuotes, db]);

  useDebouncedEffect(() => {
    if (!textQuery || !query) {
      setTextQueryCards({ cards: [], loading: false });
      return;
    }
    let ignore = false;
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
        setTextQueryCards({ cards, textQuery: searchTextQuery, loading: false });
      }
    });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, textQuery, sort, tabooSetId, sortIgnoreQuotes], 500);

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

  const refreshingSearch = (!!deckQuery && (deckCardsTextQuery !== textQuery || deckCardsLoading)) || (textQueryCardsTextQuery !== textQuery);
  const feedLoading = useMemo(() => {
    return (visibleCards.length > 0) && !!find(take(visibleCards, 1), c => !cards[c.id]);
  }, [visibleCards, cards]);

  const refreshingResult = refreshing || (feedLoading && !expandButtonPressed);
  const [sections, hasCards, cardsLoading] = useMemo(() => {
    const result: Item[] = [];
    let missingCards = false;
    let loadingSection = false;
    let noCards = true;
    let cardsLoading = false;
    let loadingCount = 0;
    forEach(partialItems, item => {
      if (item.type !== 'pc') {
        if (item.type === 'header') {
          loadingSection = false;
        }
        return;
      }
      const { id } = item.card;
      const card = cards[id];
      if (!card) {
        if (!loadingSection) {
          loadingSection = true;
          loadingCount ++;
        }
        return;
      }
      loadingSection = false;
    });

    for (let i = 0; i < partialItems.length; i++) {
      const item = partialItems[i];
      if (item.type !== 'pc') {
        result.push(item);
        loadingSection = false;
        continue;
      }
      const { headerId, id } = item.card;
      const card = cards[id];
      if (!card) {
        if (!loadingSection) {
          result.push({ type: 'loading', id: id, message: loadingCount > 1 });
          cardsLoading = true;
          if (loadingCount > 1) {
            break;
          }
          loadingSection = true;
          missingCards = true;
        }
        continue;
      }
      noCards = false;
      loadingSection = false;
      result.push({
        type: 'card',
        id: item.prefix ? `${item.prefix}_${headerId}.${id}` : `${headerId}.${id}`,
        card,
      });
    }
    if (!missingCards && spoilerCardsCount > 0 && loadingCount <= 1) {
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
    if (bondedCards.length) {
      result.push({
        type: 'header',
        id: 'bonded',
        header: {
          superTitle: t`Bonded`,
        },
      });
      forEach(bondedCards, (card: Card) => {
        result.push({
          type: 'card',
          id: card.id,
          card,
        });
      });
    }
    return [result, !(noCards && cardsLoading), cardsLoading];
  }, [partialItems, cards, bondedCards, showSpoilers, spoilerCardsCount, editSpoilerSettings]);

  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  const isRefreshing = !hasCards || refreshingResult || deckRefreshing;
  useEffectUpdate(() => {
    if (!isRefreshing) {
      setLoadingMessage(getRandomLoadingMessage());
    }
  }, [isRefreshing]);

  const refreshingFinal = isRefreshing || mainQueryCardsLoading;
  const feed = useMemo(() => {
    let loadingItem: Item | undefined = undefined;
    if (!sections.length || cardsLoading) {
      if (refreshingResult || cardsLoading) {
        if (!hasCards || refreshingResult) {
          loadingItem = {
            type: 'text',
            id: 'loading',
            text: loadingMessage,
            paddingTop: m + (Platform.OS === 'android' ? searchBoxHeight(fontScale) : 0),
          };
        }
      } else {
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
    }
    const headerItem: Item | undefined = hasHeader ? { type: 'list_header', id: 'list_header' } : undefined;
    const leadingItems: Item[] = [
      ...(headerItem ? [headerItem] : []),
      ...(loadingItem ? [loadingItem] : []),
    ];

    const sectionItems: Item[] = [
      ...leadingItems,
      ...(hasCards ? sections : []),
      { type: 'footer', height: footerPadding + (refreshingFinal ? 0 : expandSearchControlsHeight), refreshing: refreshingFinal },
    ];
    return sectionItems;
  }, [expandSearchControlsHeight, footerPadding, sections, fontScale, refreshingFinal, loadingMessage, cardsLoading, hasHeader, refreshingResult, refreshingSearch, searchTerm, hasCards]);
  return {
    feed,
    fullFeed: visibleCards,
    refreshing: refreshingFinal,
    refreshingSearch,
    fetchMore,
    showSpoilerCards: showSpoilers,
    refreshDeck: deckQuery ? doRefresh : undefined,
  };
}

function itemHeight(item: Item, fontScale: number, headerHeight: number, lang: string): number {
  switch (item.type) {
    case 'button':
      return ArkhamButton.computeHeight(fontScale, lang);
    case 'card':
    case 'loading':
      return rowHeight(fontScale);
    case 'header':
      return cardSectionHeaderHeight(item.header, fontScale);
    case 'text':
      return m * 2 + fontScale * 24 * 2 + (item.paddingTop || 0);
    case 'padding':
      return item.size;
    case 'list_header':
      return headerHeight;
    case 'footer':
      return item.height;
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
  expandSearchControlsHeight,
  investigator,
  renderCard,
  cardPressed,
  noSearch,
  headerItems,
  headerHeight,
  handleScroll,
  showHeader,
  storyOnly,
  sideDeck,
  showNonCollection,
  footerPadding,
}: Props) {
  const { db } = useContext(DatabaseContext);
  const deck = useDeck(deckId);
  const deckEdits = useSimpleDeckEdits(deckId);
  const { colors, borderStyle, fontScale, typography, width } = useContext(StyleContext);
  const tabooSetOverride = deckId !== undefined ? ((deckEdits?.tabooSetChange || deck?.deck.taboo_id) || 0) : undefined;
  const tabooSetSelctor = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelctor(state, tabooSetOverride));
  const singleCardView = useSettingValue('single_card');
  const packInCollection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');
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
    hasHeader: (headerItems?.length || 0) > 0,
    tabooSetId,
    filterQuery,
    textQuery,
    searchTerm,
    showAllNonCollection: showNonCollection,
    deckCardCounts: sideDeck ? deckEdits?.side : deckEdits?.slots,
    originalDeckSlots: (currentDeckOnly && (sideDeck ? deck?.deck.sideSlots : deck?.deck.slots)) || undefined,
    includeBonded: currentDeckOnly,
    storyOnly,
    sideDeck,
    expandSearchControlsHeight,
    footerPadding,
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    // showHeader when somethings drastic happens, and get a new error message.
    showHeader && showHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterQuery, tabooSetId, sort]);
  const filterId = deckId?.uuid || componentId;
  useEffect(() => {
    dispatch(addDbFilterSet(filterId, db, query, initialSort || SORT_BY_TYPE, tabooSetId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tabooSetId]);

  const feedValues = useRef<{
    feed: Item[];
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
    const cards = flatMap(feed, item => item.type === 'card' ? item.card : []);
    showCardSwipe(
      componentId,
      codes,
      sideDeck ? 'side' : undefined,
      index,
      colors,
      cards,
      showSpoilerCards,
      tabooSetOverride,
      deckId,
      investigator,
      true
    );
  }, [feedValues, showSpoilerCards, tabooSetOverride, singleCardView, colors, deckId, investigator, componentId, sideDeck, cardPressed]);
  const deckLimits: ControlType[] = useMemo(() => deckId ? [
    {
      type: 'deck',
      deckId,
      limit: 0,
      side: !!sideDeck,
    },
    {
      type: 'deck',
      deckId,
      limit: 1,
      side: !!sideDeck,
    },
    {
      type: 'deck',
      deckId,
      limit: 2,
      side: !!sideDeck,
    },
    {
      type: 'deck',
      deckId,
      limit: 3,
      side: !!sideDeck,
    },
    {
      type: 'deck',
      deckId,
      limit: 4,
      side: !!sideDeck,
    },
  ] : [], [deckId, sideDeck]);

  const renderItem = useCallback((item: Item) => {
    switch (item.type) {
      case 'button':
        return (
          <ArkhamButton
            key={item.id}
            title={item.title}
            onPress={item.onPress}
            icon={item.icon}
            useGestureHandler={Platform.OS === 'ios'}
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
            useGestureHandler={Platform.OS === 'ios'}
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
          <View key={item.id} style={[
            item.border ? styles.emptyText : space.paddingM,
            item.border ? borderStyle : undefined,
            item.paddingTop ? { paddingTop: item.paddingTop } : undefined,
          ]}>
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
      case 'footer':
        if (item.refreshing) {
          return <View style={{ height: footerPadding || 0 }} />;
        }
        return (
          <View style={{ paddingBottom: footerPadding || 0 }}>
            { expandSearchControls }
          </View>
        );
      default:
        return <View />;
    }
  }, [headerItems, expandSearchControls, footerPadding, width, cardOnPressId, deckId, packInCollection, ignore_collection, investigator, renderCard, typography, deckLimits, borderStyle]);
  const { lang } = useContext(LanguageContext);
  const heightForItem = useCallback((item: Item): number => {
    return itemHeight(item, fontScale, headerHeight || 0, lang);
  }, [fontScale, headerHeight, lang]);
  return (
    <ArkhamLargeList
      data={feed}
      heightForItem={heightForItem}
      renderItem={renderItem}
      onScroll={handleScroll}
      onLoading={fetchMore}
      onRefresh={refreshDeck}
      refreshing={refreshing || refreshingSearch}
      noSearch={noSearch}
    />
  );
}

const styles = StyleSheet.create({
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
