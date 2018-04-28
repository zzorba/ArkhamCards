import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import {
  Button,
  View,
  Text,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../actions';
import { syncCards } from '../lib/api';
import { getAllDecks } from '../reducers';

class Settings extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    deckCount: PropTypes.number,
    cardCount: PropTypes.number,
    navigator: PropTypes.object.isRequired,
    clearDecks: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this._myCollectionPressed = this.myCollectionPressed.bind(this);
    this._editSpoilersPressed = this.editSpoilersPressed.bind(this);
    this._doSyncCards = this.doSyncCards.bind(this);
    this._clearCache = this.clearCache.bind(this);
  }

  myCollectionPressed() {
    this.props.navigator.push({
      screen: 'CollectionEdit',
    });
  }

  editSpoilersPressed() {
    this.props.navigator.push({
      screen: 'EditSpoilers',
      title: 'Spoiler Settings',
    });
  }

  clearCache() {
    const {
      realm,
      clearDecks,
    } = this.props;
    clearDecks();
    realm.write(() => {
      realm.delete(realm.objects('Card'));
    });
  }

  doSyncCards() {
    const {
      realm,
    } = this.props;

    syncCards(realm).catch(err => {
      this.setState({
        error: err.message || err,
      });
    });
  }

  render() {
    return (
      <View>
        <Text>Settings</Text>
        <Button onPress={this._myCollectionPressed} title="My Collection" />
        <Button onPress={this._editSpoilersPressed} title="Edit Spoilers" />
        <Text>We have { this.props.cardCount } cards in database</Text>
        <Text>We have { this.props.deckCount } decks in database</Text>
        <Button onPress={this._doSyncCards} title="Check for card updates" />
        <Button onPress={this._clearCache} title="Clear cache" />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    deckCount: keys(getAllDecks(state)).length,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(Settings), {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
        cards: results.cards,
        cardCount: results.cards.length,
      };
    },
  });
