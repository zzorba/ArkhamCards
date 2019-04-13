import React from 'react';
import { keys } from 'lodash';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Realm, { Results } from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import { ImageCacheManager } from 'react-native-cached-image';
import { Navigation } from 'react-native-navigation';
import {
  SettingsCategoryHeader,
} from 'react-native-settings-components';

import { t } from 'ttag';
import { clearDecks } from '../../actions';
import { fetchCards } from '../cards/actions';
import Card from '../../data/Card';
import { getAllDecks, AppState } from '../../reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';
import { COLORS } from '../../styles/colors';

const defaultImageCacheManager = ImageCacheManager();

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  lang: string;
  cardsLoading?: boolean;
  cardsError?: string;
  deckCount: number;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
  clearDecks: () => void;
}

interface RealmProps {
  realm: Realm;
  cards: Results<Card>;
  cardCount: number;
}

type Props = OwnProps & ReduxProps & ReduxActionProps & RealmProps;

class SettingsView extends React.Component<Props> {
  _languagePressed = () => {
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
  };

  navButtonPressed(screen: string, title: string) {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: title,
            },
            backButton: {
              title: t`Done`,
            },
          },
        },
      },
    });
  }

  _myCollectionPressed = () => {
    this.navButtonPressed('My.Collection', t`Edit Collection`);
  };

  _editSpoilersPressed = () => {
    this.navButtonPressed('My.Spoilers', t`Edit Spoilers`);
  };

  _diagnosticsPressed = () => {
    this.navButtonPressed('Settings.Diagnostics', t`Diagnostics`);
  };

  _aboutPressed = () => {
    this.navButtonPressed('About', t`About Arkham Cards`);
  };

  _clearImageCache = () => {
    defaultImageCacheManager.clearCache({});
  };

  _clearCache = () => {
    const {
      realm,
      clearDecks,
    } = this.props;
    clearDecks();
    realm.write(() => {
      realm.delete(realm.objects('Card'));
    });
    this._doSyncCards();
  };

  _doSyncCards = () => {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang || 'en');
  };

  renderSyncCards() {
    const {
      cardsLoading,
      cardsError,
    } = this.props;
    if (cardsLoading) {
      return (
        <React.Fragment>
          <SettingsItem text={t`Updating cards`} />
          <SettingsItem text={t`Card Language`} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <SettingsItem
          onPress={this._doSyncCards}
          text={cardsError ? t`Error: Check for Cards Again` : t`Check for New Cards on ArkhamDB`}
        />
        <SettingsItem onPress={this._languagePressed} text={t`Card Language`} />
      </React.Fragment>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <SettingsCategoryHeader
            title={t`Account`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <LoginButton settings />
          <SettingsCategoryHeader
            title={t`Card Data`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsItem navigation onPress={this._myCollectionPressed} text={t`Card Collection`} />
          <SettingsItem navigation onPress={this._editSpoilersPressed} text={t`Spoiler Settings`} />
          { this.renderSyncCards() }
          <SettingsCategoryHeader
            title={t`Debug`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsItem navigation onPress={this._diagnosticsPressed} text={t`Diagnostics`} />
          <SettingsCategoryHeader
            title={t`About Arkham Cards`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsItem navigation onPress={this._aboutPressed} text={t`About Arkham Cards`} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    cardsLoading: state.cards.loading,
    cardsError: state.cards.error || undefined,
    deckCount: keys(getAllDecks(state)).length,
    lang: state.packs.lang || 'en',
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    clearDecks,
    fetchCards,
  }, dispatch);
}

export default connectRealm<OwnProps, RealmProps, Card>(
  connect<ReduxProps, ReduxActionProps, OwnProps & RealmProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsView), {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>, realm: Realm): RealmProps {
      return {
        realm,
        cards: results.cards,
        cardCount: results.cards.length,
      };
    },
  });

interface Styles {
  container: ViewStyle;
  list: ViewStyle;
  androidCategory: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? COLORS.iosSettingsBackground : COLORS.white,
  },
  androidCategory: {
    color: COLORS.monza
  },
});
