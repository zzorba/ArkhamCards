import { forEach, groupBy, map, filter } from 'lodash';

import Card from '../types/Card';
import InvestigatorSet from '../types/InvestigatorSet';
import Database from './Database';

/**
 * Compute investigator set relationships from cards.
 * Groups investigators by real_name and creates InvestigatorSet entries
 * for each code, containing all related codes.
 *
 * @param cards Array of all cards to process (will filter to investigators)
 * @returns Array of InvestigatorSet entries (one per investigator code)
 */
function computeInvestigatorSets(cards: Card[]): InvestigatorSet[] {
  const investigatorSets: InvestigatorSet[] = [];

  // Filter to investigator cards only (including parallel/alternate)
  const investigators = filter(
    cards,
    card => card.type_code === 'investigator' && !card.taboo_set_id
  );

  // Group investigators by real_name
  const groupedByName = groupBy(investigators, card => card.real_name);

  // For each group, create an entry for each code
  forEach(groupedByName, (cardsInGroup) => {
    const allCodes = map(cardsInGroup, card => card.code);

    // Create one InvestigatorSet entry per code in the group
    forEach(allCodes, code => {
      investigatorSets.push(InvestigatorSet.create(code, allCodes));
    });
  });

  return investigatorSets;
}

/**
 * Sync investigator sets to the database.
 * Computes relationships from provided cards and updates the investigator_set table.
 *
 * @param db Database instance
 * @param cards Optional array of cards (if not provided, will fetch from db)
 * @returns Promise that resolves when sync is complete
 */
export default async function syncInvestigatorSets(
  db: Database,
  cards: Card[]
): Promise<void> {
  try {
    // Compute investigator sets from all cards
    const investigatorSets = computeInvestigatorSets(cards);

    // Get repository and clear existing data
    const connection = await db.connectionP;
    const investigatorSetRepo = connection.getRepository(InvestigatorSet);

    // Clear and repopulate (simpler than trying to diff)
    await investigatorSetRepo.clear();

    // Insert all investigator sets
    if (investigatorSets.length > 0) {
      await investigatorSetRepo.insert(investigatorSets);
    }

    console.log(`Synced ${investigatorSets.length} investigator set entries`);
  } catch (e) {
    console.log(`Error syncing investigator sets: ${e}`);
  }
}
