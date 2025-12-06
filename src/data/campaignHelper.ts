import { forEach, uniq, concat, flatMap, find } from 'lodash';
import { CampaignCycleCode, OZ } from '@actions/types';
import InvestigatorSet from './types/InvestigatorSet';
import { AGATHA_MYSTIC_CODE, AGATHA_SEEKER_CODE } from './deck/specialCards';

interface InvestigatorPrintingMap {
  [investigatorCode: string]: string | undefined;
}

interface DeckInvestigator {
  investigator: string;
  alternate_front?: string;
}

/**
 * Resolves campaign investigators to canonical codes, handling printings and parallel investigators.
 *
 * SPECIAL CASE: For Agatha Crane printings (AGATHA_MYSTIC_CODE/AGATHA_SEEKER_CODE),
 * if the specific printing appears in nonDeckInvestigators, we preserve that exact code
 * instead of resolving to canonical. This maintains the chosen Agatha version for the campaign.
 *
 * For OZ campaigns, parallel investigators are resolved using alternate_front from deck meta.
 * The investigatorPrintings map allows resolving printing codes back to canonical investigator codes.
 * The investigatorSets are used to find the canonical version of parallel investigators.
 *
 * @param cycleCode - Campaign cycle code (OZ requires special parallel handling)
 * @param investigatorPrintings - Map of canonical investigator code -> printing code
 * @param deckInvestigators - Array of deck investigators with optional alternate_front
 * @param nonDeckInvestigators - Array of investigator codes not associated with decks
 * @param investigatorSets - Array of InvestigatorSet objects from database (REQUIRED)
 * @returns Array of unique investigator codes (canonical or preserved special printings)
 */
export function resolveCampaignInvestigators(
  cycleCode: CampaignCycleCode | undefined,
  investigatorPrintings: InvestigatorPrintingMap,
  deckInvestigators: DeckInvestigator[],
  nonDeckInvestigators: string[],
  investigatorSets: InvestigatorSet[]
): string[] {
  const includeParallel = cycleCode === OZ;
  // Build reverse map: printing code -> canonical code
  const printingsByInvestigator: { [printingCode: string]: string } = {};
  forEach(investigatorPrintings, (printing, investigator) => {
    if (printing) {
      printingsByInvestigator[printing] = investigator;
    }
  });

  // Helper to find canonical investigator code from a set
  const findCanonicalCode = (code: string): string => {
    // Find the investigator set that contains this code
    const set = find(investigatorSets, s => s.code === code);
    if (!set) {
      return code;
    }

    // Get all codes in the set
    const canonical = set.canonicalCode();
    return canonical;
  };

  // Special case: Check if Agatha printings appear in nonDeckInvestigators
  const preserveAgathaCode = (code: string): boolean => {
    return (code === AGATHA_MYSTIC_CODE || code === AGATHA_SEEKER_CODE) &&
      nonDeckInvestigators.includes(code);
  };

  const resolvedCodes = concat(
    flatMap(deckInvestigators, (d) => {
      // For OZ campaigns with parallel investigators, use alternate_front
      const code = includeParallel
        ? (d.alternate_front ?? d.investigator)
        : d.investigator;

      // Special case: If this is an Agatha printing that appears in nonDeckInvestigators,
      // preserve the specific printing code
      if (preserveAgathaCode(code)) {
        return code;
      }

      // Resolve printing code to canonical code
      let resolved = printingsByInvestigator[code] ?? code;
      // Resolve parallel investigators to canonical using investigatorSet
      resolved = findCanonicalCode(resolved);
      return resolved;
    }),
    flatMap(nonDeckInvestigators, (code) => {
      // Special case: Preserve Agatha printings as-is
      if (code === AGATHA_MYSTIC_CODE || code === AGATHA_SEEKER_CODE) {
        return code;
      }

      // Resolve other non-deck investigators to canonical
      const resolved = findCanonicalCode(code);
      return resolved;
    }),
  );

  return uniq(resolvedCodes);
}
