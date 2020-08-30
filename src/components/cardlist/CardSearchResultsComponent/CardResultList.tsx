import React, { ReactNode } from 'react';
import {
  concat,
  flatMap,
  filter,
  forEach,
  keys,
  isEqual,
  map,
  partition,
  random,
  uniq,
} from 'lodash';
import {
  ActivityIndicator,
  Keyboard,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
  SectionListData,
  SectionListRenderItemInfo,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { msgid, ngettext, t } from 'ttag';

import DbRender from '@components/data/DbRender';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import BasicButton from '@components/core/BasicButton';
import { addFilterSet } from '@components/filter/actions';
import ShowNonCollectionFooter, { rowNonCollectionHeight } from './ShowNonCollectionFooter';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import { rowHeight } from '@components/cardlist/CardSearchResult/constants';
import CardSectionHeader, { cardSectionHeaderHeight, CardSectionHeaderData } from '@components/core/CardSectionHeader';
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
import { QuerySort } from '@data/types';
import { combineQueries, where } from '@data/query';
import { getPackSpoilers, getPacksInCollection, getTabooSet, AppState, getLangPreference } from '@reducers';
import Card from '@data/Card';
import { showCard, showCardSwipe } from '@components/nav/helper';
import typography from '@styles/typography';
import { s, m } from '@styles/space';
import COLORS from '@styles/colors';

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
  query?: Brackets;
  filterQuery?: Brackets;
  searchTerm?: string;
  sort?: SortType;
  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  tabooSetOverride?: number;
  filterCard?: (card: Card) => boolean;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  cardPressed?: (card: Card) => void;
  handleScroll: (...args: any[]) => void;
  visible: boolean;
  showNonCollection?: boolean;
  expandSearchControls?: ReactNode;
  renderHeader?: () => React.ReactElement;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  storyOnly?: boolean;
  mythosToggle?: boolean;
  mythosMode?: boolean;
  initialSort?: SortType;
  renderCard?: (card: Card) => React.ReactElement;
}

interface ReduxProps {
  lang: string;
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

interface ReduxActionProps {
  addFilterSet: (
    id: string,
    cards: Card[],
    db: Database,
    sort?: SortType,
    mythosToggle?: boolean
  ) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

interface DbState {
  query?: Brackets;
  filterQuery?: Brackets;
  sort?: SortType;
  deckSections: CardBucket[];
  deckCardCounts?: Slots;
  cards: Card[];
}

interface LiveState {
  deckSections: CardBucket[];
  cards: CardBucket[];
  cardsCount: number;
  spoilerCards: CardBucket[];
  spoilerCardsCount: number;
  deckCardCounts?: Slots;
}

interface State {
  refreshDeck: number;
  deckCardCounts?: Slots;
  showSpoilerCards: boolean;
  showNonCollection: {
    [code: string]: boolean;
  };
  loadingMessage: string;
  dirty: boolean;
}

interface CardBucket extends SectionListData<Card> {
  header: CardSectionHeaderData;
  id: string;
  data: Card[];
  nonCollectionCount?: number;
}

class CardResultList extends React.Component<Props, State> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  static randomLoadingMessage() {
    const messages = funLoadingMessages();
    return messages[random(0, messages.length - 1)];
  }

  filterSetInitialized = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      deckCardCounts: props.deckCardCounts || {},
      showSpoilerCards: false,
      showNonCollection: {},
      loadingMessage: CardResultList.randomLoadingMessage(),
      dirty: false,
      refreshDeck: 0,
    };
  }

  _handleScrollBeginDrag = () => {
    Keyboard.dismiss();
  };

  componentDidUpdate(prevProps: Props) {
    const {
      deckCardCounts,
      visible,
      mythosMode,
    } = this.props;
    const {
      dirty,
    } = this.state;
    const updateDeckCardCounts = !isEqual(prevProps.deckCardCounts, deckCardCounts);
    if (prevProps.mythosMode !== mythosMode) {
      this.filterSetInitialized = false;
    }
    if ((visible && !prevProps.visible && dirty) ||
        JSON.stringify(prevProps.query) !== JSON.stringify(this.props.query) ||
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
        });
      } else if (!dirty) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          dirty: true,
          deckCardCounts: updateDeckCardCounts ? deckCardCounts : this.state.deckCardCounts,
        });
      }
    } else if (updateDeckCardCounts) {
      this.setState({
        deckCardCounts: deckCardCounts,
      });
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
      showNonCollection: {
        ...this.state.showNonCollection,
        [id]: true,
      },
    });
  };

  _editCollectionSettings = () => {
    Keyboard.dismiss();
    Navigation.push(this.props.componentId, {
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
    Navigation.push(this.props.componentId, {
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

  getSort(): QuerySort[] {
    switch(this.props.sort) {
      case SORT_BY_FACTION:
        return [
          { s: 'c.sort_by_faction', direction: 'ASC' },
          { s: 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_FACTION_PACK:
        return [
          { s: 'c.sort_by_faction_pack', direction: 'ASC' },
          { s: 'c.code', direction: 'ASC' },
        ];
      case SORT_BY_COST:
        return [
          { s: 'c.cost', direction: 'ASC' },
          { s: 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_PACK:
        return [
          { s: 'c.sort_by_pack', direction: 'ASC' },
          { s: 'c.position', direction: 'ASC' },
        ];
      case SORT_BY_ENCOUNTER_SET:
        return [
          { s: 'c.sort_by_pack', direction: 'ASC' },
          { s: 'c.encounter_code', direction: 'ASC' },
          { s: 'c.encounter_position', direction: 'ASC' },
        ];
      case SORT_BY_TITLE:
        return [
          { s: 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
      case SORT_BY_TYPE:
      default:
        return [
          { s: 'c.sort_by_type', direction: 'ASC' },
          { s: 'c.renderName', direction: 'ASC' },
          { s: 'c.xp', direction: 'ASC' },
        ];
    }
  }

  static headerForCard(card: Card, sort?: SortType): string {
    switch(sort) {
      case SORT_BY_TYPE:
        return Card.typeSortHeader(card);
      case SORT_BY_FACTION_PACK:
        return card.factionPackSortHeader();
      case SORT_BY_FACTION:
        return Card.factionSortHeader(card);
      case SORT_BY_COST:
        if (card.cost === null) {
          return t`Cost: None`;
        }
        return t`Cost: ${card.cost}`;
      case SORT_BY_PACK:
        return `${card.pack_name}`;
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
    cards: Card[],
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
      if (!currentBucket || currentBucket.header.subTitle !== header) {
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
          header: {
            subTitle: header,
          },
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

  async deckSections(db: Database): Promise<CardBucket[]> {
    const {
      originalDeckSlots,
      tabooSetId,
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
    const deckQuery = map(codes, code => `c.code = '${code}'`).join(' OR ');
    if (!deckQuery) {
      return this.bucketCards([], 'deck');
    }
    const deckCards: Card[] = await db.getCards(
      combineQueries(
        where(deckQuery),
        [
          ...(storyOnly && query ? [query] : []),
          ...(filterQuery ? [filterQuery] : []),
        ],
        'and'
      ),
      tabooSetId,
      this.getSort()
    );
    return this.bucketCards(deckCards, 'deck');
  }

  _updateResults = async(db: Database): Promise<DbState> => {
    const {
      componentId,
      query,
      addFilterSet,
      mythosToggle,
      initialSort,
      tabooSetId,
      filterQuery,
      sort,
      deckCardCounts,
    } = this.props;
    this.setState({
      loadingMessage: CardResultList.randomLoadingMessage(),
    });
    const cards: Card[] = query ? await db.getCards(
      combineQueries(
        query,
        [
          ...(filterQuery ? [filterQuery] : []),
        ],
        'and'
      ),
      tabooSetId,
      this.getSort()
    ) : [];
    const deckSections = await this.deckSections(db);

    if (!this.filterSetInitialized) {
      this.filterSetInitialized = true;
      addFilterSet(
        componentId,
        cards,
        db,
        initialSort || SORT_BY_TYPE,
        mythosToggle
      );
    }

    return {
      cards,
      deckSections,
      query,
      filterQuery,
      sort,
      deckCardCounts,
    };
  };

  _cardToKey = (card: Card) => {
    return card.code;
  };

  latestData?: LiveState;

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
    if (this.latestData) {
      forEach(this.getData(this.latestData, false), section => {
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
    }
  };

  _getItem = (data: Card[], index: number) => {
    return data[index];
  };

  _renderSectionHeader = ({ section }: { section: SectionListData<Card> }) => {
    const { fontScale, investigator } = this.props;
    return (
      <CardSectionHeader
        section={section.header}
        investigator={investigator}
        fontScale={fontScale}
      />
    );
  };

  _renderSectionFooter = ({ section }: { section: SectionListData<Card> }) => {
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
        <View style={{ height: rowNonCollectionHeight(fontScale) }}>
          <BasicButton
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

  renderCard(card: Card, id: string) {
    const {
      limits,
      hasSecondCore,
      fontScale,
      onDeckCountChange,
      renderCard,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    if (renderCard) {
      return renderCard(card);
    }
    return (
      <CardSearchResult
        card={card}
        fontScale={fontScale}
        count={deckCardCounts && deckCardCounts[card.code]}
        onDeckCountChange={onDeckCountChange}
        id={id}
        onPressId={this._cardPressed}
        limit={limits ? limits[card.code] : undefined}
        hasSecondCore={hasSecondCore}
      />
    );
  }


  _renderCard = ({ item, index, section }: SectionListRenderItemInfo<Card>) => {
    return this.renderCard(item, `${section.id}.${index}`);
  };

  renderEmptyState(liveState: LiveState, refreshing?: boolean) {
    const {
      searchTerm,
      query,
    } = this.props;
    const {
      cardsCount,
      spoilerCardsCount,
    } = liveState;
    if  (!query) {
      return null;
    }
    if (!refreshing && (cardsCount + spoilerCardsCount) === 0) {
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

  _renderFooter = (liveState: LiveState, refreshing?: boolean) => {
    const { spoilerCardsCount } = liveState;
    const {
      showSpoilerCards,
    } = this.state;
    if (!spoilerCardsCount) {
      return (
        <View style={styles.footer}>
          { this.renderEmptyState(liveState, refreshing) }
        </View>
      );
    }
    if (showSpoilerCards) {
      return (
        <View style={styles.footer}>
          <BasicButton
            onPress={this._editSpoilerSettings}
            title={t`Edit Spoiler Settings`}
          />
          { this.renderEmptyState(liveState, refreshing) }
        </View>
      );
    }
    const spoilerCount = ngettext(
      msgid`Show ${spoilerCardsCount} Spoiler`,
      `Show ${spoilerCardsCount} Spoilers`,
      spoilerCardsCount);
    return (
      <View style={styles.footer}>
        <BasicButton onPress={this._enableSpoilers} title={spoilerCount} />
        <BasicButton
          onPress={this._editSpoilerSettings}
          title={t`Edit Spoiler Settings`}
        />
        { this.renderEmptyState(liveState, refreshing) }
      </View>
    );
  };

  _refreshInDeck = () => {
    this.setState(state => {
      return {
        refreshDeck: state.refreshDeck + 1,
      };
    });
  };

  getData(
    { cards, spoilerCards, deckSections, deckCardCounts }: LiveState,
    refreshing: boolean
  ): CardBucket[] {
    const {
      showSpoilerCards,
    } = this.state;
    const updateDeckCardCounts = !isEqual(deckCardCounts, this.props.deckCardCounts);
    const startCards = deckSections.length ?
      concat(
        [{
          header: {
            superTitle: t`In Deck`,
            superTitleIcon: 'refresh',
            onPress: updateDeckCardCounts && !refreshing ? this._refreshInDeck : undefined,
          },
          data: [],
          id: 'InDeck',
        }],
        deckSections,
        [{
          header: {
            superTitle: t`All Eligible Cards`,
          },
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

  hasMajorChange(dbState: DbState) {
    const {
      query,
      sort,
    } = this.props;
    return dbState.query !== query || dbState.sort !== sort;
  }

  _renderResults = (dbState?: DbState, refreshing?: boolean) => {
    const {
      fontScale,
      show_spoilers,
      handleScroll,
      renderHeader,
      filterCard,
    } = this.props;
    const {
      loadingMessage,
    } = this.state;

    if (!dbState || this.hasMajorChange(dbState)) {
      return (
        <View style={styles.loading}>
          <View style={styles.loadingText}>
            <Text style={typography.text}>
              { `${loadingMessage}...` }
            </Text>
          </View>
          <ActivityIndicator
            style={[{ height: 80 }]}
            color={COLORS.lightText}
            size="small"
            animating
          />
        </View>
      );
    }
    const { cards, deckSections, deckCardCounts } = dbState;
    const filteredDeckSections = filterCard ?
      flatMap(deckSections, section => {
        const data = filter(section.data, card => filterCard(card));
        if (!data.length) {
          return [];
        }
        return {
          ...section,
          data,
        };
      }) : deckSections;
    const groupedCards = partition(
      filterCard ? filter(cards, card => filterCard(card)) : cards,
      card => {
        return show_spoilers[card.pack_code] ||
          !(card.spoiler || (card.linked_card && card.linked_card.spoiler));
      });

    const liveState: LiveState = {
      deckSections: filteredDeckSections,
      deckCardCounts,
      cards: this.bucketCards(groupedCards[0], 'cards'),
      cardsCount: groupedCards[0].length,
      spoilerCards: this.bucketCards(groupedCards[1], 'spoiler'),
      spoilerCardsCount: groupedCards[1].length,
    };
    this.latestData = liveState;
    const data = this.getData(liveState, !!refreshing);
    let offset = 0;
    const elementHeights = map(
      flatMap(data, section => {
        return concat(
          [cardSectionHeaderHeight(section.header, fontScale)], // Header
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
      data: SectionListData<Card>[] | null,
      index: number
    ): {
      index: number;
      length: number;
      offset: number;
    } => {
      return {
        ...elementHeights[index],
        index,
      };
    };
    return (
      <SectionList
        refreshControl={
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={this._refreshInDeck}
          />
        }
        onScroll={handleScroll}
        onScrollBeginDrag={this._handleScrollBeginDrag}
        sections={data}
        renderSectionHeader={this._renderSectionHeader}
        renderSectionFooter={this._renderSectionFooter}
        renderItem={this._renderCard}
        initialNumToRender={30}
        keyExtractor={this._cardToKey}
        extraData={this.state.deckCardCounts}
        getItemLayout={getItemLayout}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={this._renderFooter(liveState, refreshing)}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        scrollEventThrottle={1}
      />
    );
  };

  render() {
    const {
      query,
      filterQuery,
      sort,
      tabooSetId,
    } = this.props;
    const { refreshDeck } = this.state;
    return (
      <DbRender
        name="card-results"
        getData={this._updateResults}
        ids={[query, filterQuery, sort, refreshDeck, tabooSetId]}
      >
        { this._renderResults }
      </DbRender>
    );
  }
}

function mapStateToProps(state: AppState, props: OwnProps): ReduxProps {
  const in_collection = getPacksInCollection(state);
  return {
    singleCardView: state.settings.singleCardView || false,
    in_collection,
    lang: getLangPreference(state),
    show_spoilers: getPackSpoilers(state),
    hasSecondCore: in_collection.core || false,
    tabooSetId: getTabooSet(state, props.tabooSetOverride),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    addFilterSet,
  }, dispatch);
}


export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(CardResultList);

const styles = StyleSheet.create({
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
  emptyText: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
});
