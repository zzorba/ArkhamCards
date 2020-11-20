import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import useDebouncedEffect from 'use-debounced-effect-hook';
import { ngettext, msgid, t } from 'ttag';

import { Deck, EditDeckState, ParsedDeck } from '@actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useComponentVisible, useDeck, usePlayerCards } from '@components/core/hooks';
import { finishDeckEdit, startDeckEdit } from './actions';
import { CardsMap } from '@data/Card';
import { parseDeck } from '@lib/parseDeck';
import { AppState, makeDeckEditsSelector } from '@reducers';

export function useDeckXpStrings(parsedDeck?: ParsedDeck): [string | undefined, string | undefined] {
  return useMemo(() => {
    if (!parsedDeck) {
      return [undefined, undefined];
    }
    if (parsedDeck.deck.previous_deck) {
      const adjustedXp = parsedDeck.availableExperience;
      const unspent = adjustedXp - (parsedDeck.changes?.spentXp || 0);
      if (unspent === 0) {
        return [t`${adjustedXp} XP`, t`0 unspent`];
      }
      if (unspent < 0) {
        const overspent = Math.abs(unspent);
        return [t`${adjustedXp} XP`, t`${overspent} overspent`];
      }
      const unspentXpStr = unspent;
      return [t`${adjustedXp} XP`, ngettext(msgid`${unspentXpStr} unspent`, `${unspentXpStr} unspent`, unspent)];
    }
    const adjustedXp = parsedDeck.experience;
    return [t`${adjustedXp} XP`, undefined];
  }, [parsedDeck]);
}

export function useSimpleDeckEdits(id: number | undefined): EditDeckState | undefined {
  const deckEditsSelector = useMemo(makeDeckEditsSelector, []);
  return useSelector((state: AppState) => deckEditsSelector(state, id));
}

export function useDeckSlotCount(id: number, code: string): number {
  return useSelector((state: AppState) => {
    if (!state.deckEdits.editting || !state.deckEdits.editting[id] || !state.deckEdits.edits || !state.deckEdits.edits[id]) {
      return 0;
    }
    return state.deckEdits.edits[id]?.slots[code] || 0;
  });
}

export function useDeckEdits(id: number | undefined, initialize?: boolean): [EditDeckState | undefined, MutableRefObject<EditDeckState | undefined>] {
  const dispatch = useDispatch();
  useEffect(() => {
    if (initialize && id !== undefined) {
      dispatch(startDeckEdit(id));
      return function cleanup() {
        dispatch(finishDeckEdit(id));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deckEdits = useSimpleDeckEdits(id);
  const deckEditsRef = useRef<EditDeckState>();
  useEffect(() => {
    if (deckEdits) {
      deckEditsRef.current = deckEdits;
    }
  }, [deckEdits]);
  return [deckEdits, deckEditsRef];
}


interface ParsedDeckResults {
  deck?: Deck;
  cards?: CardsMap;
  previousDeck?: Deck;
  deckEdits?: EditDeckState;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  tabooSetId: number;
  visible: boolean;
  parsedDeck?: ParsedDeck;
}
export function useParsedDeck(id: number, componentName: string, componentId: string, fetchIfMissing?: boolean): ParsedDeckResults {
  const [deck, previousDeck] = useDeck(id, { fetchIfMissing });
  const [deckEdits, deckEditsRef] = useDeckEdits(id, fetchIfMissing);
  const tabooSetId = deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : (deck?.taboo_id || 0);
  const cards = usePlayerCards(tabooSetId);
  const visible = useComponentVisible(componentId);
  const [parsedDeck, setParsedDeck] = useState<ParsedDeck | undefined>();
  useDebouncedEffect(() => {
    if (cards && visible && deckEdits && deck) {
      setParsedDeck(
        parseDeck(
          deck,
          deckEdits.meta,
          deckEdits.slots,
          deckEdits.ignoreDeckLimitSlots,
          cards,
          previousDeck,
          deckEdits.xpAdjustment
        )
      );
    }
  }, [cards, deck, deckEdits, visible, previousDeck], 500);
  return {
    deck,
    cards,
    previousDeck,
    tabooSetId,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
  };
}