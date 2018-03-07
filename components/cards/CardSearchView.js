import React from 'react';
import PropTypes from 'prop-types';
import { filter, range, values } from 'lodash';
const {
  StyleSheet,
  FlatList,
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator
} = require('react-native');
import SearchInput, { createFilter } from 'react-native-search-filter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CardType } from './types';

import * as Actions from '../../actions';
import CardText from './CardText';
import FactionChooser from './FactionChooser';
import TypeChooser from './TypeChooser';
import XpChooser from './XpChooser';

class CardResult extends React.PureComponent {
  static propTypes = {
    card: CardType,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.card.code);
  }

  render() {
    const {
      card,
    } = this.props;
    if (!card.name) {
      return <Text>{'No Text'}</Text>;
    }
    const xpStr = (card.xp && range(0, card.xp).map(() => '•').join('')) || '';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Text>{ `${card.name}${xpStr}` }</Text>
      </TouchableOpacity>
    );
  }
}

class CardSearchView extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      factions: [],
      types: [],
      xpLevels: [],
    };

    this._searchUpdated = this.searchUpdated.bind(this);

    this._selectedFactionsChanged = this.selectedFactionsChanged.bind(this);
    this._selectedTypesChanged = this.selectedTypesChanged.bind(this);
    this._selectedXpChanged = this.selectedXpChanged.bind(this);

    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._renderCard = this.renderCard.bind(this);
  }

  cardToKey(card) {
    return card.code;
  }

  selectedFactionsChanged(factions) {
    this.setState({
      factions,
    })
  }

  selectedTypesChanged(types) {
    this.setState({
      types,
    });
  }

  selectedXpChanged(xpLevels) {
    this.setState({
      xpLevels,
    });
  }

  cardPressed(cardId) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: cardId,
      },
    });
  }

  renderCard({ item }) {
    return <CardResult card={item} onPress={this._cardPressed} />;
  }

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
  }

  applyQueryFilter(cards) {
    const {
      searchTerm,
    } = this.state;

    if (searchTerm === '') {
      return cards;
    };

    return filter(cards, card => {
      return (card.name && card.name.indexOf(searchTerm) !== -1) ||
        (card.real_text && card.real_text.indexOf(searchTerm) !== -1) ||
        (card.traits && card.traits.indexOf(searchTerm) !== -1);
    });
  }

  applyFactionFilter(cards) {
    const {
      factions,
    } = this.state;
    if (factions.length === 0) {
      return cards;
    }
    return filter(cards, card => factions.indexOf(card.faction_code) !== -1);
  }

  applyTypeFilter(cards) {
    const {
      types,
    } = this.state;
    if (types.length === 0) {
      return cards;
    }
    return filter(cards, card => types.indexOf(card.type_code) !== -1);
  }

  applyXpFilter(cards) {
    const {
      xpLevels,
    } = this.state;
    const {
      types,
    } = this.state;
    if (xpLevels.length === 0) {
      return cards;
    }
    return filter(cards, card => xpLevels.indexOf(card.xp || 0) !== -1);
  }

  filteredCards() {
    const {
      cards,
    } = this.props;
    const cardsList = Object.keys(cards).map(id => cards[id]);
    const queryCards = this.applyQueryFilter(cardsList);
    const factionCards = this.applyFactionFilter(queryCards);
    const typeCards = this.applyTypeFilter(factionCards);
    return this.applyXpFilter(typeCards);
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
        <FactionChooser onChange={this._selectedFactionsChanged} />
        <View style={styles.row}>
          <TypeChooser onChange={this._selectedTypesChanged} />
          <XpChooser onChange={this._selectedXpChanged} />
        </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
