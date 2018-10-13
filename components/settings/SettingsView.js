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
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import { clearDecks } from '../../actions';
import { fetchCards } from '../cards/actions';
import { getAllDecks } from '../../reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';

const defaultImageCacheManager = ImageCacheManager();

class SettingsView extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    componentId: PropTypes.string.isRequired,
    lang: PropTypes.string,
    fetchCards: PropTypes.func.isRequired,
    clearDecks: PropTypes.func.isRequired,
    cardsLoading: PropTypes.bool,
    cardsError: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this._languagePressed = this.languagePressed.bind(this);
    this._myCollectionPressed = this.navButtonPressed.bind(this, 'My.Collection', L('Edit Collection'));
    this._editSpoilersPressed = this.navButtonPressed.bind(this, 'My.Spoilers', L('Edit Spoilers'));
    this._diagnosticsPressed = this.navButtonPressed.bind(this, 'Settings.Diagnostics', L('App Diagnostics'));
    this._aboutPressed = this.navButtonPressed.bind(this, 'About', L('About'));
    this._doSyncCards = this.doSyncCards.bind(this);
  }

  languagePressed() {
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Language',
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  }

  navButtonPressed(screen, title) {
    Navigation.push(this.props.componentId, {
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: title,
            },
            backButton: {
              title: L('Done'),
            },
          },
        },
      },
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
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang);
  }

  renderSyncCards() {
    const {
      cardsLoading,
      cardsError,
    } = this.props;
    if (cardsLoading) {
      return (
        <SettingsItem text={L('Updating cards')} loading />
      );
    }
    return (
      <View>
        <SettingsItem
          onPress={this._doSyncCards}
          text={cardsError ? L('Error: check for updated cards again') : L('Check for updated cards')}
        />
        <SettingsItem onPress={this._languagePressed} text={L('Card Language')} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <LoginButton />
          <SettingsItem onPress={this._myCollectionPressed} text={L('Card Collection')} />
          <SettingsItem onPress={this._editSpoilersPressed} text={L('Spoiler Settings')} />
          { this.renderSyncCards() }
          <SettingsItem onPress={this._diagnosticsPressed} text={L('Diagnostics')} />
          <SettingsItem onPress={this._aboutPressed} text={L('About')} />
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
    lang: state.packs.lang,
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
