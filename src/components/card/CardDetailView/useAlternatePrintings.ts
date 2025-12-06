import { useContext, useEffect, useState } from 'react';

import Card from '@data/types/Card';
import DatabaseContext from '@data/sqlite/DatabaseContext';

/**
 * Hook to fetch alternate printings of an investigator card.
 * Returns all cards that share the same real_name.
 */
export function useAlternatePrintings(card: Card | undefined): [Card[], boolean] {
  const { db } = useContext(DatabaseContext);
  const [alternateCards, setAlternateCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let canceled = false;

    async function fetchAlternates() {
      if (!card || card.type_code !== 'investigator') {
        setAlternateCards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // First, fetch the investigator set to get all related codes
        const investigatorSet = await db.getInvestigatorSet(card.code);

        if (canceled) {
          return;
        }

        if (!investigatorSet || investigatorSet.alternate_codes.length <= 1) {
          // No alternates found, or only one card in the set (itself)
          setAlternateCards([card]);
          setLoading(false);
          return;
        }

        // Fetch all the alternate cards
        const alternates = await db.getCardsByCodes(investigatorSet.alternate_codes)

        if (canceled) {
          return;
        }

        setAlternateCards(alternates);
        setLoading(false);
      } catch (e) {
        console.log('Error fetching alternate printings:', e);
        if (!canceled) {
          setAlternateCards([]);
          setLoading(false);
        }
      }
    }

    fetchAlternates();

    return () => {
      canceled = true;
    };
  }, [db, card]);

  return [alternateCards, loading];
}
