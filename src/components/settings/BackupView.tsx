import React from 'react';
import {
  Alert,
  InteractionManager,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import CategoryHeader from './CategoryHeader';
import { Campaign, CampaignGuideState, Deck, Pack } from '@actions/types';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { clearDecks } from '@actions';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';
import { getBackupData, getAllPacks, AppState } from '@reducers';
import { fetchCards } from '@components/card/actions';
import { restoreBackup } from '@components/campaign/actions';
import SettingsItem from './SettingsItem';
import COLORS from '@styles/colors';

interface ReduxProps {
  backupData: {
    campaigns: Campaign[];
    decks: Deck[];
    guides: {
      [id: string]: CampaignGuideState;
    };
  };
  packs: Pack[];
  lang: string;
}

interface ReduxActionProps {
  fetchCards: (db: Database, lang: string) => void;
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
  clearDecks: () => void;
}

type Props = ReduxProps & ReduxActionProps & InjectedDialogProps;

class DiagnosticsView extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  _importBackupDataJson = (json: any) => {
    try {
      const backupData = JSON.parse(json) || {};
      const campaigns: Campaign[] = backupData.campaigns || [];
      const guides: { [id: string]: CampaignGuideState } = backupData.guides || {};
      const decks: Deck[] = backupData.decks || [];
      this.props.restoreBackup(
        campaigns,
        guides,
        decks
      );
      return;
    } catch (e) {
      console.log(e);
      Alert.alert(
        t`Problem with import`,
        t`We were not able to parse any campaigns from that pasted data.\n\nMake sure its an exact copy of the text provided by the Backup feature of an Arkham Cards app.`,
      );
    }
  };

  _importCampaignData = () => {
    const {
      showTextEditDialog,
    } = this.props;
    const erasedCopy = t`All local decks and campaigns will be overridden`;
    Alert.alert(
      t`Restore campaign data?`,
      t`This feature is intended for advanced diagnostics or to import data from another app.\n\n${erasedCopy}`,
      [{
        text: t`Nevermind`,
        style: 'cancel',
      }, {
        text: t`Import data`,
        style: 'destructive',
        onPress: () => {
          showTextEditDialog(
            t`Paste Backup Here`,
            '',
            (json) => {
              Keyboard.dismiss();
              InteractionManager.runAfterInteractions(
                () => this._importBackupDataJson(json)
              );
            },
            false,
            4
          );
        },
      }],
    );
  };

  _exportCampaignData = () => {
    Alert.alert(
      t`Backup campaign data?`,
      t`This feature is intended for advanced diagnostics or if you are trying to move your campaign data from one device to another. Just copy the data and paste it into the other app.`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: () => {
          Share.share({
            message: JSON.stringify(this.props.backupData),
          });
        },
      }],
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          <CategoryHeader
            title={t`Backup`}
          />
          <SettingsItem
            onPress={this._exportCampaignData}
            text={t`Backup Campaign Data`}
          />
          <SettingsItem
            onPress={this._importCampaignData}
            text={t`Restore Campaign Data`}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    backupData: getBackupData(state),
    packs: getAllPacks(state),
    lang: state.packs.lang || 'en',
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    clearDecks,
    fetchCards,
    restoreBackup,
  }, dispatch);
}

export default withDialogs(
  connect<ReduxProps, ReduxActionProps, InjectedDialogProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(DiagnosticsView)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.veryLightBackground,
  },
  list: {
    backgroundColor: COLORS.veryLightBackground,
  },
});
