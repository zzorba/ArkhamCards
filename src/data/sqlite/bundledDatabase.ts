import * as FileSystem from 'expo-file-system/legacy';
import { CardCache } from '@actions/types';
import { Connection } from 'typeorm/browser';

const DB_NAME = 'arkham4';

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
 * 2. Place arkham4.db and arkham4.metadata.json in assets/generated/
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
    // Get the target path where op-sqlite will look for the database
    // op-sqlite uses Library/default for the default location
    const dbDirectory = `${FileSystem.documentDirectory}../Library/default`;
    const dbPath = `${dbDirectory}/${DB_NAME}`;

    // Check if database already exists in the app directory
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (dbInfo.exists) {
      return null;
    }

    // Check if bundled database exists in the app bundle
    // Expo flattens assets to the bundle root directory
    const bundledDbPath = `${FileSystem.bundleDirectory}arkham4.db`;
    const bundledMetadataPath = `${FileSystem.bundleDirectory}arkham4.metadata.json`;

    const bundledDbInfo = await FileSystem.getInfoAsync(bundledDbPath);

    if (!bundledDbInfo.exists) {
      return null;
    }

    // Use SQLite ATTACH DATABASE to attach the bundled database
    // Then copy all data from it
    try {
      // Attach the bundled database
      await connection.query(`ATTACH DATABASE '${bundledDbPath}' AS bundled`);

      // Copy all tables from bundled to main database
      const tables = ['card', 'rule', 'taboo_set', 'faq_entry', 'encounter_set'];

      for (const table of tables) {
        await connection.query(`INSERT INTO ${table} SELECT * FROM bundled.${table}`);
      }

      // Detach the bundled database
      await connection.query(`DETACH DATABASE bundled`);
    } catch (attachError) {
      console.error('Failed to load bundled database:', attachError);
      try {
        await connection.query(`DETACH DATABASE bundled`);
      } catch (e) {
        // Already detached or never attached
      }
      return null;
    }

    // Try to load metadata
    try {
      const metadataInfo = await FileSystem.getInfoAsync(bundledMetadataPath);
      if (metadataInfo.exists) {
        const metadataContent = await FileSystem.readAsStringAsync(bundledMetadataPath);
        const metadata: BundledDatabaseMetadata = JSON.parse(metadataContent);

        // Safety check: Only use bundled database if language matches
        if (userLang && metadata.cardLang && userLang !== metadata.cardLang) {
          console.log(`Language mismatch: user wants ${userLang}, bundled is ${metadata.cardLang} - will download cards instead`);
          // Delete the copied database since it's the wrong language
          await FileSystem.deleteAsync(dbPath);
          return null;
        }

        return metadata;
      }
    } catch (metadataError) {
      console.warn('No metadata found for bundled database:', metadataError);
    }

    return null;
  } catch (error) {
    console.error('Error copying bundled database:', error);
    // Return null so app continues with normal download flow
    return null;
  }
}
