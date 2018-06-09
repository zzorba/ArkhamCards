import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import * as Actions from '../../actions';
import { syncCards } from '../../lib/api';
import { getAllDecks } from '../../reducers';
import DrawerItem from './DrawerItem';

class SettingsDrawer extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    packs: PropTypes.array.isRequired,
    navigator: PropTypes.object.isRequired,
    clearDecks: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this._myCollectionPressed = this.navButtonPressed.bind(this, '/collection');
    this._editSpoilersPressed = this.navButtonPressed.bind(this, '/spoilers');
    this._aboutPressed = this.navButtonPressed.bind(this, '/about');
    this._doSyncCards = this.doSyncCards.bind(this);
    this._clearCache = this.clearCache.bind(this);
  }

  navButtonPressed(link) {
    this.props.navigator.handleDeepLink({
      link,
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
      packs,
    } = this.props;

    syncCards(realm, packs).catch(err => {
      this.setState({
        error: err.message || err,
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <DrawerItem onPress={this._myCollectionPressed} text="Edit Collection" />
          <DrawerItem onPress={this._editSpoilersPressed} text="Edit Spoilers" />
          <DrawerItem onPress={this._doSyncCards} text="Check for card updates" />
          <DrawerItem onPress={this._clearCache} text="Clear cache" />
          <DrawerItem onPress={this._aboutPressed} text="About this app" />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    deckCount: keys(getAllDecks(state)).length,
    packs: state.packs.all,
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
