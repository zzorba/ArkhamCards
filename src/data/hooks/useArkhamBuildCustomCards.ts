import { useContext, useEffect, useRef } from 'react';
import { forEach } from 'lodash';

import DatabaseContext from '@data/sqlite/DatabaseContext';
import { Deck, isArkhamBuildDeck } from '@actions/types';
import { ensureArkhamBuildCustomCards } from '@data/arkhamBuildCards';

/**
 * Hook that ensures custom cards from an arkham.build deck's fan_made_content
 * metadata are inserted into the local database so they can be looked up
 * by code when rendering the deck.
 *
 * Should be called early in any component that displays an arkham.build deck.
 */
export default function useArkhamBuildCustomCards(deck: Deck | undefined): void {
  const { db } = useContext(DatabaseContext);
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!deck || !isArkhamBuildDeck(deck)) {
      return;
    }
    const meta = deck.meta;
    if (!meta) return;

    const fanMadeContent = typeof meta === 'string'
      ? (() => { try { return JSON.parse(meta).fan_made_content; } catch { return undefined; } })()
      : meta.fan_made_content;

    if (!fanMadeContent?.cards || Object.keys(fanMadeContent.cards).length === 0) {
      return;
    }

    // Avoid re-processing the same content
    const contentKey = Object.keys(fanMadeContent.cards).sort().join(',');
    if (processedRef.current.has(contentKey)) {
      return;
    }
    processedRef.current.add(contentKey);

    ensureArkhamBuildCustomCards(db, meta, deck.taboo_id || 0).catch(e => {
      console.log('[arkham.build] Failed to insert custom cards:', e);
    });
  }, [db, deck]);
}
