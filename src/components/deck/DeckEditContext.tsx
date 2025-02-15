import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ParsedDeckResults, useSimpleDeckEdits } from './hooks';
import { AttachableDefinition, ChecklistSlots, Customizations, Deck, DeckId, EditDeckState, Slots } from '@actions/types';
import { parseMetaSlots } from '@lib/parseDeck';
import { EditSlotsActions, useEffectUpdate } from '@components/core/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { decDeckSlot, incDeckSlot, setDeckAttachmentSlot, setDeckChecklistCard, setDeckSlot, updateDeckCustomizationChoice } from './actions';
import { CustomizationChoice } from '@data/types/CustomizationOption';
import { useAppDispatch } from '@app/store';
import { filter, find, flatMap, forEach, pickBy, sortBy } from 'lodash';
import { AppState, getDeckChecklist } from '@reducers/index';
import Card from '@data/types/Card';
import { useAttachableCards } from './useParsedDeckComponent';

export type DeckEditContextType = {
  deckId: DeckId | undefined;
  deckEdits: EditDeckState | undefined;
  extraDeckSlots: Slots | undefined;
  checklist: ChecklistSlots | undefined;
  attachmentCounts: {
    [card: string]: {
      [attachable: string]: number | undefined;
    } | undefined;
  } | undefined;
  attachmentSlots: {
    [attachable: string]: Slots | undefined;
  } | undefined;
  deckAttachments: AttachableDefinition[];
}

export const DeckEditContext = React.createContext<DeckEditContextType>({
  deckId: undefined,
  deckEdits: undefined,
  extraDeckSlots: undefined,
  checklist: undefined,
  attachmentCounts: undefined,
  attachmentSlots: undefined,
  deckAttachments: [],
});

type ParsedDeckContextType = {
  deck?: Deck;
  lockedPermanents?: Slots;
};
export const ParsedDeckContext = React.createContext<ParsedDeckContextType>({});

export function SimpleDeckEditContextProvider({ children, deckId, investigator }: {
  deckId: DeckId | undefined;
  investigator: string | undefined;
  children: React.ReactNode;
}) {
  const deckEdits = useSimpleDeckEdits(deckId);
  return (
    <DeckEditContextProvider deckEdits={deckEdits} deckId={deckId} investigator={investigator}>
      {children}
    </DeckEditContextProvider>
  );
}

export function DeckEditContextProvider({ children, deckEdits, deckId, investigator }: {
  investigator: string | undefined;
  children: React.ReactNode;
  deckEdits: EditDeckState | undefined;
  deckId: DeckId | undefined;
}) {
  const meta = deckEdits?.meta;
  const slots = deckEdits?.slots;
  const extraDeck = meta?.extra_deck;
  const attachableCards = useAttachableCards();
  const deckAttachments = useMemo(() => {
    return filter(Object.values(attachableCards), attachment => {
      return attachment.code === investigator || !!slots?.[attachment.code];
    });
  }, [attachableCards, investigator, slots]);
  const [attachments, customizables] = useMemo(() => (
    [
      pickBy(meta, (_, key) => key.startsWith('attachment_')),
      pickBy(meta, (_, key) => key.startsWith('cus_')),
    ]
  ), [meta]);
  const [attachmentCounts, attachmentSlots] = useMemo(() => {
    const counts: {
      [code: string] : {
        [attachable: string]: number | undefined;
      } | undefined;
    } = {};
    const attachmentSlots: { [attachable: string]: Slots | undefined } = {};
    forEach(
      Object.keys(attachments),
      attachable => {
        const slots = parseMetaSlots(attachments[attachable]);
        attachmentSlots[attachable] = slots;
        forEach(
          Object.keys(slots),
          code => {
            if (!counts[code]) {
              counts[code] = {
                [attachable]: slots[code],
              };
            } else {
              counts[code]![attachable] = slots[code];
            }
          }
        );
      }
    );
    return [counts, attachmentSlots];
  }, [attachments])

  const extraDeckSlots = useMemo(() => extraDeck ? parseMetaSlots(extraDeck) : undefined , [extraDeck]);
  const checklist = useSelector((state: AppState) => deckId ? getDeckChecklist(state, deckId) : undefined);
  const context = useMemo(() => ({
    deckEdits,
    deckId,
    extraDeckSlots,
    checklist,
    attachmentCounts,
    attachmentSlots,
    deckAttachments,
  }), [deckId, deckEdits, extraDeckSlots, checklist, attachmentCounts, attachmentSlots, deckAttachments]);
  return (
    <DeckEditContext.Provider value={context}>
      {children}
    </DeckEditContext.Provider>
  );
}

export function useEligibleAttachments(card: Card, attachmentOverride?: AttachableDefinition) {
  const { deckAttachments } = useContext(DeckEditContext);
  return useMemo(() => (
    attachmentOverride ? [attachmentOverride] :
      deckAttachments.filter(attachment =>
        (attachment.requiredCards?.[card.code] ?? 0) > 0 ||
        !!attachment.traits?.find(trait => card.real_traits_normalized?.indexOf(`#${trait}#`) !== -1)
      )
  ), [deckAttachments, attachmentOverride, card]);
}

export function ParsedDeckContextProvider({ children, parsedDeckObj }: {
  children: React.ReactNode;
  parsedDeckObj: ParsedDeckResults;
}) {
  const { id: deckId, deckEdits, parsedDeck, deck } = parsedDeckObj;
  const lockedPermanents = parsedDeck?.lockedPermanents;

  return (
    <ParsedDeckContext.Provider value={{ lockedPermanents, deck }}>
      <DeckEditContextProvider
        deckId={deckId}
        deckEdits={deckEdits}
        investigator={parsedDeck?.deck?.investigator_code}
      >
        {children}
      </DeckEditContextProvider>
    </ParsedDeckContext.Provider>
  );
}

export function useTabooSetOverride() {
  const { deckEdits } = useContext(DeckEditContext);
  const { deck } = useContext(ParsedDeckContext);
  return deckEdits?.tabooSetChange ?? deck?.taboo_id ?? 0;
}

export function useDeckDeltas(specialMode?: 'side' | 'extra' | 'checklist'):
{
  deckCardCounts: Slots | undefined;
  originalDeckSlots: Slots | undefined;
  mode: 'side' | 'extra' | undefined;
} {
  const { deckEdits, extraDeckSlots } = useContext(DeckEditContext);
  const { deck } = useContext(ParsedDeckContext);

  switch(specialMode) {
    case 'side':
      return {
        deckCardCounts: deckEdits?.side,
        originalDeckSlots: deck?.sideSlots,
        mode: 'side',
      };
    case 'extra':
      return {
        deckCardCounts: extraDeckSlots,
        originalDeckSlots: parseMetaSlots(deck?.meta?.extra_deck),
        mode: 'extra',
      };
    default:
      return {
        deckCardCounts: deckEdits?.slots,
        originalDeckSlots: deck?.slots,
        mode: undefined,
      };
  }
}

const EMPTY_SLOTS: Slots = {};

export function useDeckAttachmentSlots(
  attachment: AttachableDefinition | undefined,
): Slots {
  const { attachmentSlots } = useContext(DeckEditContext);
  return (attachment ? attachmentSlots?.[attachment.code] : undefined) ?? EMPTY_SLOTS;
}


export function useDeckAttachmentCount(
  code: string,
  attachment: AttachableDefinition,
): { attachCount: number; forceLocked: boolean; onPress: () => void } {
  const { deckEdits, deckId, attachmentCounts } = useContext(DeckEditContext);
  const required = attachment.requiredCards?.[code];
  const attachCount = attachmentCounts?.[code]?.[attachment.code] ?? 0;
  const dispatch = useDispatch();
  const onPress = useCallback(() => {
    const newCount = attachCount + 1 > (attachment.limit ?? attachCount) || (attachCount + 1) > (attachCount) ?
      0 : attachCount + 1;
    if (deckId) {
      dispatch(setDeckAttachmentSlot(deckId, code, newCount, attachment.code));
    }
  }, [attachment, attachCount, deckId, code, dispatch]);
  if (required) {
    return { attachCount: required, forceLocked: true, onPress };
  }
  if (!deckEdits?.editable) {
    return { attachCount, forceLocked: true, onPress };
  }
  return { attachCount, forceLocked: false, onPress };
}


interface UpdateCustomizationAction {
  code: string;
  choice: CustomizationChoice;
}
export function useAllCardCustomizations(
  initialCustomizations: Customizations | undefined
): [Customizations, (code: string, choice: CustomizationChoice) => void] {
  const dispatch = useAppDispatch();
  const { deckEdits, deckId } = useContext(DeckEditContext);
  const [customizations, updateCustomizations] = useReducer<
    React.Reducer<Customizations, UpdateCustomizationAction>
  >((state: Customizations, action: UpdateCustomizationAction) => {
    const { code, choice } = action;
    const updated: Customizations = { ...state };
    updated[code] = sortBy(
      [
        ...filter(
          state[code] || [],
          (c) => c.option.index !== choice.option.index
        ),
        {
          ...choice,
          xp_locked:
            find(
              state[code] || [],
              (c) => c.option.index === choice.option.index
            )?.xp_locked || 0,
        },
      ],
      (c) => c.option.index
    );
    return updated;
  }, initialCustomizations || {});
  const deckEditsRef = useRef<EditDeckState | undefined>(deckEdits);
  useEffect(() => {
    deckEditsRef.current = deckEdits;
  }, [deckEdits]);

  const setChoice = useCallback(
    (code: string, choice: CustomizationChoice) => {
      updateCustomizations({ code, choice });
      if (deckEditsRef.current && deckId) {
        const decision = {
          index: choice.option.index,
          spent_xp: choice.xp_spent,
          choice: choice.type ? choice.encodedChoice : undefined,
        };
        dispatch(
          updateDeckCustomizationChoice(
            deckId,
            deckEditsRef.current,
            code,
            decision
          )
        );
      }
    },
    [dispatch, deckId, updateCustomizations]
  );
  return [customizations, setChoice];
}

const NO_CUSTOMIZATIONS: CustomizationChoice[] = [];
export function useCardCustomizations(card: Card | undefined, deckCount: number | undefined, customizations: Customizations): CustomizationChoice[] | undefined {
  const { deckId } = useContext(DeckEditContext);
  const customizationChoices: CustomizationChoice[] | undefined = useMemo(() => {
    if (card && deckId) {
      if (deckCount) {
        if (customizations[card.code]) {
          return customizations[card.code];
        }
        return flatMap(card.customization_options, (option, idx) => {
          if (option.xp === 0) {
            return card.customizationChoice(idx, 0, undefined, undefined) || [];
          }
          return [];
        })
      }
      return NO_CUSTOMIZATIONS;
    }
    return undefined;
  }, [deckId, customizations, card, deckCount]);
  return customizationChoices;
}


export function useDeckSlotCount(
  code: string,
  mode?: 'side' | 'extra' | 'ignore'
): [number, number] {
  const { deckEdits, extraDeckSlots } = useContext(DeckEditContext);
  switch (mode) {
    case 'side':
      return [deckEdits?.side[code] ?? 0, 0];
    case 'extra':
      return [extraDeckSlots?.[code] ?? 0, 0];
    case 'ignore':
      return [deckEdits?.ignoreDeckLimitSlots?.[code] ?? 0, 0];
    default:
      return [deckEdits?.slots[code] ?? 0, deckEdits?.ignoreDeckLimitSlots[code] ?? 0];
  }
}

export function useMutableDeckSlotCount(code: string, limit: number, mode?: 'side' | 'extra' | 'ignore'): {
  count: number;
  ignoreCount: number;
  countChanged: EditSlotsActions;
  onSidePress: () => void;
} {
  const { deckId } = useContext(DeckEditContext);
  const [actualCount, ignoreCount] = useDeckSlotCount(code, mode);
  const [count, setCount] = useState(actualCount);
  useEffectUpdate(() => {
    setCount(actualCount)
  }, [setCount, actualCount]);
  const dispatch = useDispatch();
  const countChanged: EditSlotsActions = useMemo(() => {
    return {
      setSlot: (code: string, count: number) => {
        setCount(count);
        if (deckId) {
          setTimeout(() => dispatch(setDeckSlot(deckId, code, count, mode)), 20);
        }
      },
      incSlot: (code: string) => {
        setCount((currentCount) => Math.min(limit, currentCount + 1));
        if (deckId) {
          setTimeout(() => dispatch(incDeckSlot(deckId, code, limit, mode)), 20);
        }
      },
      decSlot: (code: string) => {
        setCount((currentCount) => Math.max(0, currentCount - 1));
        if (deckId) {
          setTimeout(() => dispatch(decDeckSlot(deckId, code, mode)), 20);
        }
      },
    };
  }, [dispatch, deckId, limit, mode, setCount]);
  const onSidePress = useCallback(() => {
    setCount((currentCount) => Math.max(0, currentCount - 1));
    if (deckId) {
      setTimeout(() => {
        dispatch(decDeckSlot(deckId, code, 'side'));
        dispatch(incDeckSlot(deckId, code, limit, undefined));
      }, 20);
    }
  }, [dispatch, deckId, code, limit]);
  return {
    count,
    ignoreCount,
    countChanged,
    onSidePress,
  };
}

const EMPTY_CHECKLIST: number[] = []
export function useChecklistCount(code: string): {
  checklist: number[];
  toggleValue: (value: number, toggle: boolean) => void;
} {
  const { checklist, deckId } = useContext(DeckEditContext);
  const dispatch = useDispatch();
  const toggleValue = useCallback((value: number, toggle: boolean) => {
    if (deckId) {
      dispatch(setDeckChecklistCard(deckId, code, value, toggle));
    }
  }, [dispatch, deckId, code]);

  return {
    checklist: checklist?.[code] ?? EMPTY_CHECKLIST,
    toggleValue,
  };
}