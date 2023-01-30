import { Alert, PermissionsAndroid, Platform, Share as LegacyShare } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import { t } from 'ttag';

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

export async function saveFile(filename: string, data: string, extension: string, title: string) {
  if (!await hasFileSystemPermission(false)) {
    return;
  }
  if (Platform.OS === 'ios') {
    const path = `${RNFS.CachesDirectoryPath }/${ filename }.${extension}`;
    await RNFS.writeFile(path, data, 'utf8');
    if (Platform.Version && parseInt(`${Platform.Version}`, 10) < 13) {
      await LegacyShare.share({
        url: `file://${path}`,
      });
    } else {
      await Share.open({
        url: `file://${path}`,
        saveToFiles: true,
        filename,
        title: filename,
        type: 'text/json',
      });
    }
  } else {
    await Share.open({
      title,
      message: filename,
      url: `data:application/json;base64,${base64.encode(utf8.encode(data))}`,
      type: 'data:application/json',
      filename,
      failOnCancel: false,
      showAppsToView: true,
    });
  }
}