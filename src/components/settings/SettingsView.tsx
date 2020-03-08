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
import { Navigation } from 'react-native-navigation';
import { SettingsCategoryHeader, SettingsSwitch } from 'react-native-settings-components';
import { t } from 'ttag';

import LanguagePicker from './LanguagePicker';
import SettingsTabooPicker from './SettingsTabooPicker';
import { clearDecks } from 'actions';
import { fetchCards } from 'components/card/actions';
import { setSingleCardView } from './actions';
import { prefetch } from 'lib/auth';
import Card from 'data/Card';
import { getAllDecks, AppState } from 'reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';
import { COLORS } from 'styles/colors';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  showCardsingleCardView: boolean;
  lang: string;
  cardsLoading?: boolean;
  cardsError?: string;
  deckCount: number;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
  clearDecks: () => void;
  setSingleCardView: (value: boolean) => void;
}

interface RealmProps {
  realm: Realm;
  cards: Results<Card>;
  cardCount: number;
}

type Props = OwnProps & ReduxProps & ReduxActionProps & RealmProps;

class SettingsView extends React.Component<Props> {
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

  componentDidMount() {
    prefetch();
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

  _doSyncCards = () => {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    fetchCards(realm, lang || 'en');
  };

  syncCardsText() {
    const {
      cardsLoading,
      cardsError,
    } = this.props;
    if (cardsLoading) {
      return t`Updating cards`;
    }
    return cardsError ?
      t`Error: Check for Cards Again` :
      t`Check for New Cards on ArkhamDB`;
  }

  _swipeBetweenCardsChanged = (value: boolean) => {
    this.props.setSingleCardView(!value);
  };

  render() {
    const { cardsLoading, showCardsingleCardView } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <SettingsCategoryHeader
            title={t`Account`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <LoginButton settings />
          <SettingsCategoryHeader
            title={t`Card Settings`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsItem navigation onPress={this._myCollectionPressed} text={t`Card Collection`} />
          <SettingsItem navigation onPress={this._editSpoilersPressed} text={t`Spoiler Settings`} />
          <SettingsTabooPicker />
          <SettingsCategoryHeader
            title={t`Card Data`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsItem
            onPress={cardsLoading ? undefined : this._doSyncCards}
            text={this.syncCardsText()}
          />
          <LanguagePicker />
          <SettingsCategoryHeader
            title={t`Preferences`}
            titleStyle={Platform.OS === 'android' ? styles.androidCategory : undefined}
          />
          <SettingsSwitch
            title={t`Swipe between card results`}
            value={!showCardsingleCardView}
            onValueChange={this._swipeBetweenCardsChanged}
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
    showCardsingleCardView: state.settings.singleCardView || false,
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
    setSingleCardView,
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
    color: COLORS.darkBlue,
  },
});
