import { useEffect, useState } from 'react';
import { filter } from 'lodash';

import Card from '@data/types/Card';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { useContext } from 'react';

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
        const investigatorSetRepo = await db.investigatorSets();
        const investigatorSet = await investigatorSetRepo.findOne({
          where: { code: card.code },
        });

        if (canceled) return;

        if (!investigatorSet || investigatorSet.alternate_codes.length <= 1) {
          // No alternates found, or only one card in the set (itself)
          setAlternateCards([card]);
          setLoading(false);
          return;
        }

        // Fetch all the alternate cards
        const cardsRepo = await db.cards();
        const alternates = await cardsRepo
          .createQueryBuilder('c')
          .leftJoinAndSelect('c.linked_card', 'linked_card')
          .where('c.code IN (:...codes)', { codes: investigatorSet.alternate_codes })
          .andWhere('c.taboo_set_id IS NULL')
          .getMany();

        if (canceled) return;

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
