import React from 'react';
import PropTypes from 'prop-types';
const {
  View,
  Text,
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Actions from '../../actions';
import { parseDeck } from './parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckChartsTab from './DeckChartsTab';
import DeckEditTab from './DeckEditTab';
import CardDrawSimulator from './CardDrawSimulator';

class DeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    cards: PropTypes.object,
    getDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getDeck(this.props.id);
  }

  render() {
    const {
      deck,
      cards,
      navigator,
    } = this.props;

    if (!deck) {
      return (
        <View>
          <Text>Loading: { this.props.id }</Text>
        </View>
      );
    }

    const pDeck = parseDeck(deck, cards);

    return (
      <ScrollableTabView>
        <DeckViewTab
          tabLabel="Deck"
          parsedDeck={pDeck}
          navigator={navigator} />
        <CardDrawSimulator
          tabLabel="Draw"
          parsedDeck={pDeck}
          cards={cards} />
        <DeckChartsTab
          tabLabel="Charts"
          parsedDeck={pDeck} />
        <DeckEditTab
          tabLabel="Edit"
          investigator={pDeck.investigator}
          slots={pDeck.deck.slots}
          cards={cards}
          navigator={navigator} />
      </ScrollableTabView>
    );
  }
}

function mapStateToProps(state, props) {
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
      cards: state.cards.all,
    };
  }
  return {
    deck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckView);
