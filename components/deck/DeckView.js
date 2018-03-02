import React from 'react';
import PropTypes from 'prop-types';
import { sum, uniqBy } from 'lodash';
const {
  StyleSheet,
  SectionList,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator
} = require('react-native');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Actions from '../../actions';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { parseDeck } from './parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckChartsTab from './DeckChartsTab';
import DeckEditTab from './DeckEditTab';

class DeckView extends React.Component {
  static propTypes = {
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
    } = this.props
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
        <DeckViewTab tabLabel="Deck" parsedDeck={pDeck} />
        <DeckChartsTab tabLabel="Charts" parsedDeck={pDeck} />
        <DeckEditTab tabLabel="Edit" parsedDeck={pDeck} />
      </ScrollableTabView>
    );
  }
};

// The function takes data from the app current state,
// // and insert/links it into the props of our component.
// // This function makes Redux know that this component needs to be passed a piece of the state
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

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(DeckView);

var styles = StyleSheet.create({
  container: {
    margin: 15,
  },
});
