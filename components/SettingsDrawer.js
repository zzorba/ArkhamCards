import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../actions';
import { syncCards } from '../lib/api';
import { getAllDecks } from '../reducers';

class SettingsDrawer extends React.Component {
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
    this.props.navigator.handleDeepLink({
      link: '/collection',
      payload: {
        closeDrawer: true,
      },
    });
  }

  editSpoilersPressed() {
    this.props.navigator.handleDeepLink({
      link: '/spoilers',
      payload: {
        closeDrawer: true,
      },
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
    this.doSyncCards();
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
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <Text>Settings</Text>
          <Button onPress={this._myCollectionPressed} title="Edit Collection" />
          <Button onPress={this._editSpoilersPressed} title="Edit Spoilers" />
          <Button onPress={this._doSyncCards} title="Check for card updates" />
          <Button onPress={this._clearCache} title="Clear cache" />
        </View>
      </SafeAreaView>
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
  connect(mapStateToProps, mapDispatchToProps)(SettingsDrawer), {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
        cards: results.cards,
        cardCount: results.cards.length,
      };
    },
  });

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  list: {
    padding: 8,
  },
});
