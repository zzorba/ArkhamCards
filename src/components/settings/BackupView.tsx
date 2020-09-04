import React from 'react';
import {
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { format } from 'date-fns';
import { Navigation } from 'react-native-navigation';
import { forEach, values } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux';
import base64 from 'react-native-base64';
import Share from 'react-native-share';
import { t } from 'ttag';

import CategoryHeader from './CategoryHeader';
import { MergeBackupProps } from './MergeBackupView';
import { Campaign, BackupState } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { getBackupData, AppState } from '@reducers';
import SettingsItem from './SettingsItem';
import { ensureUuid } from './actions';
import COLORS from '@styles/colors';
import { campaignFromJson } from '@lib/cloudHelper';

export interface BackupProps {
  safeMode?: boolean;
}

interface ReduxProps {
  backupData: BackupState;
}

interface ReduxActionProps {
  ensureUuid: () => void;
}

type Props = BackupProps & NavigationProps & ReduxProps & ReduxActionProps & InjectedDialogProps;

class BackupView extends React.Component<Props> {
  componentDidMount() {
    this.props.ensureUuid();
  }

  _pickBackupFile = async() => {
    const { componentId } = this.props;
    if (!await this.hasFileSystemPermission(true)) {
      return;
    }
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (!res.name.endsWith('.acb') && !res.name.endsWith('.json')) {
        Alert.alert(
          t`Unexpected file type`,
          t`This app expects an Arkham Cards backup file (.acb/.json)`,
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
      const json = JSON.parse(await RNFS.readFile(res.fileCopyUri));
      const campaigns: Campaign[] = [];
      forEach(values(json.campaigns), campaign => {
        campaigns.push(campaignFromJson(campaign));
      });
      Navigation.push<MergeBackupProps>(componentId, {
        component: {
          name: 'Settings.MergeBackup',
          passProps: {
            backupData: {
              guides: json.guides,
              decks: values(json.decks),
              campaigns,
              deckIds: json.deckIds,
              campaignIds: json.campaignIds,
            },
          },
        },
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  };

  _importCampaignData = () => {
    Alert.alert(
      t`Restore campaign data?`,
      t`This feature will let you restore data from a lost device. If you were signed into ArkhamDB, please reauthorize before importing campaign data.\n\nAfter a backup is selected, you will be able to choose which data to import.`,
      [{
        text: t`Import data`,
        onPress: this._pickBackupFile,
      },{
        text: t`Cancel`,
        style: 'cancel',
      }],
    );
  };

  async hasFileSystemPermission(read: boolean) {
    if (Platform.OS === 'ios') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        read ? 'android.permission.READ_EXTERNAL_STORAGE' : 'android.permission.WRITE_EXTERNAL_STORAGE'
      );
      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          return true;
        case PermissionsAndroid.RESULTS.DENIED:
          return false;
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          Alert.alert(t`Cannot request access`, t`It looks like you previously denied allowing Arkham Cards to read/write external files. Please visit your System settings to adjust this permission, and try again.`);
          return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  _exportCampaignData = () => {
    const { backupData } = this.props;
    Alert.alert(
      t`Backup campaign data?`,
      t`This will let you backup your local decks and campaigns for safe-keeping. This can also be used to move them to another device.`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: async() => {
          try {
            if (!await this.hasFileSystemPermission(false)) {
              return;
            }
            const date = format(new Date(), 'yyyy-MM-dd');
            const filename = `ACB-${date}`;
            if (Platform.OS === 'ios') {
              const path = `${RNFS.CachesDirectoryPath }/${ filename }.acb`;
              await RNFS.writeFile(
                path,
                JSON.stringify(backupData),
                'utf8'
              );
              await Share.open({
                url: `file://${path}`,
                saveToFiles: true,
                filename,
                type: 'text/json',
              });
            } else {
              await Share.open({
                title: t`Save backup`,
                message: filename,
                url: `data:application/json;base64,${base64.encode(JSON.stringify(backupData))}`,
                filename,
                failOnCancel: false,
                showAppsToView: true,
              });
            }
          } catch (e) {
            console.log(e);
          }
        },
      }],
    );
  };

  render() {
    const {
      safeMode,
    } = this.props;
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
          { !safeMode && (
            <SettingsItem
              onPress={this._importCampaignData}
              text={t`Restore Campaign Data`}
            />
          ) }
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    backupData: getBackupData(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    ensureUuid,
  }, dispatch);
}

export default withDialogs(
  connect<ReduxProps, ReduxActionProps, InjectedDialogProps & BackupProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(BackupView)
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
