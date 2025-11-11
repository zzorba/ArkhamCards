import * as FileSystem from 'expo-file-system/legacy';
import { CardCache } from '@actions/types';
import { Connection } from 'typeorm/browser';

export interface BundledDatabaseMetadata {
  schemaVersion?: number;
  cache?: CardCache;
  cardLang?: string;
  exportedAt?: string;
}

/**
 * Copies the bundled pre-built database from assets to the app's document directory
 * if it doesn't already exist. This allows us to ship with a pre-populated database
 * to skip the first-run download.
 *
 * Note: This function looks for the database in the app's bundle. To use this feature:
 * 1. Export database from dev tools
 * 2. Place arkham4.db and arkham4.metadata.txt in assets/generated/
 * 3. Rebuild the app
 *
 * @returns metadata if the database was copied, null otherwise
 */
/**
 * Load data from bundled database into the main database
 * @param connection - TypeORM connection to the main database
 * @param userLang - The user's preferred language
 * @returns metadata if the database was loaded, null otherwise
 */
export async function loadBundledDatabaseIfNeeded(
  connection: Connection,
  userLang?: string
): Promise<BundledDatabaseMetadata | null> {
  try {
    // Check if database already has data by checking if card table has any rows
    // TypeORM creates the database file and schema on init, so we can't just check if file exists
    try {
      const result = await connection.query('SELECT COUNT(*) as count FROM card');
      const count = result[0]?.count || 0;
      if (count > 0) {
        return null;
      }
    } catch (checkError) {
      // If we can't query, assume database is empty and continue
    }

    // Check if bundled database exists in the app bundle
    // Expo flattens assets to the bundle root directory
    const bundledDbPath = `${FileSystem.bundleDirectory}arkham4.db`;
    const bundledMetadataPath = `${FileSystem.bundleDirectory}arkham4.metadata.txt`;

    const bundledDbInfo = await FileSystem.getInfoAsync(bundledDbPath);

    if (!bundledDbInfo.exists) {
      return null;
    }

    // SQLite ATTACH DATABASE doesn't work with bundle paths on Android
    // So we need to copy the bundled database to a temporary location first
    const tempDbPath = `${FileSystem.cacheDirectory}temp_bundled.db`;

    try {
      // Copy bundled database to temporary location
      await FileSystem.copyAsync({
        from: bundledDbPath,
        to: tempDbPath,
      });

      // Verify the copy succeeded
      const copiedInfo = await FileSystem.getInfoAsync(tempDbPath);

      if (!copiedInfo.exists) {
        throw new Error('Failed to copy bundled database to temp location');
      }

      // Attach the temporary database
      // SQLite needs a plain filesystem path, not a file:// URI
      const sqlitePath = tempDbPath.replace(/^file:\/\//, '');
      await connection.query(`ATTACH DATABASE '${sqlitePath}' AS bundled`);

      // Copy all tables from bundled to main database
      // Use INSERT OR IGNORE to skip duplicates in case of partial previous load
      const tables = ['card', 'rule', 'taboo_set', 'faq_entry', 'encounter_set'];

      for (const table of tables) {
        await connection.query(`INSERT OR IGNORE INTO ${table} SELECT * FROM bundled.${table}`);
      }

      // Detach the bundled database
      await connection.query(`DETACH DATABASE bundled`);

      // Clean up temporary file
      await FileSystem.deleteAsync(tempDbPath, { idempotent: true });
    } catch (attachError) {
      console.error('Failed to load bundled database:', attachError);
      try {
        await connection.query(`DETACH DATABASE bundled`);
      } catch (e) {
        // Already detached or never attached
      }
      // Clean up temporary file if it exists
      try {
        await FileSystem.deleteAsync(tempDbPath, { idempotent: true });
      } catch (e) {
        // File doesn't exist or already deleted
      }
      return null;
    }

    // Try to load metadata
    let metadata: BundledDatabaseMetadata = {};
    try {
      const metadataInfo = await FileSystem.getInfoAsync(bundledMetadataPath);
      if (metadataInfo.exists) {
        const metadataContent = await FileSystem.readAsStringAsync(bundledMetadataPath);
        metadata = JSON.parse(metadataContent);

        // Safety check: Only use bundled database if language matches
        if (userLang && metadata.cardLang && userLang !== metadata.cardLang) {
          console.log(`Language mismatch: user wants ${userLang}, bundled is ${metadata.cardLang} - will download cards instead`);
          // Clear the database since it's the wrong language
          const tables = ['card', 'rule', 'taboo_set', 'faq_entry', 'encounter_set'];
          for (const table of tables) {
            await connection.query(`DELETE FROM ${table}`);
          }
          return null;
        }
      }
    } catch (metadataError) {
      console.warn('Error reading metadata:', metadataError);
    }

    // Return metadata (or empty object) to signal successful load
    return metadata;
  } catch (error) {
    console.error('Error copying bundled database:', error);
    // Return null so app continues with normal download flow
    return null;
  }
}
