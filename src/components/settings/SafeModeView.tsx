import React from 'react';
import { Alert, SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { clearDecks } from '@actions';
import BasicButton from '@components/core/BasicButton';
import { AppState, getLangPreference, getLangChoice } from '@reducers';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import SettingsItem from './SettingsItem';
import { BackupProps } from './BackupView';
import COLORS from '@styles/colors';

interface OwnProps {
  componentId: string;
  startApp: () => void;
}

interface State {
  safeMode: boolean;
  cacheCleared: boolean;
}

interface ReduxProps {
  lang: string;
  langChoice: string;
}

interface ReduxActionProps {
  clearDecks: () => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

class SafeModeView extends React.Component<Props, State> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  state: State = {
    safeMode: false,
    cacheCleared: false,
  };

  _launchApp = () => {
    this.props.startApp();
  };

  _enableSafeMode = () => {
    const { componentId } = this.props;
    Navigation.mergeOptions(componentId, {
      topBar: {
        visible: true,
        title: {
          text: t`Safe mode`,
        },
      },
    });
    this.setState({
      safeMode: true,
    });
  };

  componentDidMount() {
    Alert.alert(
      t`The app drew an Auto-Fail`,
      t`Sorry about that. If the app is crashing on launch, you can enter 'Safe mode' to backup your data.`,
      [
        { text: t`Start normally`, style: 'cancel', onPress: this._launchApp },
        { text: t`Safe mode`, onPress: this._enableSafeMode },
      ],
    );
  }


  navButtonPressed(screen: string, title: string) {
    Navigation.push(this.props.componentId, {
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


  _backupPressed = () => {
    Navigation.push<BackupProps>(this.props.componentId, {
      component: {
        name: 'Settings.Backup',
        passProps: {
          safeMode: true,
        },
        options: {
          topBar: {
            title: {
              text: t`Backup`,
            },
            backButton: {
              title: t`Done`,
            },
          },
        },
      },
    });
  };

  async clearDatabase() {
    await (await this.context.db.cardsQuery()).delete().execute();
    await (await this.context.db.encounterSets()).createQueryBuilder().delete().execute();
    await (await this.context.db.faqEntries()).createQueryBuilder().delete().execute();
    await (await this.context.db.tabooSets()).createQueryBuilder().delete().execute();
  }

  _clearCache = async () => {
    const {
      clearDecks,
    } = this.props;
    clearDecks();
    await this.clearDatabase();
    this.setState({
      cacheCleared: true,
    });
  };

  render() {
    const { safeMode, cacheCleared } = this.state;
    if (!safeMode) {
      return <View style={styles.background} />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.settings}>
          <SettingsItem
            navigation
            onPress={this._backupPressed}
            text={t`Backup Data`}
          />
          { cacheCleared ? (
            <SettingsItem
              navigation
              text={t`Cache cleared`}
            />
          ) : (
            <SettingsItem
              navigation
              onPress={this._clearCache}
              text={t`Clear cache`}
            />
          ) }
          <BasicButton
            onPress={this._launchApp}
            title={t`Done`}
          />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    lang: getLangPreference(state),
    langChoice: getLangChoice(state),
  };
}


function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    clearDecks,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SafeModeView);

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#212C6A',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  settings: {
    backgroundColor: COLORS.background,
  }
});

