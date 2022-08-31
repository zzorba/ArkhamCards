import React, { MutableRefObject, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import useDebouncedEffect from 'use-debounced-effect-hook';
import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import { filter, find, forEach, keys, sortBy, range, uniq } from 'lodash';
import deepEqual from 'deep-equal';
import { ngettext, msgid, t } from 'ttag';
import { useDispatch, useSelector } from 'react-redux';

import { useAppDispatch } from '@app/store';
import { CampaignId, Customizations, Deck, DeckId, EditDeckState, ParsedDeck, Slots } from '@actions/types';
import { useDeck } from '@data/hooks';
import { useComponentVisible, useDeckWithFetch, usePlayerCardsFunc } from '@components/core/hooks';
import { finishDeckEdit, startDeckEdit, updateDeckCustomizationChoice } from '@components/deck/actions';
import { CardsMap } from '@data/types/Card';
import { parseCustomizations, parseDeck } from '@lib/parseDeck';
import { AppState, makeDeckEditsSelector } from '@reducers';
import { DeckActions } from '@data/remote/decks';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import { DrawWeaknessProps } from '@components/weakness/WeaknessDrawDialog';
import { ShowAlert } from './dialogs';
import COLORS from '@styles/colors';
import { CampaignDrawWeaknessProps } from '@components/campaign/CampaignDrawWeaknessDialog';
import useSingleCard from '@components/card/useSingleCard';
import { CustomizationChoice } from '@data/types/CustomizationOption';
import { useCardMap } from '@components/card/useCardList';
import LanguageContext from '@lib/i18n/LanguageContext';

export function useDeckXpStrings(parsedDeck?: ParsedDeck, totalXp?: boolean): [string | undefined, string | undefined] {
  return useMemo(() => {
    if (!parsedDeck) {
      return [undefined, undefined];
    }
    if (parsedDeck.deck?.previousDeckId) {
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

export function useLiveCustomizations(deck: LatestDeckT | undefined, deckEdits: EditDeckState | undefined): Customizations | undefined {
  const slots = deckEdits?.slots;
  const codes = useMemo(() => slots ? keys(slots) : [], [slots]);
  const [cards] = useCardMap(codes, 'player');
  const meta = deckEdits?.meta;
  const previousMeta = deck?.previousDeck?.meta;
  return useMemo(() => {
    return (meta && slots && cards) ? parseCustomizations(meta, slots, cards, previousMeta)[0] : undefined;
  }, [meta, slots, previousMeta, cards])
}

export function useDeckSlotCount({ uuid }: DeckId, code: string, side?: boolean): number {
  return useSelector((state: AppState) => {
    if (!state.deckEdits.editting || !state.deckEdits.editting[uuid] || !state.deckEdits.edits || !state.deckEdits.edits[uuid]) {
      return 0;
    }
    if (side) {
      return state.deckEdits.edits[uuid]?.side[code] || 0;
    }
    return state.deckEdits.edits[uuid]?.slots[code] || 0;
  });
}

export function useDeckEdits(
  id: DeckId | undefined,
  initialDeck?: LatestDeckT,
  initialMode?: 'edit' | 'upgrade'
): [EditDeckState | undefined, MutableRefObject<EditDeckState | undefined>] {
  const dispatch = useAppDispatch();
  const { userId } = useContext(ArkhamCardsAuthContext);
  const [mode, setMode] = useState(initialMode);
  useEffect(() => {
    if (initialDeck && id !== undefined) {
      const editable = (!initialDeck.owner?.id || !userId || initialDeck.owner.id === userId);
      dispatch(startDeckEdit(id, initialDeck, editable, mode));
      setMode(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDeck, id]);
  useEffect(() => {
    if (initialDeck && id !== undefined) {
      return () => {
        dispatch(finishDeckEdit(id));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const otherDeckEdits: EditDeckState | undefined = useMemo(() => {
    if (userId && initialDeck?.owner?.id && userId !== initialDeck.owner.id) {
      return {
        xpAdjustment: initialDeck.deck.xp_adjustment || 0,
        slots: initialDeck.deck.slots || {},
        ignoreDeckLimitSlots: initialDeck.deck.ignoreDeckLimitSlots || {},
        meta: initialDeck.deck.meta || {},
        side: initialDeck.deck.sideSlots || {},
        mode: 'view',
        editable: false,
      };
    }
    return undefined;
  }, [userId, initialDeck]);
  const reduxDeckEdits = useSimpleDeckEdits(id);
  const deckEditsRef = useRef<EditDeckState>();
  const deckEdits = otherDeckEdits || reduxDeckEdits;
  deckEditsRef.current = deckEdits;
  return [deckEdits, deckEditsRef];
}

export interface ParsedDeckResults {
  deck?: Deck;
  deckT?: LatestDeckT;
  cards?: CardsMap;
  previousDeck?: Deck;
  deckEdits?: EditDeckState;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  tabooSetId: number;
  visible: boolean;
  editable: boolean;
  parsedDeck?: ParsedDeck;
  parsedDeckRef: MutableRefObject<ParsedDeck | undefined>;
  mode: 'upgrade' | 'edit' | 'view';
  cardsMissing: boolean;
}

function useParsedDeckHelper(
  id: DeckId | undefined,
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
  const [cards, cardsLoading, cardsMissing] = usePlayerCardsFunc(() => {
    return uniq([
      ...(deck ? [deck.investigator] : []),
      ...keys(deckEdits?.side),
      ...keys(deckEdits?.slots),
      ...keys(deckEdits?.ignoreDeckLimitSlots),
      ...(deckEdits?.meta.alternate_back ? [deckEdits.meta.alternate_back] : []),
      ...(deckEdits?.meta.alternate_front ? [deckEdits.meta.alternate_front] : []),
      ...keys(deck?.previousDeck?.slots || {}),
      ...keys(deck?.previousDeck?.ignoreDeckLimitSlots || {}),
    ]);
  }, [deckEdits, deck], tabooSetId);
  const visible = useComponentVisible(componentId);
  const initialized = useRef(false);
  const [parsedDeck, setParsedDeck] = useState<ParsedDeck | undefined>(undefined);
  const parsedDeckRef = useRef<ParsedDeck | undefined>(parsedDeck);
  const { listSeperator } = useContext(LanguageContext);
  useEffect(() => {
    if (deck && cards && fetchIfMissing && !parsedDeck && !initialized.current) {
      initialized.current = true;
      const pd = parseDeck(
        deck.deck.investigator_code,
        deck.deck.meta || {},
        deck.deck.slots || {},
        deck.deck.ignoreDeckLimitSlots,
        deck.deck.sideSlots || {},
        cards,
        listSeperator,
        deck.previousDeck,
        deck.deck.xp_adjustment || 0,
        deck.deck
      );
      parsedDeckRef.current = pd;
      setParsedDeck(pd);
    }
  }, [deck, cards, fetchIfMissing, listSeperator, parsedDeck]);
  useDebouncedEffect(() => {
    if (cards && visible && deckEdits && deck) {
      const pd = parseDeck(
        deck.deck.investigator_code,
        deckEdits.meta,
        deckEdits.slots,
        deckEdits.ignoreDeckLimitSlots,
        deckEdits.side,
        cards,
        listSeperator,
        deck.previousDeck,
        deckEdits.xpAdjustment,
        deck.deck
      );
      parsedDeckRef.current = pd;
      setParsedDeck(pd);
    }
  }, [cards, deck, listSeperator, deckEdits, visible], Platform.OS === 'ios' ? 200 : 500);
  return {
    deck: deck?.deck,
    deckT: deck,
    cards,
    previousDeck: deck?.previousDeck,
    tabooSetId,
    deckEdits,
    deckEditsRef,
    visible,
    parsedDeck,
    parsedDeckRef,
    editable: !!deckEdits?.editable,
    mode: (deckEdits?.mode) || (initialMode || 'view'),
    cardsMissing: !cardsLoading && cardsMissing,
  };
}

export function useParsedDeckWithFetch(
  id: DeckId,
  componentId: string,
  actions: DeckActions,
  initialMode?: 'upgrade' | 'edit',
): ParsedDeckResults {
  const deck = useDeckWithFetch(id, actions);
  return useParsedDeckHelper(id, componentId, deck, { initialMode, fetchIfMissing: true });
}

export function useParsedDeck(
  id: DeckId | undefined,
  componentId: string,
  initialMode?: 'upgrade' | 'edit'
): ParsedDeckResults {
  const deck = useDeck(id);
  return useParsedDeckHelper(id, componentId, deck, { initialMode });
}

interface UpdateCustomizationAction {
  code: string;
  choice: CustomizationChoice;
}
export function useCardCustomizations(
  deckId: DeckId | undefined,
  initialCustomizations: Customizations | undefined
): [Customizations, (code: string, choice: CustomizationChoice) => void] {
  const dispatch = useAppDispatch();
  const [, deckEditsRef] = useDeckEdits(deckId);
  const [customizations, updateCustomizations] = useReducer<React.Reducer<Customizations, UpdateCustomizationAction>>((state: Customizations, action: UpdateCustomizationAction) => {
    const { code, choice } = action;
    const updated: Customizations = { ...state };
    updated[code] = sortBy([
      ...filter(state[code] || [], c => c.option.index !== choice.option.index),
      {
        ...choice,
        xp_locked: find(state[code] || [], c => c.option.index === choice.option.index)?.xp_locked || 0,
      },
    ], c => c.option.index);
    return updated;
  }, initialCustomizations || {});

  const setChoice = useCallback((code: string, choice: CustomizationChoice) => {
    updateCustomizations({ code, choice });
    if (deckEditsRef.current && deckId) {
      const decision = {
        index: choice.option.index,
        spent_xp: choice.xp_spent,
        choice: choice.choice,
      };
      dispatch(updateDeckCustomizationChoice(deckId, deckEditsRef.current, code, decision));
    }
  }, [dispatch, deckId, deckEditsRef, updateCustomizations]);
  return [customizations, setChoice];
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
    ignoreDeckLimitChanged: boolean;
    sideChanged: boolean;
  }>({ removals: {}, additions: {}, ignoreDeckLimitChanged: false, sideChanged: false });

  useEffect(() => {
    if (!visible || !deck || !deckEdits) {
      return;
    }
    const slotDeltas: {
      removals: Slots;
      additions: Slots;
      ignoreDeckLimitChanged: boolean;
      sideChanged: boolean;
    } = {
      removals: {},
      additions: {},
      ignoreDeckLimitChanged: false,
      sideChanged: !!find(uniq([...keys(deck.sideSlots || {}), ...keys(deckEdits.side)]), code => {
        return (deck.sideSlots?.[code] || 0) !== (deckEdits.side[code] || 0);
      }),
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
    const metaChanged = !deepEqual(deckEdits.meta, deck.meta || {});
    setHasPendingEdits(
      (deckEdits.nameChange && deck.name !== deckEdits.nameChange) ||
      (deckEdits.descriptionChange && deck.description_md !== deckEdits.descriptionChange) ||
      (deckEdits.tabooSetChange !== undefined && originalTabooSet !== deckEdits.tabooSetChange) ||
      (deck.previousDeckId && (deck.xp_adjustment || 0) !== deckEdits.xpAdjustment) ||
      keys(slotDeltas.removals).length > 0 ||
      keys(slotDeltas.additions).length > 0 ||
      slotDeltas.ignoreDeckLimitChanged ||
      slotDeltas.sideChanged ||
      metaChanged
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

export function useShowDrawWeakness({ componentId, id, campaignId, deck, showAlert, deckEditsRef, assignedWeaknesses }: {
  componentId: string;
  id: DeckId;
  showAlert: ShowAlert;
  deck: LatestDeckT | undefined;
  campaignId?: CampaignId;
  deckEditsRef: MutableRefObject<EditDeckState | undefined>;
  assignedWeaknesses?: string[];
}): (alwaysReplaceRandomBasicWeakness?: boolean) => void {
  const { colors } = useContext(StyleContext);
  const [investigator] = useSingleCard(deck?.investigator, 'player', deck?.deck.taboo_id || 0);
  const [unsavedAssignedWeaknesses, setUnsavedAssignedWeaknesses] = useState<string[]>(assignedWeaknesses || []);
  const dispatch = useDispatch();
  const saveWeakness = useCallback((code: string, replaceRandomBasicWeakness: boolean) => {
    if (!deckEditsRef.current) {
      return;
    }
    if (replaceRandomBasicWeakness && deckEditsRef.current.slots[RANDOM_BASIC_WEAKNESS] > 0) {
      dispatch({ type: 'UPDATE_DECK_EDIT_COUNTS', countType: 'slots', operation: 'dec', id, code: RANDOM_BASIC_WEAKNESS });
    }
    dispatch({ type: 'UPDATE_DECK_EDIT_COUNTS', countType: 'slots', operation: 'inc', id, code });
    setUnsavedAssignedWeaknesses([...unsavedAssignedWeaknesses, code]);
  }, [unsavedAssignedWeaknesses, id, deckEditsRef, dispatch, setUnsavedAssignedWeaknesses]);

  const editCollection = useCallback(() => {
    Navigation.push(componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  }, [componentId]);

  const showWeaknessDialog = useCallback((alwaysReplaceRandomBasicWeakness?: boolean) => {
    if (!deckEditsRef.current) {
      return;
    }
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<DrawWeaknessProps>(componentId, {
      component: {
        name: 'Weakness.Draw',
        passProps: {
          investigator,
          slots: deckEditsRef.current.slots,
          saveWeakness,
          alwaysReplaceRandomBasicWeakness,
        },
        options: {
          statusBar: {
            style: 'light',
            backgroundColor,
          },
          topBar: {
            title: {
              text: t`Draw Weaknesses`,
              color: COLORS.white,
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, investigator, colors, deckEditsRef, saveWeakness]);
  const drawWeakness = useCallback((alwaysReplaceRandomBasicWeakness?: boolean) => {
    showAlert(
      t`Draw Basic Weakness`,
      t`This deck does not seem to be part of a campaign yet.\n\nIf you add this deck to a campaign, the app can keep track of the available weaknesses between multiple decks.\n\nOtherwise, you can draw random weaknesses from your entire collection.`,
      [
        { text: t`Draw From Collection`, icon: 'draw', style: 'default', onPress: () => showWeaknessDialog(alwaysReplaceRandomBasicWeakness) },
        { text: t`Edit Collection`, icon: 'edit', onPress: editCollection },
        { text: t`Cancel`, style: 'cancel' },
      ]);
  }, [showWeaknessDialog, editCollection, showAlert]);

  const showCampaignWeaknessDialog = useCallback((alwaysReplaceRandomBasicWeakness?: boolean) => {
    if (!campaignId || !deckEditsRef.current) {
      return;
    }
    const backgroundColor = colors.faction[investigator ? investigator.factionCode() : 'neutral'].background;
    Navigation.push<CampaignDrawWeaknessProps>(componentId, {
      component: {
        name: 'Dialog.CampaignDrawWeakness',
        passProps: {
          campaignId,
          deckSlots: deckEditsRef.current.slots,
          saveWeakness,
          unsavedAssignedCards: unsavedAssignedWeaknesses,
          alwaysReplaceRandomBasicWeakness,
        },
        options: {
          statusBar: {
            style: 'light',
          },
          topBar: {
            title: {
              text: t`Draw Weaknesses`,
              color: COLORS.white,
            },
            backButton: {
              title: t`Back`,
              color: 'white',
            },
            background: {
              color: backgroundColor,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, investigator, colors, deckEditsRef, unsavedAssignedWeaknesses, saveWeakness]);

  return campaignId ? showCampaignWeaknessDialog : drawWeakness;
}