import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';
const {
  StyleSheet,
  FlatList,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator
} = require('react-native');
import SearchInput, { createFilter } from 'react-native-search-filter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SimpleMarkdown from 'simple-markdown'

import * as Actions from '../../actions';
import CardText from './CardText';

class CardResult extends React.PureComponent {
  static propTypes = {
    card: PropTypes.object.isRequired,
  };

  render() {
    const {
      card,
    } = this.props;
    if (!card.real_text) {
      return <Text>{'No Text'}</Text>;
    }
    return (
      <CardText text={card.real_text} />
    );
  }
}

class CardSearchView extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this._searchUpdated = this.searchUpdated.bind(this);

    this._cardToKey = this.cardToKey.bind(this);
    this._renderCard = this.renderCard.bind(this);
  }

  cardToKey(card) {
    return card.code;
  }

  renderCard({ item }) {
    return <CardResult card={item} />;
  }

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
  }

  filteredCards() {
    const {
      cards,
    } = this.props;
    const {
      searchTerm,
    } = this.state;

    if (searchTerm === '') {
      return [];
    };

    return Object.keys(cards).map(id => cards[id]).filter(card => {
      return (card.name && card.name.indexOf(searchTerm) !== -1) ||
        (card.real_text && card.real_text.indexOf(searchTerm) !== -1) ||
        (card.traits && card.traits.indexOf(searchTerm) !== -1);
    });
  }

  render() {
    const results = this.filteredCards();
    return (
      <View style={styles.container}>
        <SearchInput
          onChangeText={this._searchUpdated}
          style={styles.searchInput}
          placeholder="Search for a card"
        />
        <FlatList
          data={results}
          renderItem={this._renderCard}
          keyExtractor={this._cardToKey}
        />
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    cards: state.cards.all,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(CardSearchView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
});
