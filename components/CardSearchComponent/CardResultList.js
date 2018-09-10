import React from 'react';
import PropTypes from 'prop-types';
import { concat, flatMap, map, partition, random, sortBy, throttle } from 'lodash';
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

import L from '../../app/i18n';
import * as Actions from '../../actions';
import { getPackSpoilers } from '../../reducers';
import Card from '../../data/Card';
import { isSpecialCard } from '../parseDeck';
import CardSearchResult from '../CardSearchResult';
import { ROW_HEIGHT } from '../CardSearchResult/constants';
import CardSectionHeader from './CardSectionHeader';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';
import typography from '../../styles/typography';

const SCROLL_DISTANCE_BUFFER = 50;

const FUN_LOADING_MESSAGES = [
  'Investigating for clues',
  'Cursing at the tentacle token',
  'Drawing a mythos card with surge',
  'Placing doom on the agenda',
  'Reticulating spines',
  'Trying to make sense of the Time Warp FAQ',
  'Taking three damage and three horror',
];

class CardResultList extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    realm: PropTypes.object.isRequired,
    query: PropTypes.string,
    searchTerm: PropTypes.string,
    sort: PropTypes.string,
    originalDeckSlots: PropTypes.object,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    show_spoilers: PropTypes.object,
    limits: PropTypes.object,
    cardPressed: PropTypes.func,
    showHeader: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    expandSearchControls: PropTypes.node,
  };

  static randomLoadingMessage() {
    return FUN_LOADING_MESSAGES[random(0, FUN_LOADING_MESSAGES.length - 1)];
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
    this._throttledUpdateResults = throttle(
      this.updateResults.bind(this),
      200,
      { trailing: true });
    this._getItem = this.getItem.bind(this);
    this._renderSectionHeader = this.renderSectionHeader.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._editSpoilerSettings = this.editSpoilerSettings.bind(this);
    this._enableSpoilers = this.enableSpoilers.bind(this);
    this._renderCard = this.renderCard.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
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
    const updateDeckCardCounts = (prevProps.deckCardCounts !== deckCardCounts);
    if ((this.props.visible && !prevProps.visible && this.state.dirty) ||
        prevProps.query !== this.props.query ||
        prevProps.sort !== this.props.sort ||
        prevProps.searchTerm !== this.props.searchTerm ||
        prevProps.show_spoilers !== this.props.show_spoilers) {
      if (this.props.visible) {
        /* eslint-disable react/no-did-update-set-state */
        this.setState({
          loadingMessage: CardResultList.randomLoadingMessage(),
          dirty: false,
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
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        deckCardCounts: deckCardCounts,
      });
    }
  }

  enableSpoilers() {
    Keyboard.dismiss();
    this.setState({
      showSpoilerCards: true,
    });
  }

  editSpoilerSettings() {
    Keyboard.dismiss();
    this.props.navigator.push({
      screen: 'My.Spoilers',
      title: L('Spoiler Settings'),
    });
  }

  getSort() {
    switch(this.props.sort) {
      case SORT_BY_TYPE:
        return [['sort_by_type', false], ['renderName', false]];
      case SORT_BY_FACTION:
        return [['sort_by_faction', false], ['renderName', false]];
      case SORT_BY_COST:
        return [['cost', false], ['renderName', false]];
      case SORT_BY_PACK:
        return [['sort_by_pack', false], ['position', false]];
      case SORT_BY_TITLE:
        return [['renderName', false]];
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

  bucketCards(cards, sortOverride) {
    const results = [];
    let currentBucket = null;
    cards.forEach(card => {
      const header = this.headerForCard(card, sortOverride);
      if (!currentBucket || currentBucket.title !== header) {
        currentBucket = {
          title: header,
          data: [],
        };
        results.push(currentBucket);
      }
      currentBucket.data.push(card);
    });
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
      deckCardCounts,
    } = this.props;
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
          originalDeckSlots[card.code] > 0 || deckCardCounts[card.count] > 0)) {
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
        this.bucketCards(normalCards, SORT_BY_TYPE),
        this.bucketCards(specialCards, SORT_BY_TYPE)),
      cards: this.bucketCards(groupedCards[0]),
      cardsCount: groupedCards[0].length,
      spoilerCards: this.bucketCards(groupedCards[1]),
      spoilerCardsCount: groupedCards[1].length,
    });
  }

  cardToKey(card) {
    return card.code;
  }

  cardPressed(card) {
    const {
      cardPressed,
      navigator,
    } = this.props;
    cardPressed && cardPressed(card);
    navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
        showSpoilers: true,
        backButtonTitle: L('Back'),
      },
    });
  }

  getItem(data, index) {
    return data[index];
  }

  renderSectionHeader({ section }) {
    return <CardSectionHeader title={section.title} bold={section.bold} />;
  }

  renderCard({ item }) {
    const {
      limits,
    } = this.props;
    return (
      <CardSearchResult
        card={item}
        count={this.state.deckCardCounts[item.code]}
        onDeckCountChange={this.props.onDeckCountChange}
        onPress={this._cardPressed}
        limit={limits ? limits[item.code] : null}
      />
    );
  }

  renderEmptyState() {
    const {
      cardsCount,
      spoilerCardsCount,
    } = this.state;
    if (!this.isLoading() && (cardsCount + spoilerCardsCount) === 0) {
      return (
        <View>
          <View style={styles.emptyText}>
            <Text style={typography.text}>
              No matching cards
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
          <Text style={[typography.small, styles.loadingText]}>
            { `${loadingMessage}...` }
          </Text>
          <ActivityIndicator
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }
    const stickyHeaders = sort === SORT_BY_PACK || sort === SORT_BY_ENCOUNTER_SET;
    const data = this.getData();
    let offset = 0;
    const elementHeights = map(
      flatMap(data, section => {
        return concat(
          [30], // Header
          map(section.data || [], card => ROW_HEIGHT), // Rows
          [0] // Footer (not used)
        );
      }),
      (size, index) => {
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
        sections={this.getData()}
        renderSectionHeader={this._renderSectionHeader}
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
  return {
    show_spoilers: getPackSpoilers(state),
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
    margin: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    margin: 8,
  },
  emptyText: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
});
