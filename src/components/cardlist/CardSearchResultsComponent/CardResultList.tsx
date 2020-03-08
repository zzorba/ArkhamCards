import React, { ReactNode } from 'react';
import {
  concat,
  debounce,
  flatMap,
  filter,
  forEach,
  keys,
  isEqual,
  map,
  partition,
  random,
  throttle,
  uniq,
} from 'lodash';
import {
  ActivityIndicator,
  Animated,
  Button,
  Keyboard,
  SectionList,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  TextStyle,
  SectionListData,
} from 'react-native';
import Realm, { Results } from 'realm';
import { connectRealm, Sort } from 'react-native-realm';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import ShowNonCollectionFooter, { rowNonCollectionHeight } from './ShowNonCollectionFooter';
import CardSearchResult from '../CardSearchResult';
import { rowHeight } from '../CardSearchResult/constants';
import CardSectionHeader, { rowHeaderHeight } from '../CardSearchResultsComponent/CardSectionHeader';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
  Slots,
} from 'actions/types';
import { getPackSpoilers, getPacksInCollection, getTabooSet, AppState } from 'reducers';
import Card from 'data/Card';
import { showCard, showCardSwipe } from 'components/nav/helper';
import typography from 'styles/typography';
import { s, m } from 'styles/space';

const SCROLL_DISTANCE_BUFFER = 50;

function funLoadingMessages() {
  return [
    t`Investigating for clues`,
    t`Cursing at the tentacle token`,
    t`Drawing a mythos card with surge`,
    t`Placing doom on the agenda`,
    t`Reticulating spines`,
    t`Trying to make sense of the Time Warp FAQ`,
    t`Taking three damage and three horror`,
    t`Up by 5, hope I don't draw the tentacle`,
  ];
}

interface OwnProps {
  componentId: string;
  fontScale: number;
  query?: string;
  filterQuery?: string;
  termQuery?: string;
  searchTerm?: string;
  sort?: SortType;
  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  tabooSetOverride?: number;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  cardPressed?: (card: Card) => void;
  showHeader: () => void;
  hideHeader: () => void;
  visible: boolean;
  showNonCollection?: boolean;
  expandSearchControls?: ReactNode;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  storyOnly?: boolean;
}

interface ReduxProps {
  singleCardView: boolean;
  show_spoilers: {
    [code: string]: boolean;
  };
  in_collection: {
    [code: string]: boolean;
  };
  hasSecondCore: boolean;
  tabooSetId?: number;
}

interface RealmProps {
  realm: Realm;
}

type Props = OwnProps & ReduxProps & RealmProps;

interface State {
  resultsKey: string;
  deckSections: CardBucket[];
  cards: CardBucket[];
  cardsCount: number;
  deckCardCounts?: Slots;
  spoilerCards: CardBucket[];
  spoilerCardsCount: number;
  showSpoilerCards: boolean;
  showNonCollection: {
    [code: string]: boolean;
  };
  loadingMessage: string;
  dirty: boolean;
  scrollY: Animated.Value;
}

interface CardBucket {
  title: string;
  bold?: boolean;
  id: string;
  data: Card[];
  nonCollectionCount?: number;
}

class CardResultList extends React.Component<Props, State> {
  static randomLoadingMessage() {
    const messages = funLoadingMessages();
    return messages[random(0, messages.length - 1)];
  }

  lastOffsetY: number = 0;
  hasPendingCountChanges: boolean = false;
  _throttledUpdateResults!: () => void;
  _handleScroll!: (...args: any[]) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      resultsKey: '',
      deckSections: [],
      cards: [],
      cardsCount: 0,
      deckCardCounts: props.deckCardCounts || {},
      spoilerCards: [],
      spoilerCardsCount: 0,
      showSpoilerCards: false,
      showNonCollection: {},
      loadingMessage: CardResultList.randomLoadingMessage(),
      dirty: false,
      scrollY: new Animated.Value(0),
    };

    this._handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      {
        listener: this._onScroll,
      },
    );

    this._throttledUpdateResults = debounce(
      this._updateResults,
      250,
      { trailing: true }
    );
  }

  _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  };

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  _throttledScroll = throttle(
    (offsetY: number) => {
      if (offsetY <= 0) {
        this.props.showHeader();
      } else {
        const delta = Math.abs(offsetY - this.lastOffsetY);
        if (delta < SCROLL_DISTANCE_BUFFER) {
          // Not a long enough scroll, don't update scrollY and don't take any
          // action at all.
          return;
        }

        // We have a decent sized scroll so we will make a direction based
        // show/hide decision UNLESS we are near the top/bottom of the content.
        const scrollingUp = offsetY < this.lastOffsetY;

        if (scrollingUp) {
          if (this.hasPendingCountChanges) {
            this.hasPendingCountChanges = false;
            this._throttledUpdateResults();
          }
          this.props.showHeader();
        } else {
          this.props.hideHeader();
        }
      }

      this.lastOffsetY = offsetY;
    },
    100,
    { trailing: true }
  );

  _handleScrollBeginDrag = () => {
    Keyboard.dismiss();
  };

  componentDidMount() {
    this._updateResults();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      deckCardCounts,
      visible,
    } = this.props;
    const {
      dirty,
    } = this.state;
    const updateDeckCardCounts = !isEqual(prevProps.deckCardCounts, deckCardCounts);
    if ((visible && !prevProps.visible && dirty) ||
        prevProps.query !== this.props.query ||
        prevProps.termQuery !== this.props.termQuery ||
        prevProps.sort !== this.props.sort ||
        prevProps.searchTerm !== this.props.searchTerm ||
        prevProps.show_spoilers !== this.props.show_spoilers ||
        prevProps.in_collection !== this.props.in_collection ||
        prevProps.tabooSetId !== this.props.tabooSetId
    ) {
      if (visible) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          dirty: false,
          showNonCollection: {},
          deckCardCounts: updateDeckCardCounts ? deckCardCounts : this.state.deckCardCounts,
        }, this._throttledUpdateResults);
      } else if (!dirty) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          dirty: true,
          deckCardCounts: updateDeckCardCounts ? deckCardCounts : this.state.deckCardCounts,
        });
      }
    } else if (updateDeckCardCounts) {
      if (this.lastOffsetY <= 0) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          deckCardCounts: deckCardCounts,
        }, this._throttledUpdateResults);
        this.hasPendingCountChanges = false;
      } else {
        this.setState({
          deckCardCounts: deckCardCounts,
        });
        this.hasPendingCountChanges = true;
      }
    }
  }

  _enableSpoilers = () => {
    Keyboard.dismiss();
    this.setState({
      showSpoilerCards: true,
    });
  };

  _showNonCollectionCards = (id: string) => {
    Keyboard.dismiss();
    this.setState({
      showNonCollection: Object.assign(
        {},
        this.state.showNonCollection,
        { [id]: true },
      ),
    }, this._throttledUpdateResults);
  };

  _editCollectionSettings = () => {
    Keyboard.dismiss();
    Navigation.push<{}>(this.props.componentId, {
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
  };

  _editSpoilerSettings = () => {
    Keyboard.dismiss();
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
        options: {
          topBar: {
            title: {
              text: t`Spoiler Settings`,
            },
          },
        },
      },
    });
  };

  getSort(): Sort[] {
    switch(this.props.sort) {
      case SORT_BY_TYPE:
        return [['sort_by_type', false], ['renderName', false], ['xp', false]];
      case SORT_BY_FACTION:
        return [['sort_by_faction', false], ['renderName', false], ['xp', false]];
      case SORT_BY_COST:
        return [['cost', false], ['renderName', false], ['xp', false]];
      case SORT_BY_PACK:
        return [['sort_by_pack', false], ['position', false]];
      case SORT_BY_TITLE:
        return [['renderName', false], ['xp', false]];
      case SORT_BY_ENCOUNTER_SET:
        return [['sort_by_pack', false], ['encounter_code', false], ['encounter_position', false]];
      default:
        return [['renderName', false], ['xp', false]];
    }
  }

  static headerForCard(card: Card, sort?: SortType): string {
    switch(sort) {
      case SORT_BY_TYPE:
        return Card.typeSortHeader(card);
      case SORT_BY_FACTION:
        return Card.factionSortHeader(card);
      case SORT_BY_COST:
        if (card.cost === null) {
          return t`Cost: None`;
        }
        return t`Cost: ${card.cost}`;
      case SORT_BY_PACK:
        return card.pack_name;
      case SORT_BY_TITLE:
        return t`All Cards`;
      case SORT_BY_ENCOUNTER_SET:
        return card.encounter_name ||
          (card.linked_card && card.linked_card.encounter_name) ||
          t`N/A`;
      default:
        return t`All Cards`;
    }
  }

  bucketCards(
    cards: Results<Card> | Card[],
    keyPrefix: string
  ): CardBucket[] {
    const {
      in_collection,
      sort,
    } = this.props;
    const {
      showNonCollection,
    } = this.state;
    const results: CardBucket[] = [];
    let nonCollectionCards: Card[] = [];
    let currentBucket: CardBucket | null = null;
    cards.forEach(card => {
      const header = CardResultList.headerForCard(card, sort);
      if (!currentBucket || currentBucket.title !== header) {
        if (currentBucket && nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, c => {
              // @ts-ignore
              currentBucket.data.push(c);
            });
          }
          currentBucket.nonCollectionCount = nonCollectionCards.length;
          nonCollectionCards = [];
        }
        currentBucket = {
          title: header,
          id: `${keyPrefix}-${results.length}`,
          data: [],
          nonCollectionCount: 0,
        };
        results.push(currentBucket);
      }
      if (card && card.pack_code && (
        keyPrefix === 'deck' ||
        card.pack_code === 'core' ||
        in_collection[card.pack_code] ||
        this.props.showNonCollection)
      ) {
        currentBucket.data.push(card);
      } else {
        nonCollectionCards.push(card);
      }
    });

    // One last snap of the non-collection cards
    if (currentBucket !== null && nonCollectionCards.length > 0) {
      // @ts-ignore
      if (showNonCollection[currentBucket.id]) {
        forEach(nonCollectionCards, c => {
          // @ts-ignore
          currentBucket.data.push(c);
        });
      }
      // @ts-ignore
      currentBucket.nonCollectionCount = nonCollectionCards.length;
      nonCollectionCards = [];
    }
    return results;
  }

  resultsKey() {
    const {
      query,
      termQuery,
      searchTerm,
      show_spoilers,
      sort,
    } = this.props;
    return (
      `q:${query},tq:${termQuery},s:${searchTerm},sp:${show_spoilers},st:${sort}`
    );
  }

  deckSections(): CardBucket[] {
    const {
      realm,
      originalDeckSlots,
      tabooSetId,
      searchTerm,
      termQuery,
      filterQuery,
      storyOnly,
      query,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    if (!originalDeckSlots) {
      return [];
    }
    const codes = filter(
      uniq(concat(keys(originalDeckSlots), keys(deckCardCounts))),
      code => originalDeckSlots[code] > 0 ||
        (deckCardCounts && deckCardCounts[code] > 0));
    const deckQuery = map(codes, code => ` (code == '${code}')`).join(' OR ');
    if (!deckQuery) {
      return this.bucketCards([], 'deck');
    }
    const queryParts: string[] = [
      `(${deckQuery})`,
      Card.tabooSetQuery(tabooSetId),
    ];
    if (storyOnly && query) {
      queryParts.push(query);
    }
    if (filterQuery) {
      queryParts.push(filterQuery);
    }
    const finalQuery = queryParts.join(' AND ');
    const possibleDeckCards: Results<Card> = realm.objects<Card>('Card')
      .filtered(finalQuery);
    const deckCards: Results<Card> = (termQuery ?
      possibleDeckCards.filtered(termQuery, searchTerm) :
      possibleDeckCards).sorted(this.getSort());

    return this.bucketCards(deckCards, 'deck');
  }

  getCards(query?: string) {
    const {
      realm,
      termQuery,
      searchTerm,
      tabooSetId,
    } = this.props;
    let parsedSearchTerm = searchTerm;
    if (parsedSearchTerm) {
      // replace "smart" single and double quotes
      parsedSearchTerm = parsedSearchTerm
        .replace(/[\u2018\u2019]/g, '\'')
        .replace(/[\u201C\u201D]/g, '"');
    }
    const queryCards: Results<Card> = (query ?
      realm.objects<Card>('Card').filtered(
        `(${query}) and ${Card.tabooSetQuery(tabooSetId)}`,
        parsedSearchTerm
      ) : realm.objects<Card>('Card').filtered(
        Card.tabooSetQuery(tabooSetId)
      )
    );
    return (termQuery ?
      queryCards.filtered(termQuery, parsedSearchTerm) :
      queryCards
    ).sorted(this.getSort());
  }

  _updateResults = () => {
    const {
      query,
      show_spoilers,
    } = this.props;
    this.setState({
      loadingMessage: CardResultList.randomLoadingMessage(),
    });
    const resultsKey = this.resultsKey();
    const cards: Results<Card> = this.getCards(query);
    const groupedCards = partition(
      cards,
      card => {
        return show_spoilers[card.pack_code] ||
          !(card.spoiler || (card.linked_card && card.linked_card.spoiler));
      });

    this.setState({
      resultsKey: resultsKey,
      deckSections: this.deckSections(),
      cards: this.bucketCards(groupedCards[0], 'cards'),
      cardsCount: groupedCards[0].length,
      spoilerCards: this.bucketCards(groupedCards[1], 'spoiler'),
      spoilerCardsCount: groupedCards[1].length,
    });
  };

  _cardToKey = (card: Card) => {
    return card.code;
  };

  _cardPressed = (id: string, card: Card) => {
    const {
      cardPressed,
      componentId,
      tabooSetOverride,
      onDeckCountChange,
      investigator,
      renderFooter,
      singleCardView,
    } = this.props;
    if (singleCardView) {
      showCard(
        componentId,
        card.code,
        card,
        true,
        tabooSetOverride
      );
      return;
    }
    const {
      deckCardCounts,
      showSpoilerCards,
    } = this.state;

    cardPressed && cardPressed(card);
    const [sectionId, cardIndex] = id.split('.');
    let index = 0;
    const cards: Card[] = [];
    forEach(this.getData(), section => {
      if (sectionId === section.id) {
        index = cards.length + parseInt(cardIndex, 10);
      }
      forEach(section.data, card => {
        cards.push(card);
      });
    });
    showCardSwipe(
      componentId,
      cards,
      index,
      showSpoilerCards,
      tabooSetOverride,
      deckCardCounts,
      onDeckCountChange,
      investigator,
      renderFooter,
    );
  };

  _getItem = (data: Card[], index: number) => {
    return data[index];
  };

  _renderSectionHeader = ({ section }: { section: SectionListData<CardBucket> }) => {
    const { fontScale } = this.props;
    return (
      <CardSectionHeader
        title={section.title}
        bold={section.bold}
        fontScale={fontScale}
      />
    );
  };

  _renderSectionFooter = ({ section }: { section: SectionListData<CardBucket> }) => {
    const { fontScale } = this.props;
    const {
      showNonCollection,
    } = this.state;
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <View style={[styles.sectionFooterButton, { height: rowNonCollectionHeight(fontScale) }]}>
          <Button
            title={t`Edit Collection`}
            onPress={this._editCollectionSettings}
          />
        </View>
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        fontScale={fontScale}
        title={ngettext(
          msgid`Show ${section.nonCollectionCount} Non-Collection Card`,
          `Show ${section.nonCollectionCount} Non-Collection Cards`,
          section.nonCollectionCount)}
        onPress={this._showNonCollectionCards}
      />
    );
  };

  _renderCard = ({ item, index, section }: {
    item: Card;
    index: number;
    section: SectionListData<CardBucket>;
  }) => {
    const {
      limits,
      hasSecondCore,
      fontScale,
      onDeckCountChange,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    return (
      <CardSearchResult
        card={item}
        fontScale={fontScale}
        count={deckCardCounts && deckCardCounts[item.code]}
        onDeckCountChange={onDeckCountChange}
        id={`${section.id}.${index}`}
        onPressId={this._cardPressed}
        limit={limits ? limits[item.code] : undefined}
        hasSecondCore={hasSecondCore}
      />
    );
  };

  renderEmptyState() {
    const {
      searchTerm,
    } = this.props;
    const {
      cardsCount,
      spoilerCardsCount,
    } = this.state;
    if (!this.isLoading() && (cardsCount + spoilerCardsCount) === 0) {
      return (
        <View>
          <View style={styles.emptyText}>
            <Text style={typography.text}>
              { searchTerm ?
                t`No matching cards for "${searchTerm}"` :
                t`No matching cards` }
            </Text>
          </View>
          { this.props.expandSearchControls }
        </View>
      );
    }
    return this.props.expandSearchControls;
  }

  _renderFooter = () => {
    const {
      spoilerCardsCount,
      showSpoilerCards,
    } = this.state;
    if (!spoilerCardsCount) {
      return (
        <View style={styles.footer}>
          { this.renderEmptyState() }
        </View>
      );
    }
    if (showSpoilerCards) {
      return (
        <View style={styles.footer}>
          <View style={styles.button}>
            <Button
              onPress={this._editSpoilerSettings}
              title={t`Edit Spoiler Settings`}
            />
          </View>
          { this.renderEmptyState() }
        </View>
      );
    }
    const spoilerCount = ngettext(
      msgid`Show ${spoilerCardsCount} Spoiler`,
      `Show ${spoilerCardsCount} Spoilers`,
      spoilerCardsCount);
    return (
      <View style={styles.footer}>
        <View style={styles.button}>
          <Button onPress={this._enableSpoilers} title={spoilerCount} />
        </View>
        <View style={styles.button}>
          <Button
            onPress={this._editSpoilerSettings}
            title={t`Edit Spoiler Settings`}
          />
        </View>
        { this.renderEmptyState() }
      </View>
    );
  };

  getData(): CardBucket[] {
    const {
      cards,
      spoilerCards,
      showSpoilerCards,
      deckSections,
    } = this.state;
    const startCards = deckSections.length ?
      concat(
        [{
          title: t`In Deck`,
          bold: true,
          data: [],
          id: 'InDeck',
        }],
        deckSections,
        [{
          title: t`All Eligible Cards`,
          bold: true,
          data: [],
          id: 'AllEligibleCards',
        }],
        cards,
      ) : cards;

    if (!showSpoilerCards) {
      return startCards;
    }

    return concat(startCards, spoilerCards);
  }

  isLoading() {
    return this.state.resultsKey !== this.resultsKey();
  }

  render() {
    const {
      sort,
      fontScale,
    } = this.props;
    const {
      loadingMessage,
    } = this.state;
    if (this.isLoading()) {
      return (
        <View style={styles.loading}>
          <View style={styles.loadingText}>
            <Text style={typography.text}>
              { `${loadingMessage}...` }
            </Text>
          </View>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    const stickyHeaders = (
      sort === SORT_BY_PACK ||
      sort === SORT_BY_ENCOUNTER_SET
    );
    const data = this.getData();
    let offset = 0;
    const elementHeights = map(
      flatMap(data, section => {
        return concat(
          [rowHeaderHeight(fontScale)], // Header
          map(section.data || [], () => rowHeight(fontScale)), // Rows
          [section.nonCollectionCount ? rowNonCollectionHeight(fontScale) : 0] // Footer (not used)
        );
      }),
      (size) => {
        const result = {
          length: size,
          offset: offset,
        };
        offset = offset + size;
        return result;
      });
    const getItemLayout = (
      data: SectionListData<CardBucket>[] | null,
      index: number
    ): {
      index: number;
      length: number;
      offset: number;
    } => {
      return Object.assign({}, elementHeights[index], { index });
    };
    return (
      <SectionList
        onScroll={this._handleScroll}
        onScrollBeginDrag={this._handleScrollBeginDrag}
        sections={data}
        renderSectionHeader={this._renderSectionHeader}
        renderSectionFooter={this._renderSectionFooter}
        initialNumToRender={30}
        keyExtractor={this._cardToKey}
        renderItem={this._renderCard}
        extraData={this.state.deckCardCounts}
        getItemLayout={getItemLayout}
        ListFooterComponent={this._renderFooter}
        stickySectionHeadersEnabled={stickyHeaders}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        scrollEventThrottle={1}
      />
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const in_collection = getPacksInCollection(state);
  return {
    singleCardView: state.settings.singleCardView || false,
    in_collection,
    show_spoilers: getPackSpoilers(state),
    hasSecondCore: in_collection.core || false,
    tabooSetId: getTabooSet(state, props.tabooSetOverride),
  };
}


export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(connectRealm<OwnProps & ReduxProps, RealmProps, Card>(
  CardResultList, {
    mapToProps(results: any, realm: Realm): RealmProps {
      return {
        realm,
      };
    },
  })
);

interface Styles {
  footer: ViewStyle;
  loading: ViewStyle;
  loadingText: TextStyle;
  button: ViewStyle;
  emptyText: TextStyle;
  sectionFooterButton: ViewStyle;
}
const styles = StyleSheet.create<Styles>({
  footer: {
    height: 300,
  },
  loading: {
    flex: 1,
    margin: m,
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
  button: {
    margin: s,
  },
  emptyText: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  sectionFooterButton: {
    margin: 8,
  },
});
