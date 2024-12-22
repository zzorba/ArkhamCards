import { filter, map, maxBy, minBy, sortBy } from 'lodash';
import { format as formatDate } from 'date-fns';

import RNFS from 'react-native-fs';
import { AppState, getBackupData } from '@reducers';

export interface AutomaticBackupFile {
  date: Date;
  file: RNFS.ReadDirItem;
}

const BACKUP_DIRECTORY = `${RNFS.DocumentDirectoryPath }/ArkhamCards/`;

export async function loadBackupFiles(): Promise<AutomaticBackupFile[]> {
  const contents = await RNFS.readDir(BACKUP_DIRECTORY);
  return sortBy(map(
    filter(contents, c => c.name.endsWith('.bkp')),
    (file) => {
      const date = new Date(Date.parse(file.name.replace('.bkp', '')));
      return {
        date,
        file,
      };
    }
  ), (backup) => -backup.date.getTime()
  );
}

const MAX_BACKUPS = 14;
const BACKUP_CADENCE_DAYS = 2;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function maybeSaveAutomaticBackup(state: AppState) {
  const now = Date.now();
  try {
    await RNFS.mkdir(BACKUP_DIRECTORY);
    const backups = await loadBackupFiles();
    const latestBackup = maxBy(backups, backup => backup.date.getTime());
    if (!latestBackup || (now - latestBackup.date.getTime()) > MS_PER_DAY * BACKUP_CADENCE_DAYS) {
      const newFileName = `${formatDate(new Date(now), 'yyyy-MM-dd')}.bkp`;
      const newFilePath = BACKUP_DIRECTORY + newFileName;
      if (backups.length > MAX_BACKUPS) {
        // Delete an old backup.
        const oldestBackup = minBy(backups, backup => backup.date.getTime());
        if (oldestBackup) {
          await RNFS.moveFile(
            oldestBackup.file.path,
            newFilePath,
          );
        }
      }
      const backupData = getBackupData(state);
      const data = JSON.stringify(backupData);
      await RNFS.writeFile(newFilePath, data);
    }
  } catch(e) {
    console.error(e.message || e);
  }
}