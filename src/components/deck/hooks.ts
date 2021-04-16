import { MutableRefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useDebouncedEffect from 'use-debounced-effect-hook';
import { Platform } from 'react-native';
import { forEach, keys, range } from 'lodash';
import deepDiff from 'deep-diff';
import { ngettext, msgid, t } from 'ttag';
import { useDispatch, useSelector } from 'react-redux';

import { Deck, DeckId, EditDeckState, ParsedDeck, Slots } from '@actions/types';
import { useDeck } from '@data/hooks';
import { useComponentVisible, useDeckWithFetch, usePlayerCards } from '@components/core/hooks';
import { finishDeckEdit, startDeckEdit } from '@components/deck/actions';
import { CardsMap } from '@data/types/Card';
import { parseDeck } from '@lib/parseDeck';
import { AppState, makeDeckEditsSelector } from '@reducers';
import { DeckActions } from '@data/remote/decks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';

export function useDeckXpStrings(parsedDeck?: ParsedDeck, totalXp?: boolean): [string | undefined, string | undefined] {
  return useMemo(() => {
    if (!parsedDeck) {
      return [undefined, undefined];
    }
    if (parsedDeck.deck.previousDeckId) {
      const adjustedXp = totalXp ? parsedDeck.experience : parsedDeck.availableExperience;
      const unspent = parsedDeck.availableExperience - (parsedDeck.changes?.spentXp || 0);
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
  }, [parsedDeck, totalXp]);
}

export function useSimpleDeckEdits(id: DeckId | undefined): EditDeckState | undefined {
  const deckEditsSelector = useMemo(makeDeckEditsSelector, []);
  return useSelector((state: AppState) => deckEditsSelector(state, id));
}

export function useDeckSlotCount({ uuid }: DeckId, code: string): number {
  return useSelector((state: AppState) => {
    if (!state.deckEdits.editting || !state.deckEdits.editting[uuid] || !state.deckEdits.edits || !state.deckEdits.edits[uuid]) {
      return 0;
    }
    return state.deckEdits.edits[uuid]?.slots[code] || 0;
  });
}

export function useDeckEdits(
  id: DeckId | undefined,
  initialDeck?: LatestDeckT,
  initialMode?: 'edit' | 'upgrade'
): [EditDeckState | undefined, MutableRefObject<EditDeckState | undefined>] {
  const dispatch = useDispatch();
  const { user } = useContext(ArkhamCardsAuthContext);
  useEffect(() => {
    if (initialDeck && id !== undefined) {
      dispatch(startDeckEdit(id, initialDeck, initialMode));
      return function cleanup() {
        dispatch(finishDeckEdit(id));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDeck]);
  const otherDeckEdits: EditDeckState | undefined = useMemo(() => {
    if (user && initialDeck?.owner?.id && user.uid !== initialDeck.owner.id) {
      return {
        xpAdjustment: initialDeck.deck.xp_adjustment || 0,
        slots: initialDeck.deck.slots || {},
        ignoreDeckLimitSlots: initialDeck.deck.ignoreDeckLimitSlots || {},
        meta: initialDeck.deck.meta || {},
        mode: 'view',
        editable: false,
      };
    }
    return undefined;
  }, [user, initialDeck]);
  const reduxDeckEdits = useSimpleDeckEdits(id);
  const deckEditsRef = useRef<EditDeckState>();
  const deckEdits = otherDeckEdits || reduxDeckEdits;
  useEffect(() => {
    if (deckEdits) {
      deckEditsRef.current = deckEdits;
    }
  }, [deckEdits]);
  return [deckEdits, deckEditsRef];
}

export interface ParsedDeckResults {
  deck?: Deck;
  cards?: CardsMap;
  previousDeck?: Deck;
  deckEdits?: EditDeckState;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  tabooSetId: number;
  visible: boolean;
  parsedDeck?: ParsedDeck;
  mode: 'upgrade' | 'edit' | 'view';
}

function useParsedDeckHelper(
  id: DeckId,
  componentId: string,
  deck: LatestDeckT | undefined,
  {
    initialMode,
    fetchIfMissing,
  }: {
    fetchIfMissing?: boolean;
    initialMode?: 'upgrade' | 'edit';
  } = {}
): ParsedDeckResults {
  const [deckEdits, deckEditsRef] = useDeckEdits(id, fetchIfMissing ? deck : undefined, initialMode);
  const tabooSetId = deckEdits?.tabooSetChange !== undefined ? deckEdits.tabooSetChange : (deck?.deck.taboo_id || 0);
  const cards = usePlayerCards(tabooSetId);
  const visible = useComponentVisible(componentId);
  const [parsedDeck, setParsedDeck] = useState<ParsedDeck | undefined>((deck && cards && fetchIfMissing) ?
    parseDeck(deck.deck, deck.deck.meta || {}, deck.deck.slots || {}, deck.deck.ignoreDeckLimitSlots, cards, deck.previousDeck, deck.deck.xp_adjustment || 0) :
    undefined);
  useDebouncedEffect(() => {
    if (cards && visible && deckEdits && deck) {
      setParsedDeck(
        parseDeck(
          deck.deck,
          deckEdits.meta,
          deckEdits.slots,
          deckEdits.ignoreDeckLimitSlots,
          cards,
          deck.previousDeck,
          deckEdits.xpAdjustment
        )
      );
    }
  }, [cards, deck, deckEdits, visible], Platform.OS === 'ios' ? 200 : 500);
  return {
    deck: deck?.deck,
    cards,
    previousDeck: deck?.previousDeck,
    tabooSetId,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    mode: (deckEdits?.mode) || (initialMode || 'view'),
  };
}

export function useParsedDeckWithFetch(
  id: DeckId,
  componentId: string,
  actions: DeckActions,
  initialMode?: 'upgrade' | 'edit',
) {
  const deck = useDeckWithFetch(id, actions);
  return useParsedDeckHelper(id, componentId, deck, { initialMode, fetchIfMissing: true });
}

export function useParsedDeck(
  id: DeckId,
  componentId: string,
  initialMode?: 'upgrade' | 'edit'
): ParsedDeckResults {
  const deck = useDeck(id);
  return useParsedDeckHelper(id, componentId, deck, { initialMode });
}

export interface DeckEditState {
  slotDeltas: {
    removals: Slots;
    additions: Slots;
    ignoreDeckLimitChanged: boolean;
  };
  hasPendingEdits: boolean;
  addedBasicWeaknesses: string[];
  mode: 'edit' | 'upgrade' | 'view';
}

export function useDeckEditState({
  deck,
  visible,
  deckEdits,
  cards,
  mode,
}: ParsedDeckResults): DeckEditState {
  const [hasPendingEdits, setHasPendingEdits] = useState(false);
  const [slotDeltas, setSlotDeltas] = useState<{
    removals: Slots;
    additions: Slots;
    ignoreDeckLimitChanged: boolean
  }>({ removals: {}, additions: {}, ignoreDeckLimitChanged: false });

  useEffect(() => {
    if (!visible || !deck || !deckEdits) {
      return;
    }
    const slotDeltas: {
      removals: Slots;
      additions: Slots;
      ignoreDeckLimitChanged: boolean;
    } = {
      removals: {},
      additions: {},
      ignoreDeckLimitChanged: false,
    };
    forEach(deck.slots, (deckCount, code) => {
      const currentDeckCount = deckEdits.slots[code] || 0;
      if (deckCount > currentDeckCount) {
        slotDeltas.removals[code] = deckCount - currentDeckCount;
      }
    });
    forEach(deckEdits.slots, (currentCount, code) => {
      const ogDeckCount = deck.slots?.[code] || 0;
      if (ogDeckCount < currentCount) {
        slotDeltas.additions[code] = currentCount - ogDeckCount;
      }
      const ogIgnoreCount = ((deck.ignoreDeckLimitSlots || {})[code] || 0);
      if (ogIgnoreCount !== (deckEdits.ignoreDeckLimitSlots[code] || 0)) {
        slotDeltas.ignoreDeckLimitChanged = true;
      }
    });

    const originalTabooSet: number = (deck.taboo_id || 0);
    const metaChanges = deepDiff(deckEdits.meta, deck.meta || {});
    setHasPendingEdits(
      (deckEdits.nameChange && deck.name !== deckEdits.nameChange) ||
      (deckEdits.descriptionChange && deck.description_md !== deckEdits.descriptionChange) ||
      (deckEdits.tabooSetChange !== undefined && originalTabooSet !== deckEdits.tabooSetChange) ||
      (deck.previousDeckId && (deck.xp_adjustment || 0) !== deckEdits.xpAdjustment) ||
      keys(slotDeltas.removals).length > 0 ||
      keys(slotDeltas.additions).length > 0 ||
      slotDeltas.ignoreDeckLimitChanged ||
      (!!metaChanges && metaChanges.length > 0)
    );
    setSlotDeltas(slotDeltas);
  }, [deck, deckEdits, visible]);


  const addedBasicWeaknesses = useMemo(() => {
    if (!cards || !deck) {
      return [];
    }
    const addedWeaknesses: string[] = [];
    forEach(slotDeltas.additions, (addition, code) => {
      const card = cards[code];
      if (card && card.subtype_code === 'basicweakness') {
        forEach(range(0, addition), () => addedWeaknesses.push(code));
      }
    });
    return addedWeaknesses;
  }, [deck, cards, slotDeltas]);

  return {
    slotDeltas,
    addedBasicWeaknesses,
    hasPendingEdits,
    mode: hasPendingEdits && mode === 'view' ? 'edit' : mode,
  };
}