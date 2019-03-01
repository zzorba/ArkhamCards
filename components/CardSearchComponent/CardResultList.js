import React from 'react';
import PropTypes from 'prop-types';
import { concat, debounce, flatMap, forEach, isEqual, map, partition, random, sortBy, throttle } from 'lodash';
import {
  ActivityIndicator,
  Animated,
  Button,
  Keyboard,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import * as Actions from '../../actions';
import { getPackSpoilers, getPacksInCollection } from '../../reducers';
import Card from '../../data/Card';
import { showCard } from '../navHelper';
import { isSpecialCard } from '../parseDeck';
import CardSearchResult from '../CardSearchResult';
import { ROW_HEIGHT } from '../CardSearchResult/constants';
import CardSectionHeader, { ROW_HEADER_HEIGHT } from './CardSectionHeader';
import ShowNonCollectionFooter, { ROW_NON_COLLECTION_HEIGHT } from './ShowNonCollectionFooter';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';
import typography from '../../styles/typography';
import { s, m } from '../../styles/space';

const SCROLL_DISTANCE_BUFFER = 50;

function funLoadingMessages() {
  return [
    L('Investigating for clues'),
    L('Cursing at the tentacle token'),
    L('Drawing a mythos card with surge'),
    L('Placing doom on the agenda'),
    L('Reticulating spines'),
    L('Trying to make sense of the Time Warp FAQ'),
    L('Taking three damage and three horror'),
    L('Up by 5... drawing the tentacles'),
  ];
}

class CardResultList extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    realm: PropTypes.object.isRequired,
    query: PropTypes.string,
    searchTerm: PropTypes.string,
    sort: PropTypes.string,
    originalDeckSlots: PropTypes.object,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    show_spoilers: PropTypes.object,
    in_collection: PropTypes.object,
    hasSecondCore: PropTypes.bool,
    limits: PropTypes.object,
    cardPressed: PropTypes.func,
    showHeader: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    showNonCollection: PropTypes.bool,
    expandSearchControls: PropTypes.node,
  };

  static randomLoadingMessage() {
    const messages = funLoadingMessages();
    return messages[random(0, messages.length - 1)];
  }

  constructor(props) {
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

    this.lastOffsetY = 0;
    this._onScroll = this.onScroll.bind(this);
    this._throttledScroll = throttle(
      this.throttledScroll.bind(this),
      100,
      { trailing: true },
    );
    this._handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      {
        listener: this._onScroll,
      },
    );
    this._handleScrollBeginDrag = this.handleScrollBeginDrag.bind(this);
    this._throttledUpdateResults = debounce(
      this.updateResults.bind(this),
      100,
      { trailing: true });
    this._getItem = this.getItem.bind(this);
    this._renderSectionHeader = this.renderSectionHeader.bind(this);
    this._renderSectionFooter = this.renderSectionFooter.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._editSpoilerSettings = this.editSpoilerSettings.bind(this);
    this._editCollectionSettings = this.editCollectionSettings.bind(this);
    this._enableSpoilers = this.enableSpoilers.bind(this);
    this._showNonCollectionCards = this.showNonCollectionCards.bind(this);
    this._renderCard = this.renderCard.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
    this.hasPendingCountChanges = false;
  }

  onScroll(event) {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  }

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  throttledScroll(offsetY) {
    if (offsetY <= 0) {
      this.props.showHeader();
    } else {
      if (this.hasPendingCountChanges) {
        this.hasPendingCountChanges = false;
        this._throttledUpdateResults();
      }

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
        this.props.showHeader();
      } else {
        this.props.hideHeader();
      }
    }

    this.lastOffsetY = offsetY;
  }

  handleScrollBeginDrag() {
    Keyboard.dismiss();
  }

  componentDidMount() {
    this._throttledUpdateResults();
  }

  componentDidUpdate(prevProps) {
    const {
      deckCardCounts,
    } = this.props;
    const updateDeckCardCounts = !isEqual(prevProps.deckCardCounts, deckCardCounts);
    if ((this.props.visible && !prevProps.visible && this.state.dirty) ||
        prevProps.query !== this.props.query ||
        prevProps.sort !== this.props.sort ||
        prevProps.searchTerm !== this.props.searchTerm ||
        prevProps.show_spoilers !== this.props.show_spoilers ||
        prevProps.in_collection !== this.props.in_collection
    ) {
      if (this.props.visible) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          loadingMessage: CardResultList.randomLoadingMessage(),
          dirty: false,
          showNonCollection: [],
          deckCardCounts: updateDeckCardCounts ? deckCardCounts : this.state.deckCardCounts,
        }, this._throttledUpdateResults);
      } else if (!this.state.dirty) {
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

  enableSpoilers() {
    Keyboard.dismiss();
    this.setState({
      showSpoilerCards: true,
    });
  }

  showNonCollectionCards(id) {
    Keyboard.dismiss();
    this.setState({
      showNonCollection: Object.assign(
        {},
        this.state.showNonCollection,
        { [id]: true },
      ),
    }, this._throttledUpdateResults);
  }

  editCollectionSettings() {
    Keyboard.dismiss();
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Collection',
        options: {
          topBar: {
            title: {
              text: L('Edit Collection'),
            },
          },
        },
      },
    });
  }

  editSpoilerSettings() {
    Keyboard.dismiss();
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
        options: {
          topBar: {
            title: {
              text: L('Spoiler Settings'),
            },
          },
        },
      },
    });
  }

  getSort() {
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
    }
  }

  headerForCard(card, sortOverride) {
    switch(sortOverride || this.props.sort) {
      case SORT_BY_TYPE:
        return Card.typeSortHeader(card);
      case SORT_BY_FACTION:
        return Card.factionSortHeader(card);
      case SORT_BY_COST:
        if (card.cost === null) {
          return 'Cost: None';
        }
        return `Cost: ${card.cost}`;
      case SORT_BY_PACK:
        return card.pack_name;
      case SORT_BY_TITLE:
        return 'All Cards';
      case SORT_BY_ENCOUNTER_SET:
        return card.encounter_name ||
          (card.linked_card && card.linked_card.encounter_name) ||
          'N/A';
    }
  }

  bucketDeckCards(cards) {
    return this.bucketCards(cards, 'deck', true);
  }

  bucketCards(cards, keyPrefix, isDeck) {
    const {
      in_collection,
      sort,
    } = this.props;
    const {
      showNonCollection,
    } = this.state;
    const results = [];
    let nonCollectionCards = [];
    let currentBucket = null;
    cards.forEach(card => {
      const header = this.headerForCard(card, isDeck ? SORT_BY_TYPE : sort);
      if (!currentBucket || currentBucket.title !== header) {
        if (nonCollectionCards.length > 0) {
          if (showNonCollection[currentBucket.id]) {
            forEach(nonCollectionCards, c => currentBucket.data.push(c));
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
        isDeck ||
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
    if (nonCollectionCards.length > 0) {
      if (showNonCollection[currentBucket.id]) {
        forEach(nonCollectionCards, c => currentBucket.data.push(c));
      }
      currentBucket.nonCollectionCount = nonCollectionCards.length;
      nonCollectionCards = [];
    }
    return results;
  }

  resultsKey() {
    const {
      query,
      searchTerm,
      show_spoilers,
      sort,
    } = this.props;
    return (
      `q:${query},s:${searchTerm},sp:${show_spoilers},st:${sort}`
    );
  }

  updateResults() {
    const {
      realm,
      query,
      searchTerm,
      show_spoilers,
      originalDeckSlots,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const resultsKey = this.resultsKey();
    const cards = (query ?
      realm.objects('Card').filtered(query, searchTerm) :
      realm.objects('Card')
    ).sorted(this.getSort());
    const deckCards = [];
    const groupedCards = partition(
      cards,
      card => {
        if (originalDeckSlots && (
          originalDeckSlots[card.code] > 0 || deckCardCounts[card.code] > 0)) {
          deckCards.push(card);
        }
        return show_spoilers[card.pack_code] ||
          !(card.spoiler || (card.linked_card && card.linked_card.spoiler));
      }
    );

    const splitDeckCards = partition(deckCards, card => isSpecialCard(card));
    const specialCards = sortBy(splitDeckCards[0], card => card.sort_by_type || -1);
    const normalCards = sortBy(splitDeckCards[1], card => card.sort_by_type || -1);

    this.setState({
      resultsKey: resultsKey,
      deckSections: concat(
        this.bucketDeckCards(normalCards),
        this.bucketDeckCards(specialCards)),
      cards: this.bucketCards(groupedCards[0], 'cards'),
      cardsCount: groupedCards[0].length,
      spoilerCards: this.bucketCards(groupedCards[1], 'spoiler'),
      spoilerCardsCount: groupedCards[1].length,
    });
  }

  cardToKey(card) {
    return card.code;
  }

  cardPressed(card) {
    const {
      cardPressed,
      componentId,
    } = this.props;
    cardPressed && cardPressed(card);
    showCard(componentId, card.code, card, true);
  }

  getItem(data, index) {
    return data[index];
  }

  renderSectionHeader({ section }) {
    return <CardSectionHeader title={section.title} bold={section.bold} />;
  }

  renderSectionFooter({ section }) {
    const {
      showNonCollection,
    } = this.state;
    if (!section.nonCollectionCount) {
      return null;
    }
    if (showNonCollection[section.id]) {
      // Already pressed it, so show a button to edit collection.
      return (
        <Button
          style={styles.sectionFooterButton}
          title={L('Edit Collection')}
          onPress={this._editCollectionSettings}
        />
      );
    }
    return (
      <ShowNonCollectionFooter
        id={section.id}
        title={L('Show {{count}} Non-Collection Cards', { count: section.nonCollectionCount })}
        onPress={this._showNonCollectionCards}
      />
    );
  }

  renderCard({ item }) {
    const {
      limits,
      hasSecondCore,
    } = this.props;
    return (
      <CardSearchResult
        card={item}
        count={this.state.deckCardCounts[item.code]}
        onDeckCountChange={this.props.onDeckCountChange}
        onPress={this._cardPressed}
        limit={limits ? limits[item.code] : null}
        hasSecondCore={hasSecondCore}
      />
    );
  }

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
                L('No matching cards for "{{searchTerm}}"', { searchTerm }) :
                L('No matching cards') }
            </Text>
          </View>
          { this.props.expandSearchControls }
        </View>
      );
    }
    return this.props.expandSearchControls;
  }

  renderFooter() {
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
              title={L('Edit Spoiler Settings')}
            />
          </View>
          { this.renderEmptyState() }
        </View>
      );
    }
    const spoilerCount = L('Show {{count}} Spoilers', { count: spoilerCardsCount });
    return (
      <View style={styles.footer}>
        <View style={styles.button}>
          <Button onPress={this._enableSpoilers} title={spoilerCount} />
        </View>
        <View style={styles.button}>
          <Button
            onPress={this._editSpoilerSettings}
            title={L('Edit Spoiler Settings')}
          />
        </View>
        { this.renderEmptyState() }
      </View>
    );
  }

  getData() {
    const {
      cards,
      spoilerCards,
      showSpoilerCards,
      deckSections,
    } = this.state;
    const startCards = deckSections.length ?
      concat(
        [{
          title: 'In Deck',
          bold: true,
          data: [],
        }],
        deckSections,
        [{
          title: 'All Eligible Cards',
          bold: true,
          data: [],
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
          [ROW_HEADER_HEIGHT], // Header
          map(section.data || [], () => ROW_HEIGHT), // Rows
          [section.nonCollectionCount ? ROW_NON_COLLECTION_HEIGHT : 0] // Footer (not used)
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
    const getItemLayout = (data, index) => {
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

function mapStateToProps(state) {
  const in_collection = getPacksInCollection(state);
  return {
    in_collection,
    show_spoilers: getPackSpoilers(state),
    hasSecondCore: in_collection.core || false,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(CardResultList), {
    mapToProps(results, realm) {
      return {
        realm,
      };
    },
  });

const styles = StyleSheet.create({
  footer: {
    height: 300,
  },
  loading: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingText: {
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
    height: ROW_NON_COLLECTION_HEIGHT,
  },
});
