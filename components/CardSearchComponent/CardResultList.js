import React from 'react';
import PropTypes from 'prop-types';
import { concat, map, partition, throttle } from 'lodash';
import {
  ActivityIndicator,
  Animated,
  Button,
  Keyboard,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../actions';
import { getPackSpoilers } from '../../reducers';
import Card from '../../data/Card';
import CardSearchResult from '../CardSearchResult';
import CardSectionHeader from './CardSectionHeader';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';

const SCROLL_DISTANCE_BUFFER = 25;

class CardResultList extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    realm: PropTypes.object.isRequired,
    query: PropTypes.string,
    searchTerm: PropTypes.string,
    sort: PropTypes.string,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    show_spoilers: PropTypes.object,
    limits: PropTypes.object,
    cardPressed: PropTypes.func,
    showHeader: PropTypes.func.isRequired,
    hideHeader: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      deckCardCounts: props.deckCardCounts || {},
      spoilerCards: [],
      spoilerCardsCount: 0,
      showSpoilerCards: false,
      loading: true,
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

    if (offsetY <= 0) {
      this.props.showHeader();
    }

    // Dispatch the throttle event to handle hiding/showing stuff on transition.
    this._throttledScroll(offsetY);
  }

  /**
   * This is the throttle scrollEvent, throttled so we check it slightly
   * less often and are able to make decisions about whether we update
   * the stored scrollY or not.
   */
  throttledScroll(offsetY) {
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

    this.lastOffsetY = offsetY;
  }

  handleScrollBeginDrag() {
    Keyboard.dismiss();
  }

  componentDidMount() {
    setTimeout(() => this.updateResults(), 0);
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
          loading: true,
          dirty: false,
          deckCardCounts: updateDeckCardCounts ? deckCardCounts : this.state.deckCardCounts,
        }, () => {
          setTimeout(() => this.updateResults(), 0);
        });
      } else {
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
      title: 'Spoiler Settings',
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

  headerForCard(card) {
    switch(this.props.sort) {
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

  bucketCards(cards) {
    const results = [];
    let currentBucket = null;
    cards.forEach(card => {
      const header = this.headerForCard(card);
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

  updateResults() {
    const {
      realm,
      query,
      searchTerm,
      show_spoilers,
    } = this.props;
    const cards = (query ?
      realm.objects('Card').filtered(query, searchTerm) :
      realm.objects('Card')
    ).sorted(this.getSort());
    const splitCards = partition(
      map(cards, card => Object.assign({}, card)),
      card => show_spoilers[card.pack_code] ||
        !(card.spoiler || (card.linked_card && card.linked_card.spoiler))
    );
    this.setState({
      cards: this.bucketCards(splitCards[0]),
      spoilerCards: this.bucketCards(splitCards[1]),
      spoilerCardsCount: splitCards[1].length,
      loading: false,
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
        backButtonTitle: 'Back',
      },
    });
  }

  getItem(data, index) {
    return data[index];
  }

  renderSectionHeader({ section }) {
    return <CardSectionHeader title={section.title} />;
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

  renderFooter() {
    const {
      spoilerCardsCount,
      showSpoilerCards,
    } = this.state;
    if (!spoilerCardsCount) {
      return <View style={styles.footer} />;
    }
    if (showSpoilerCards) {
      return (
        <View style={styles.footer}>
          <Button
            onPress={this._editSpoilerSettings}
            title="Edit Spoiler Settings"
          />
        </View>
      );
    }
    const spoilerCount = spoilerCardsCount > 1 ?
      `Show ${spoilerCardsCount} Spoilers` :
      'Show Spoiler';

    return (
      <View style={styles.footer}>
        <Button
          onPress={this._editSpoilerSettings}
          title="Edit Spoiler Settings"
        />
        <Button onPress={this._enableSpoilers} title={spoilerCount} />
      </View>
    );
  }

  getData() {
    const {
      cards,
      spoilerCards,
      showSpoilerCards,
    } = this.state;
    if (!showSpoilerCards) {
      return cards;
    }

    return concat(cards, spoilerCards);
  }

  render() {
    const {
      sort,
    } = this.props;
    const {
      loading,
    } = this.state;
    if (loading) {
      return (
        <ActivityIndicator
          style={[{ height: 80 }]}
          size="small"
          animating
        />
      );
    }
    const stickyHeaders = sort === SORT_BY_PACK || sort === SORT_BY_ENCOUNTER_SET;
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
        ListFooterComponent={this._renderFooter}
        stickySectionHeadersEnabled={stickyHeaders}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
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
});
