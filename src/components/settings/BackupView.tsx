import React from 'react';
import {
  Alert,
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
import { values } from 'lodash';
import { t } from 'ttag';

import CategoryHeader from './CategoryHeader';
import { MergeBackupProps } from './MergeBackupView';
import { Campaign, CampaignGuideState, Deck } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { getBackupData, AppState } from '@reducers';
import SettingsItem from './SettingsItem';
import { ensureUuid } from './actions';
import COLORS from '@styles/colors';
import { Navigation } from 'react-native-navigation';
import { forEach } from 'lodash';

interface ReduxProps {
  backupData: {
    campaigns: Campaign[];
    decks: Deck[];
    guides: {
      [id: string]: CampaignGuideState;
    };
  };
}

interface ReduxActionProps {
  ensureUuid: () => void;
}

type Props = NavigationProps & ReduxProps & ReduxActionProps & InjectedDialogProps;

class BackupView extends React.Component<Props> {
  componentDidMount() {
    this.props.ensureUuid();
  }

  _pickBackupFile = async() => {
    const { componentId } = this.props;
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
      const json = JSON.parse(await RNFS.readFile(res.fileCopyUri));
      const campaigns: Campaign[] = [];
      forEach(values(json.campaigns), campaign => {
        campaigns.push({
          ...campaign,
          lastUpdated: new Date(Date.parse(campaign.lastUpdated)),
        });
      });
      Navigation.push<MergeBackupProps>(componentId, {
        component: {
          name: 'Settings.MergeBackup',
          passProps: {
            guides: json.guides,
            decks: values(json.decks),
            campaigns,
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
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    ensureUuid,
  }, dispatch);
}

export default withDialogs(
  connect<ReduxProps, ReduxActionProps, InjectedDialogProps, AppState>(
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
