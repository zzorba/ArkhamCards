import React from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { ImageCacheManager } from 'react-native-cached-image';
import { Navigation } from 'react-native-navigation';
import {
  SettingsCategoryHeader,
} from 'react-native-settings-components';

import L from '../../app/i18n';
import { clearDecks } from '../../actions';
import { fetchCards } from '../cards/actions';
import { getAllDecks } from '../../reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';
import { COLORS } from '../../styles/colors';

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
    this._diagnosticsPressed = this.navButtonPressed.bind(this, 'Settings.Diagnostics', L('Diagnostics'));
    this._aboutPressed = this.navButtonPressed.bind(this, 'About', L('About Arkham Cards'));
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
        <React.Fragment>
          <SettingsItem text={L('Updating cards')} />
          <SettingsItem text={L('Card Language')} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <SettingsItem
          onPress={this._doSyncCards}
          text={cardsError ? L('Error: Check for Cards Again') : L('Check for New Cards on ArkhamDB')}
        />
        <SettingsItem onPress={this._languagePressed} text={L('Card Language')} />
      </React.Fragment>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <SettingsCategoryHeader
            title={L('Account')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <LoginButton settings />
          <SettingsCategoryHeader
            title={L('Card Data')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <SettingsItem navigation onPress={this._myCollectionPressed} text={L('Card Collection')} />
          <SettingsItem navigation onPress={this._editSpoilersPressed} text={L('Spoiler Settings')} />
          { this.renderSyncCards() }
          <SettingsCategoryHeader
            title={L('Debug')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <SettingsItem navigation onPress={this._diagnosticsPressed} text={L('Diagnostics')} />
          <SettingsCategoryHeader
            title={L('About Arkham Cards')}
            textStyle={Platform.OS === 'android' ? { color: COLORS.monza } : null}
          />
          <SettingsItem navigation onPress={this._aboutPressed} text={L('About Arkham Cards')} />
        </ScrollView>
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
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? COLORS.iosSettingsBackground : COLORS.white,
  },
});
