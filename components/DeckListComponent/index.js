import React from 'react';
import PropTypes from 'prop-types';
import { filter, findIndex, forEach, map } from 'lodash';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import SearchBox from '../SearchBox';
import DeckListItem from './DeckListItem';
import * as Actions from '../../actions';
import { getAllDecks } from '../../reducers';

class DeckListComponent extends React.Component {
  static propTypes = {
    deckIds: PropTypes.array.isRequired,
    deckClicked: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    refreshing: PropTypes.bool,
    error: PropTypes.string,
    investigators: PropTypes.object,
    cards: PropTypes.object,
    decks: PropTypes.object,
    fetchPublicDeck: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this._searchChanged = this.searchChanged.bind(this);
    this._renderHeader = this.renderHeader.bind(this);
    this._renderFooter = this.renderFooter.bind(this);
    this._renderItem = this.renderItem.bind(this);
  }

  searchChanged(searchTerm) {
    this.setState({
      searchTerm,
    });
  }

  componentDidMount() {
    const {
      deckIds,
      decks,
      fetchPublicDeck,
    } = this.props;
    deckIds.forEach(deckId => {
      if (!decks[deckId]) {
        fetchPublicDeck(deckId, false);
      }
    });
  }

  renderItem({ item: { deckId } }) {
    const {
      investigators,
      decks,
      deckClicked,
      cards,
    } = this.props;

    const deck = decks[deckId];
    return (
      <DeckListItem
        key={deckId}
        id={deckId}
        deck={deck}
        cards={cards}
        investigator={deck ? investigators[deck.investigator_code] : null}
        onPress={deckClicked}
      />
    );
  }

  renderHeader() {
    return (
      <SearchBox
        onChangeText={this._searchChanged}
        placeholder="Search decks"
      />
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer} />
    );
  }

  render() {
    const {
      deckIds,
      onRefresh,
      refreshing,
      decks,
      investigators,
    } = this.props;

    const {
      searchTerm,
    } = this.state;
    const data = map(
      filter(deckIds, deckId => {
        const deck = decks[deckId];
        const investigator = deck && investigators[deck.investigator_code];
        if (!deck || !searchTerm || !investigator) {
          return true;
        }
        const terms = searchTerm.toLowerCase().split(' ');
        const name = deck.name.toLowerCase();
        const investigatorName = investigator.name.toLowerCase();
        return (findIndex(terms, term => {
          return name.indexOf(term) === -1 && investigatorName.indexOf(term) === -1;
        }) === -1);
      }), deckId => {
        return {
          key: `${deckId}`,
          deckId,
        };
      });

    return (
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        style={styles.container}
        data={data}
        renderItem={this._renderItem}
        extraData={this.props.decks}
        ListHeaderComponent={this._renderHeader}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    decks: getAllDecks(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(DeckListComponent),
  {
    schemas: ['Card'],
    mapToProps(results) {
      const investigatorCards =
        results.cards.filtered('type_code == "investigator"');
      const investigators = {};
      const cards = {};
      forEach(results.cards, card => {
        cards[card.code] = card;
        if (card.type_code === 'investigator') {
          investigators[card.code] = card;
        }
      });
      return {
        cards,
        investigators,
      };
    },
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  footer: {
    height: 100,
  },
});
