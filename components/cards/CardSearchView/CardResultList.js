import React from 'react';
import PropTypes from 'prop-types';
import { concat, map, partition } from 'lodash';
import {
  Button,
  Text,
  VirtualizedList,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../actions';
import CardSearchResult from './CardSearchResult';

class CardResultList extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    realm: PropTypes.object.isRequired,
    query: PropTypes.string,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    show_spoilers: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      spoilerCards: [],
      loading: true,
      showSpoilerCards: false,
    };

    this._getItem = this.getItem.bind(this);
    this._getItemLayout = this.getItemLayout.bind(this);
    this._getItemCount = this.getItemCount.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._editSpoilerSettings = this.editSpoilerSettings.bind(this);
    this._enableSpoilers = this.enableSpoilers.bind(this);
    this._renderCard = this.renderCard.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
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

  updateResults() {
    const {
      realm,
      query,
      show_spoilers,
    } = this.props;
    const cards = query ? realm.objects('Card').filtered(query) : realm.objects('Card');
    const splitCards = partition(
      map(cards, card => Object.assign({}, card)),
      card => !(card.spoiler || (card.linked_card && card.linked_card.spoiler)) || 
        show_spoilers[card.pack_code]
    );
    this.setState({
      cards: splitCards[0],
      spoilerCards: splitCards[1],
      loading: false,
    });
  }

  componentDidMount() {
    setTimeout(() => this.updateResults(), 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({
        loading: true,
      });
      setTimeout(() => this.updateResults(), 50);
    }
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
      },
    });
  }

  getItemLayout(data, index) {
    return {
      length: 26,
      offset: 26 * index,
      index,
    };
  }

  getItem(data, index) {
    return data[index];
  }

  getItemCount(data) {
    return data.length;
  }

  renderCard({ item }) {
    const {
      deckCardCounts = {},
      onDeckCountChange,
    } = this.props;
    return (
      <CardSearchResult
        card={item}
        count={deckCardCounts[item.code]}
        onDeckCountChange={onDeckCountChange}
        onPress={this._cardPressed}
      />
    );
  }

  renderFooter() {
    const {
      spoilerCards,
      showSpoilerCards,
    } = this.state;
    if (!spoilerCards.length) {
      return null;
    }
    if (showSpoilerCards) {
      return (
        <Button
          onPress={this._editSpoilerSettings}
          title="Edit Spoiler Settings"
        />
      );
    }
    const spoilerCount = spoilerCards.length > 1 ?
      `Show ${spoilerCards.length} Spoilers` :
      'Show Spoiler';

    return (
      <Button onPress={this._enableSpoilers} title={spoilerCount} />
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
      <VirtualizedList
        data={this.getData()}
        getItem={this._getItem}
        getItemLayout={this._getItemLayout}
        getItemCount={this._getItemCount}
        renderItem={this._renderCard}
        keyExtractor={this._cardToKey}
        windowSize={20}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}


function mapStateToProps(state, props) {
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
