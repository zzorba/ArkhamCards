import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  VirtualizedList,
} from 'react-native';
import { connectRealm } from 'react-native-realm';

import CardSearchResult from './CardSearchResult';

class CardResultList extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    realm: PropTypes.object.isRequired,
    query: PropTypes.string,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      loading: true,
    };

    this._getItem = this.getItem.bind(this);
    this._getItemLayout = this.getItemLayout.bind(this);
    this._getItemCount = this.getItemCount.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._renderCard = this.renderCard.bind(this);
  }

  updateResults() {
    const {
      realm,
      query,
    } = this.props;
    const cards = query ? realm.objects('Card').filtered(query) : realm.objects('Card');
    const cardsCopy = map(cards, card => Object.assign({}, card));
    this.setState({
      cards: cardsCopy,
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

  cardPressed(cardId) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: cardId,
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

  render() {
    const {
      cards,
      loading,
    } = this.state;
    if (loading) {
      return null;
    }

    return (
      <VirtualizedList
        data={cards}
        getItem={this._getItem}
        getItemLayout={this._getItemLayout}
        getItemCount={this._getItemCount}
        renderItem={this._renderCard}
        keyExtractor={this._cardToKey}
        windowSize={20}
      />
    );
  }
}

export default connectRealm(CardResultList, {
  mapToProps(results, realm) {
    return {
      realm,
    };
  },
});
