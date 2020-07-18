import React from 'react';
import { keys } from 'lodash';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { SettingsSwitch } from 'react-native-settings-components';
import { t } from 'ttag';

import LanguagePicker from './LanguagePicker';
import CategoryHeader from './CategoryHeader';
import SettingsTabooPicker from './SettingsTabooPicker';
import { clearDecks } from '@actions';
import { fetchCards } from '@components/card/actions';
import { setSingleCardView } from './actions';
import { prefetch } from '@lib/auth';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { getAllDecks, AppState } from '@reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';
import COLORS from '@styles/colors';

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
  fetchCards: (db: Database, lang: string) => void;
  clearDecks: () => void;
  setSingleCardView: (value: boolean) => void;
}


type Props = OwnProps & ReduxProps & ReduxActionProps;

class SettingsView extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

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
      lang,
      fetchCards,
    } = this.props;
    fetchCards(this.context.db, lang || 'en');
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
          <CategoryHeader title={t`Account`} />
          <LoginButton settings />
          <CategoryHeader title={t`Card Settings`} />
          <SettingsItem
            navigation
            onPress={this._myCollectionPressed}
            text={t`Card Collection`}
          />
          <SettingsItem
            navigation
            onPress={this._editSpoilersPressed}
            text={t`Spoiler Settings`}
          />
          <SettingsTabooPicker />
          <CategoryHeader title={t`Card Data`} />
          <SettingsItem
            onPress={cardsLoading ? undefined : this._doSyncCards}
            text={this.syncCardsText()}
          />
          <LanguagePicker />
          <CategoryHeader title={t`Preferences`} />
          <SettingsSwitch
            title={t`Swipe between card results`}
            titleStyle={{ color: COLORS.darkText }}
            containerStyle={{ backgroundColor: COLORS.background }}
            value={!showCardsingleCardView}
            onValueChange={this._swipeBetweenCardsChanged}
          />
          <SettingsItem
            navigation
            onPress={this._diagnosticsPressed}
            text={t`Diagnostics`}
          />
          <CategoryHeader title={t`About Arkham Cards`} />
          <SettingsItem
            navigation
            onPress={this._aboutPressed}
            text={t`About Arkham Cards`}
          />
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

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SettingsView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: COLORS.veryLightBackground,
  },
  categoryContainer: {
    backgroundColor: COLORS.veryLightBackground,
  },
});
