import { filter, map, maxBy, minBy, sortBy } from 'lodash';
import { format as formatDate } from 'date-fns';

import * as FileSystem from 'expo-file-system/legacy';
import { AppState, getBackupData } from '@reducers';

export interface AutomaticBackupFile {
  date: Date;
  file: {
    name: string;
    path: string;
  };
}

const BACKUP_DIRECTORY = `${FileSystem.documentDirectory}ArkhamCards/`;

export async function loadBackupFiles(): Promise<AutomaticBackupFile[]> {
  try {
    const filenames = await FileSystem.readDirectoryAsync(BACKUP_DIRECTORY);
    return sortBy(map(
      filter(filenames, name => name.endsWith('.bkp')),
      (name) => {
        const date = new Date(Date.parse(name.replace('.bkp', '')));
        return {
          date,
          file: {
            name,
            path: BACKUP_DIRECTORY + name,
          },
        };
      }
    ), (backup) => -backup.date.getTime()
    );
  } catch (e) {
    // Directory doesn't exist yet
    return [];
  }
}

const MAX_BACKUPS = 14;
const BACKUP_CADENCE_DAYS = 2;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function maybeSaveAutomaticBackup(state: AppState) {
  const now = Date.now();
  try {
    await FileSystem.makeDirectoryAsync(BACKUP_DIRECTORY, { intermediates: true });
    const backups = await loadBackupFiles();
    const latestBackup = maxBy(backups, backup => backup.date.getTime());
    if (!latestBackup || (now - latestBackup.date.getTime()) > MS_PER_DAY * BACKUP_CADENCE_DAYS) {
      const newFileName = `${formatDate(new Date(now), 'yyyy-MM-dd')}.bkp`;
      const newFilePath = BACKUP_DIRECTORY + newFileName;
      if (backups.length > MAX_BACKUPS) {
        // Delete an old backup.
        const oldestBackup = minBy(backups, backup => backup.date.getTime());
        if (oldestBackup) {
          await FileSystem.moveAsync({
            from: oldestBackup.file.path,
            to: newFilePath,
          });
        }
      }
      const backupData = getBackupData(state);
      const data = JSON.stringify(backupData);
      await FileSystem.writeAsStringAsync(newFilePath, data);
    }
  } catch(e) {
    console.error(e.message || e);
  }
}