import React from 'react';
import {
  Alert,
  InteractionManager,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Platform,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';

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
import { ensureUuid } from './actions';
import COLORS from '@styles/colors';
import { s } from '@styles/space';

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
  ensureUuid: () => void;
}

type Props = ReduxProps & ReduxActionProps & InjectedDialogProps;

class DiagnosticsView extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  componentDidMount() {
    this.props.ensureUuid();
  }

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

  _pickBackupFile = async() => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      });
      if (!res.name.endsWith('.acb')) {
        Alert.alert(
          t`Unexpected file type`,
          t`This app expects an Arkham Cards backup file (.acb)`,
          [{
            text: t`Try again`,
            onPress: this._pickBackupFile,
          },{
            text: t`Cancel`,
            style: 'cancel',
          }]
        );
        return;
      }
      // We got the file
      const contents = await RNFS.readFile(res.fileCopyUri);
      Alert.alert(contents.substr(0, 100));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  };

  _importCampaignData = () => {
    Alert.alert(
      t`Restore campaign data?`,
      t`This feature will let you restore data from a lost device. After a backup is selected, you can choose which data to backup`,
      [{
        text: t`Import data`,
        onPress: this._pickBackupFile,
      },{
        text: t`Cancel`,
        style: 'cancel',
      }],
    );
  };

  _exportCampaignData = () => {
    Alert.alert(
      t`Backup campaign data?`,
      t`This will let you backup your local decks and campaigns for safe-keeping, or to move them to another device.`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: () => {
          if (Platform.OS === 'ios') {
            const path = RNFS.CachesDirectoryPath + '/arkham-cards-backup.acb';
            RNFS.writeFile(
              path,
              JSON.stringify(this.props.backupData),
              'utf8'
            ).then(() => {
              Share.share({
                url: `file://${path}`,
              });
            });
          } else {
            Share.share({
              url: 'data:text/acb;base64,32342342342',
              showAppsToView: true,
            });
          }
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
    ensureUuid,
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
