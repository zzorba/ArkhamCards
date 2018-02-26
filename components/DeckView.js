import React from 'react';
import PropTypes from 'prop-types';
const {
  StyleSheet,
  ListView,
  View,
  Text,
  ActivityIndicator
} = require('react-native');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';

class DeckView extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    getDeck: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getDeck(this.props.id);
  }

  render() {
    const {
      deck,
    } = this.props
    if (!deck) {
      return (
        <View>
          <Text>Loading: { this.props.id }</Text>
        </View>
      );
    }
    console.log(deck);
    return (
      <View>
        <Text>Loaded Deck: { deck.name }</Text>
      </View>
    );
  }
};

// The function takes data from the app current state,
// // and insert/links it into the props of our component.
// // This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  console.log(`Mapping down state for ${props.id}`);
  console.log(state.decks);
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
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
