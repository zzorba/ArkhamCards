import React, { useCallback, useContext, useEffect } from 'react';
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
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import base64 from 'react-native-base64';
import Share from 'react-native-share';
import { t } from 'ttag';
import utf8 from 'utf8';

import { MergeBackupProps } from './MergeBackupView';
import { BackupState, Campaign, LegacyBackupState, LegacyCampaign } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { getBackupData } from '@reducers';
import SettingsItem from './SettingsItem';
import { ensureUuid } from './actions';
import { campaignFromJson } from '@components/settings/MergeBackupView/backupHelper';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';

export interface BackupProps {
  safeMode?: boolean;
}

async function safeReadFile(file: string): Promise<string> {
  try {
    return await RNFS.readFile(file, 'utf8');
  } catch (error) {
    return await RNFS.readFile(file, 'ascii');
  }
}


async function hasFileSystemPermission(read: boolean) {
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
        Alert.alert(t`Missing system permission`, t`It looks like you previously denied allowing Arkham Cards to read/write external files. Please visit your System settings to adjust this permission, and try again.`);
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

export default function BackupView({ componentId, safeMode }: BackupProps & NavigationProps) {
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ensureUuid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const backupData = useSelector(getBackupData);
  const pickBackupFile = useCallback(async() => {
    if (!await hasFileSystemPermission(true)) {
      return;
    }
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      if (!res.name.endsWith('.acb') && !res.name.endsWith('.json') && !res.name.endsWith('.null')) {
        Alert.alert(
          t`Unexpected file type`,
          t`This app expects an Arkham Cards backup file (.acb/.json)`,
          [{
            text: t`Try again`,
            onPress: pickBackupFile,
          },{
            text: t`Cancel`,
            style: 'cancel',
          }]
        );
        return;
      }
      // We got the file
      const json = JSON.parse(await safeReadFile(res.uri));
      const campaigns: Campaign[] = [];
      forEach(values(json.campaigns), campaign => {
        campaigns.push(campaignFromJson(campaign));
      });

      const backupData: BackupState | LegacyBackupState = json.version && json.version === 1 ? {
        version: 1,
        guides: json.guides,
        decks: json.decks,
        campaigns: json.campaigns,
      } : {
        version: undefined,
        guides: json.guides,
        decks: values(json.decks),
        campaigns: campaigns as LegacyCampaign[],
        deckIds: json.deckIds,
        campaignIds: json.campaignIds,
      };
      Navigation.push<MergeBackupProps>(componentId, {
        component: {
          name: 'Settings.MergeBackup',
          passProps: {
            backupData,
          },
        },
      });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        throw err;
      }
    }
  }, [componentId]);

  const importCampaignData = useCallback(() => {
    Alert.alert(
      t`Restore campaign data?`,
      t`This feature will let you restore data from a lost device. If you were signed into ArkhamDB, please reauthorize before importing campaign data.\n\nAfter a backup is selected, you will be able to choose which data to import.`,
      [{
        text: t`Import data`,
        onPress: pickBackupFile,
      },{
        text: t`Cancel`,
        style: 'cancel',
      }],
    );
  }, [pickBackupFile]);

  const exportCampaignData = useCallback(() => {
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
            if (!await hasFileSystemPermission(false)) {
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
                title: filename,
                type: 'text/json',
              });
            } else {
              await Share.open({
                title: t`Save backup`,
                message: filename,
                url: `data:application/json;base64,${base64.encode(utf8.encode(JSON.stringify(backupData)))}`,
                type: 'data:application/json',
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
  }, [backupData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.L20 }]}>
      <ScrollView style={{ backgroundColor: colors.L20 }}>
        <CardSectionHeader section={{ title: t`Backup` }} />
        <SettingsItem
          onPress={exportCampaignData}
          text={t`Backup Campaign Data`}
        />
        { !safeMode && (
          <SettingsItem
            onPress={importCampaignData}
            text={t`Restore Campaign Data`}
          />
        ) }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
