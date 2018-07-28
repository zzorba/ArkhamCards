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
import { ImageCacheManager } from 'react-native-cached-image';

import { clearDecks } from '../../actions';
import { fetchCards } from '../cards/actions';
import { getAllDecks } from '../../reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';

const defaultImageCacheManager = ImageCacheManager();

class SettingsView extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    fetchCards: PropTypes.func.isRequired,
    clearDecks: PropTypes.func.isRequired,
    cardsLoading: PropTypes.bool,
    cardsError: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._myCollectionPressed = this.navButtonPressed.bind(this, 'My.Collection', 'Edit Collection');
    this._editSpoilersPressed = this.navButtonPressed.bind(this, 'My.Spoilers', 'Edit Spoilers');
    this._diagnosticsPressed = this.navButtonPressed.bind(this, 'Settings.Diagnostics', 'App Diagnostics');
    this._aboutPressed = this.navButtonPressed.bind(this, 'About', 'About');
    this._doSyncCards = this.doSyncCards.bind(this);
  }

  navButtonPressed(screen, title) {
    this.props.navigator.push({
      screen,
      title,
      backButtonTitle: 'Done',
    });
  }

  clearImageCache() {
    defaultImageCacheManager.clearCache({});
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
      fetchCards,
    } = this.props;
    fetchCards(realm);
  }

  renderSyncCards() {
    const {
      cardsLoading,
      cardsError,
    } = this.props;
    if (cardsLoading) {
      return (
        <SettingsItem onPress={this._doSyncCards} text="Updating cards" loading />
      );
    }
    return (
      <SettingsItem
        onPress={this._doSyncCards}
        text={cardsError ? 'Error: check for updated cards again' : 'Check for updated cards'}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <LoginButton />
          <SettingsItem onPress={this._myCollectionPressed} text="Card Collection" />
          <SettingsItem onPress={this._editSpoilersPressed} text="Spoiler Settings" />
          { this.renderSyncCards() }
          <SettingsItem onPress={this._diagnosticsPressed} text="Diagnostics" />
          <SettingsItem onPress={this._aboutPressed} text="About" />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    cardsLoading: state.cards.loading,
    cardsError: state.cards.error,
    deckCount: keys(getAllDecks(state)).length,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearDecks,
    fetchCards,
  }, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(SettingsView), {
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
    paddingTop: 16,
  },
  list: {
    padding: 8,
  },
});
