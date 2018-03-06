import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
const {
  Button,
  StyleSheet,
  ListView,
  ScrollView,
  View,
  Text,
  ActivityIndicator
} = require('react-native');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';
import DeckListItem from './deck/DeckListItem';

class Home extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    cards: PropTypes.object,
    decks: PropTypes.object,
    packs: PropTypes.array,
    getCards: PropTypes.func.isRequired,
    getPacks: PropTypes.func.isRequired,
    getDeck: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      ds,
      deckIds: [101, 381, 180, 530, 2932, 294, 1179, 2381, 332],
    };

    this._deckNavClicked = this.deckNavClicked.bind(this);
  }

  componentDidMount() {
    if (Object.keys(this.props.cards).length === 0) {
      this.props.getCards(); //call our action
    }
    if (this.props.packs.length === 0) {
      this.props.getPacks();
    }
    this.state.deckIds.forEach(deckId => {
      if (!this.props.decks[deckId]) {
        this.props.getDeck(deckId);
      }
    });
  }

  deckNavClicked(id) {
    this.props.navigator.push({
      screen: 'Deck',
      passProps: {
        id: id,
      },
    });
  }

  render() {
    if (this.props.loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            animating={true}
            style={[{ height: 80 }]}
            size="small"
          />
        </View>
        );
    } else {
      return (
        <ScrollView style={{flex:1, backgroundColor: '#F5F5F5', paddingTop:20}}>
          { map(this.state.deckIds, deckId => {
            const deck = this.props.decks[deckId];
            return deck && <DeckListItem
              key={deckId}
              id={deckId}
              deck={deck}
              cards={this.props.cards}
              onPress={this._deckNavClicked}
            />
          })}
        </ScrollView>
      );
    }
  }

  renderCard(rowData, sectionID, rowID) {
    return (
      <View style={styles.row}>
        <Text style={styles.title}>
          { (parseInt(rowID) + 1)}{". "}{rowData.name }
        </Text>
        <Text style={styles.description}>
          { rowData.description }
        </Text>
      </View>
    );
  }
};



// The function takes data from the app current state,
// // and insert/links it into the props of our component.
// // This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  return {
    loading: state.cards.loading || state.packs.loading,
    cards: state.cards.all,
    packs: state.packs.all,
    decks: state.decks.all,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);

var styles = StyleSheet.create({
  activityIndicatorContainer:{
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },

  row:{
    borderBottomWidth: 1,
    borderColor: "#ccc",
    // height: 50,
    padding: 10
  },

  title:{
    fontSize: 15,
    fontWeight: "600"
  },

  description:{
    marginTop: 5,
    fontSize: 14,
  }
});
