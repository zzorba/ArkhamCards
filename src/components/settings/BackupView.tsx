import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import { forEach, map, values } from 'lodash';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { MergeBackupProps } from './MergeBackupView';
import { BackupState, Campaign, LegacyBackupState, LegacyCampaign } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { getBackupData } from '@reducers';
import SettingsItem from './SettingsItem';
import { ensureUuid } from './actions';
import { campaignFromJson } from '@components/settings/MergeBackupView/backupHelper';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import { saveFile } from '@lib/files';
import { isAndroidVersion } from '@components/DeckNavFooter/constants';
import { AutomaticBackupFile, loadBackupFiles } from '@app/autoBackup';

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
  if (isAndroidVersion(13)) {
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

function AutommaticBackupItem({ componentId, backup }: { backup: AutomaticBackupFile } & NavigationProps) {
  const onPress = useCallback(async() => {
    const json = JSON.parse(await safeReadFile(backup.file.path));
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
  }, [componentId, backup]);
  return <SettingsItem onPress={onPress} text={format(backup.date, 'yyyy-MM-dd')} />
}

export default function BackupView({ componentId, safeMode }: BackupProps & NavigationProps) {
  const { colors } = useContext(StyleContext);
  const dispatch = useDispatch();
  useEffect(() => {

    dispatch(ensureUuid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [autoBackups, setAutoBackups] = useState<AutomaticBackupFile[] | null>(null);
  useEffect(() => {
    let unmounted = false;
    if (!safeMode) {
      loadBackupFiles().then((backupFiles) => {
        if (!unmounted) {
          setAutoBackups(backupFiles)
        }
      });
    }
    return () => {
      unmounted = true;
    };
  }, [safeMode, setAutoBackups]);
  const backupData = useSelector(getBackupData);
  const pickBackupFile = useCallback(async() => {
    if (!await hasFileSystemPermission(true)) {
      return;
    }
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        mode: 'import',
        copyTo: 'cachesDirectory',
      });
      if (!res.name?.endsWith('.acb') && !res.name?.endsWith('.json') && !res.name?.endsWith('.null')) {
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
          const date = format(new Date(), 'yyyy-MM-dd');
          const filename = `ACB-${date}`;
          const data = JSON.stringify(backupData);
          try {
            await saveFile(filename, data, 'acb', t`Save backup`);
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
        <CardSectionHeader section={{ title: t`Manual Backup` }} />
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
        { !!autoBackups && (
          <>
            <CardSectionHeader section={{ title: t`Automatic Backup` }} />
            { map(autoBackups, backup => <AutommaticBackupItem key={backup.date.toString()} componentId={componentId} backup={backup} />)}
          </>
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
