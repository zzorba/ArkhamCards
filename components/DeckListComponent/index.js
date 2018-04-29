import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import DeckListItem from './DeckListItem';
import * as Actions from '../../actions';
import { getAllDecks } from '../../reducers';

class DeckListComponent extends React.Component {
  static propTypes = {
    deckIds: PropTypes.array.isRequired,
    deckClicked: PropTypes.func.isRequired,

    investigators: PropTypes.object,
    decks: PropTypes.object,
    fetchDeck: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      deckIds,
      decks,
      fetchDeck,
    } = this.props;
    deckIds.forEach(deckId => {
      if (!decks[deckId]) {
        fetchDeck(deckId, false);
      }
    });
  }

  renderItem(deckId) {
    const {
      investigators,
      decks,
      deckClicked,
    } = this.props;

    const deck = decks[deckId];
    return (
      <DeckListItem
        key={deckId}
        id={deckId}
        deck={deck}
        investigator={deck ? investigators[deck.investigator_code] : null}
        onPress={deckClicked}
      />
    );
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        { map(this.props.deckIds, deckId => this.renderItem(deckId)) }
      </ScrollView>
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
      const investigators = {};
      forEach(
        results.cards.filtered('type_code == "investigator"'),
        investigator => {
          investigators[investigator.code] = investigator;
        });
      return {
        investigators,
      };
    },
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
});
