import React from 'react';
import PropTypes from 'prop-types';
import { concat, map, partition } from 'lodash';
import {
  Button,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../actions';
import Card from '../../../data/Card';
import CardSearchResult from './CardSearchResult';
import CardSectionHeader from './CardSectionHeader';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
} from './constants';

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
    };

    this._getItem = this.getItem.bind(this);
    this._renderSectionHeader = this.renderSectionHeader.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._editSpoilerSettings = this.editSpoilerSettings.bind(this);
    this._enableSpoilers = this.enableSpoilers.bind(this);
    this._renderCard = this.renderCard.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.updateResults(), 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query ||
        nextProps.sort !== this.props.sort ||
        nextProps.searchTerm !== this.props.searchTerm) {
      this.setState({
        loading: true,
      });
      setTimeout(() => this.updateResults(), 50);
    }
    if (nextProps.deckCardCounts !== this.props.deckCardCounts) {
      this.setState({
        deckCardCounts: nextProps.deckCardCounts,
      });
    }
  }

  enableSpoilers() {
    this.setState({
      showSpoilerCards: true,
    });
  }

  editSpoilerSettings() {
    this.props.navigator.push({
      screen: 'EditSpoilers',
      title: 'Spoiler Settings',
    });
  }

  getSort() {
    switch(this.props.sort) {
      case SORT_BY_TYPE:
        return [['sort_by_type', false], ['name', false]];
      case SORT_BY_FACTION:
        return [['sort_by_faction', false], ['name', false]];
      case SORT_BY_COST:
        return [['cost', false], ['name', false]];
      case SORT_BY_PACK:
        return [['pack_code', false], ['name', false]];
      case SORT_BY_TITLE:
        return [['name', false]];
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
        return card.pack_code;
      case SORT_BY_TITLE:
        return 'All Cards';
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
    const cards = (query ? realm.objects('Card').filtered(query, searchTerm) :
      realm.objects('Card')).sorted(this.getSort());
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
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
        showSpoilers: true,
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
    return (
      <CardSearchResult
        card={item}
        count={this.state.deckCardCounts[item.code]}
        onDeckCountChange={this.props.onDeckCountChange}
        onPress={this._cardPressed}
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
      loading,
    } = this.state;
    if (loading) {
      return null;
    }
    return (
      <SectionList
        sections={this.getData()}
        renderSectionHeader={this._renderSectionHeader}
        keyExtractor={this._cardToKey}
        renderItem={this._renderCard}
        extraData={this.state.deckCardCounts}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}


function mapStateToProps(state) {
  return {
    show_spoilers: state.packs.show_spoilers || {},
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
