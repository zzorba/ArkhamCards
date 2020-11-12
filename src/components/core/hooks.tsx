import { Reducer, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { Navigation, NavigationButtonPressedEvent, ComponentDidAppearEvent, ComponentDidDisappearEvent } from 'react-native-navigation';
import { forEach, debounce, find } from 'lodash';

import { Campaign, ChaosBagResults, Deck, DeckMeta, EditDeckState, ParsedDeck, SingleCampaign, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, getCampaign, getChaosBagResults, getDeck, getDeckEdits, getEffectiveDeckId, getLatestCampaignDeckIds, getLatestCampaignInvestigators, getTabooSet } from '@reducers';
import DatabaseContext from '@data/DatabaseContext';
import { parseDeck } from '@lib/parseDeck';
import { fetchPrivateDeck } from '@components/deck/actions';
import { campaignScenarios, Scenario } from '@components/campaign/constants';
import { BackHandler } from 'react-native';
import TabooSet from '@data/TabooSet';

export function useBackButton(handler: () => boolean) {
  // Frustration isolated! Yay! 🎉
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handler
      );
    };
  }, [handler]);
}

export function useNavigationButtonPressed(
  handler: (event: NavigationButtonPressedEvent) => void,
  componentId: string,
  deps: any[],
) {
  const debouncedHandler = useMemo(() => debounce(handler, 1000, { leading: true }), [handler]);
  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener((event: NavigationButtonPressedEvent) => {
      if (event.componentId === componentId) {
        debouncedHandler(event);
      }
    });
    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, debouncedHandler, ...deps]);
}

export function useComponentVisible(componentId: string): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const appearSub = Navigation.events().registerComponentDidAppearListener((event: ComponentDidAppearEvent) => {
      if (event.componentId === componentId) {
        setVisible(true);
      }
    });
    const disappearSub = Navigation.events().registerComponentDidDisappearListener((event: ComponentDidDisappearEvent) => {
      if (event.componentId === componentId) {
        setVisible(false);
      }
    });
    return () => {
      appearSub.remove();
      disappearSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, setVisible]);
  return visible;
}

export function useComponentDidAppear(
  handler: (event: ComponentDidAppearEvent) => void,
  componentId: string,
  deps: any[],
) {
  useEffect(() => {
    const sub = Navigation.events().registerComponentDidAppearListener((event: ComponentDidAppearEvent) => {
      if (event.componentId === componentId) {
        handler(event);
      }
    });
    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, handler, ...deps]);
}


export function useComponentDidDisappear(
  handler: (event: ComponentDidDisappearEvent) => void,
  componentId: string,
  deps: any[],
) {
  useEffect(() => {
    const sub = Navigation.events().registerComponentDidDisappearListener((event: ComponentDidDisappearEvent) => {
      if (event.componentId === componentId) {
        handler(event);
      }
    });
    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, handler, ...deps]);
}


interface IncAction {
  type: 'inc';
}
interface DecAction {
  type: 'dec';
}
interface SetAction {
  type: 'set';
  value: number;
}
export function useCounter(initialValue: number, { min, max }: { min?: number; max?: number }): [number, () => void, () => void, (value: number) => void] {
  const [value, updateValue] = useReducer((state: number, action: IncAction | DecAction | SetAction) => {
    switch (action.type) {
      case 'set':
        return action.value;
      case 'inc':
        if (max) {
          return Math.min(max, state + 1);
        }
        return state + 1;
      case 'dec':
        if (min) {
          return Math.max(min, state - 1);
        }
        return state - 1;
    }
  }, initialValue);
  const inc = useCallback(() => {
    updateValue({ type: 'inc' });
  }, [updateValue]);
  const dec = useCallback(() => {
    updateValue({ type: 'dec' });
  }, [updateValue]);
  const set = useCallback((value: number) => {
    updateValue({ type: 'set', value });
  }, [updateValue]);
  return [value, inc, dec, set];
}


interface IncCountAction {
  type: 'inc';
  key: string;
  max?: number;
}
interface DecCountAction {
  type: 'dec';
  key: string;
}

interface SetCountAction {
  type: 'set';
  key: string;
  value: number;
}
interface Counters {
  [code: string]: number | undefined;
}
export function useCounters(initialValue: Counters): [Counters, (code: string, max?: number) => void, (code: string) => void, (code: string, value: number) => void] {
  const [value, updateValue] = useReducer((state: Counters, action: IncCountAction | DecCountAction | SetCountAction) => {
    switch (action.type) {
      case 'set':
        return {
          ...state,
          [action.key]: action.value,
        };
      case 'inc': {
        const newValue = (state[action.key] || 0) + 1;
        return {
          ...state,
          [action.key]: action.max !== undefined ? Math.min(action.max, newValue) : newValue,
        };
      }
      case 'dec': {
        return {
          ...state,
          [action.key]: Math.max(0, (state[action.key] || 0) - 1),
        };
      }
    }
  }, initialValue);
  const inc = useCallback((code: string, max?: number) => {
    updateValue({ type: 'inc', key: code, max });
  }, [updateValue]);
  const dec = useCallback((code: string) => {
    updateValue({ type: 'dec', key: code });
  }, [updateValue]);
  const set = useCallback((code: string, value: number) => {
    updateValue({ type: 'set', key: code, value });
  }, [updateValue]);
  return [value, inc, dec, set];
}

interface ClearAction {
  type: 'clear';
}

interface SetToggleAction {
  type: 'set';
  key: string | number;
  value: boolean;
}

interface ToggleAction {
  type: 'toggle';
  key: string;
}

interface RemoveAction {
  type: 'remove';
  key: string;
}

type SectionToggleAction = SetToggleAction | ToggleAction | ClearAction | RemoveAction;

export interface Toggles {
  [key: string]: boolean | undefined;
}

export function useToggles(initialState: Toggles): [Toggles, (code: string) => void, (code: string | number, value: boolean) => void, () => void, (code: string) => void] {
  const [toggles, updateToggles] = useReducer((state: Toggles, action: SectionToggleAction) => {
    switch (action.type) {
      case 'clear':
        return initialState;
      case 'remove': {
        const newState = { ...state };
        delete newState[action.key];
        return newState;
      }
      case 'set':
        return {
          ...state,
          [action.key]: action.value,
        };
      case 'toggle':
        return {
          ...state,
          [action.key]: !state[action.key],
        };
    }
  }, initialState);
  const toggle = useCallback((code: string) => updateToggles({ type: 'toggle', key: code }), [updateToggles]);
  const set = useCallback((code: string | number, value: boolean) => updateToggles({ type: 'set', key: code, value }), [updateToggles]);
  const clear = useCallback(() => updateToggles({ type: 'clear' }), [updateToggles]);
  const remove = useCallback((code: string) => updateToggles({ type: 'remove', key: code }), [updateToggles]);
  return [toggles, toggle, set, clear, remove];
}

export function useFlag(initialValue: boolean): [boolean, () => void, (value: boolean) => void] {
  const [value, updateState] = useReducer((state: boolean, action: { type: 'toggle' } | { type: 'set', value: boolean }) => {
    switch (action.type) {
      case 'toggle':
        return !state;
      case 'set':
        return action.value;
    }
  }, initialValue);
  const toggle = useCallback(() => updateState({ type: 'toggle' }), [updateState]);
  const set = useCallback((value: boolean) => updateState({ type: 'set', value }), [updateState]);
  return [value, toggle, set];
}

interface ClearAction {
  type: 'clear';
}

interface SlotAction {
  type: 'set-slot';
  code: string;
  value: number;
}

interface SyncAction {
  type: 'sync';
  slots: Slots;
}

interface IncSlotAction {
  type: 'inc-slot';
  code: string;
  max?: number;
}

interface DecSlotAction {
  type: 'dec-slot';
  code: string;
}

type SlotsAction = SlotAction | IncSlotAction | DecSlotAction | ClearAction | SyncAction;

export function useSlots(initialState: Slots, updateSlots?: (slots: Slots) => void) {
  return useReducer((state: Slots, action: SlotsAction) => {
    switch (action.type) {
      case 'clear':
        updateSlots && updateSlots(initialState);
        return initialState;
      case 'sync':
        // Intentionally do not update on this one.
        return action.slots;
      case 'set-slot': {
        const newState = {
          ...state,
          [action.code]: action.value,
        };
        if (!newState[action.code]) {
          delete newState[action.code];
        }
        updateSlots && updateSlots(newState);
        return newState;
      }
      case 'inc-slot': {
        const newState = {
          ...state,
          [action.code]: (state[action.code] || 0) + 1,
        };
        if (action.max && newState[action.code] > action.max) {
          newState[action.code] = action.max;
        }
        updateSlots && updateSlots(newState);
        return newState;
      }
      case 'dec-slot': {
        const newState = {
          ...state,
          [action.code]: (state[action.code] || 0) - 1,
        };
        if (newState[action.code] <= 0) {
          delete newState[action.code];
        }
        updateSlots && updateSlots(newState);
        return newState;
      }
    }
  }, initialState);
}

export function useDeckEdits(id: number | undefined, initialize?: boolean): EditDeckState | undefined {
  const dispatch = useDispatch();
  useEffect(() => {
    if (initialize && id !== undefined) {
      dispatch({ type: 'START_DECK_EDIT', id });
      return function cleanup() {
        dispatch({ type: 'FINISH_DECK_EDIT', id });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selector = useCallback((state: AppState) => id !== undefined ? getDeckEdits(state, id) : undefined, [id]);
  const deckEdits = useSelector(selector);
  return deckEdits;
}

export interface EditSlotsActions {
  setSlot: (code: string, count: number) => void;
  incSlot: (code: string) => void;
  decSlot: (code: string) => void;
}

export function useSlotActions(slots?: Slots, editSlotsActions?: EditSlotsActions, updateSlots?: (slots: Slots) => void): [Slots, EditSlotsActions | undefined] {
  const [deckCardCounts, updateDeckCardCounts] = useSlots(slots || {}, updateSlots);
  const propsSetSlot = editSlotsActions?.setSlot;
  const propsDecSlot = editSlotsActions?.decSlot;
  const propsIncSlot = editSlotsActions?.incSlot;

  const setSlot = useCallback((code: string, value: number) => {
    if (propsSetSlot) {
      InteractionManager.runAfterInteractions(() => {
        propsSetSlot(code, value);
      });
    }
    updateDeckCardCounts({ type: 'set-slot', code, value });
  }, [propsSetSlot, updateDeckCardCounts]);
  const incSlot = useCallback((code: string) => {
    if (propsIncSlot) {
      InteractionManager.runAfterInteractions(() => {
        propsIncSlot(code);
      });
    }
    updateDeckCardCounts({ type: 'inc-slot', code });
  }, [propsIncSlot, updateDeckCardCounts]);
  const decSlot = useCallback((code: string) => {
    if (propsDecSlot) {
      InteractionManager.runAfterInteractions(() => {
        propsDecSlot(code);
      });
    }
    updateDeckCardCounts({ type: 'dec-slot', code });
  }, [propsDecSlot, updateDeckCardCounts]);
  const actions = useMemo(() => {
    return {
      setSlot,
      incSlot,
      decSlot,
    };
  }, [setSlot, incSlot, decSlot]);
  return [deckCardCounts, editSlotsActions ? actions : undefined];
}

interface AppendCardsAction {
  type: 'cards';
  cards: Card[]
}

type LoadCardsAction = ClearAction | AppendCardsAction;

function lazyCardMap(indexBy: 'code' | 'id') {
  return (state: CardsMap, action: LoadCardsAction): CardsMap => {
    switch (action.type) {
      case 'clear':
        return {};
      case 'cards': {
        const result: CardsMap = { ...state };
        forEach(action.cards, card => {
          result[card[indexBy]] = card;
        });
        return result;
      }
    }
  };
}

export function useCards(indexBy: 'code' | 'id', initialCards?: Card[]) {
  return useReducer<Reducer<CardsMap, LoadCardsAction>, Card[] | undefined>(
    lazyCardMap(indexBy),
    initialCards,
    (initialCards?: Card[]) => {
      if (initialCards) {
        return lazyCardMap(indexBy)({}, {
          type: 'cards',
          cards: { ...initialCards },
        });
      }
      return {};
    }
  );
}

export function useTabooSetId(tabooSetOverride?: number): number {
  const selector = useCallback((state: AppState) => getTabooSet(state, tabooSetOverride), [tabooSetOverride]);
  return useSelector(selector) || 0;
}

export function usePlayerCards(tabooSetOverride?: number): CardsMap | undefined {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const { playerCardsByTaboo } = useContext(DatabaseContext);
  const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
  return playerCards?.cards;
}

export function useInvestigatorCards(tabooSetOverride?: number): CardsMap | undefined {
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const { investigatorCardsByTaboo } = useContext(DatabaseContext);
  return investigatorCardsByTaboo?.[`${tabooSetId || 0}`];
}

export function useTabooSet(tabooSetId: number): TabooSet | undefined {
  const { tabooSets } = useContext(DatabaseContext);
  return find(tabooSets, tabooSet => tabooSet.id === tabooSetId);
}

export function useWeaknessCards(tabooSetOverride?: number): Card[] | undefined {
  const tabooSetId = useSelector((state: AppState) => getTabooSet(state, tabooSetOverride));
  const { playerCardsByTaboo } = useContext(DatabaseContext);
  const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
  return playerCards?.weaknessCards;
}

export function useCampaign(campaignId?: number): SingleCampaign | undefined {
  const selector = useCallback((state: AppState) => {
    if (campaignId) {
      return getCampaign(state, campaignId);
    }
    return undefined;
  }, [campaignId]);
  return useSelector(selector);
}

const EMPTY_INVESTIGATORS: Card[] = [];
export function useCampaignInvestigators(campaign?: Campaign, investigators?: CardsMap): Card[] {
  const allInvestigatorsSelector = useCallback((state: AppState) => {
    return investigators && campaign ? getLatestCampaignInvestigators(state, investigators, campaign) : EMPTY_INVESTIGATORS;
  }, [investigators, campaign]);
  return useSelector(allInvestigatorsSelector);
}

const EMPTY_DECK_IDS: number[] = [];
export function useCampaignLatestDeckIds(campaign?: Campaign): number[] {
  const latestDeckIdsSelector = useCallback((state: AppState) => {
    return campaign ? getLatestCampaignDeckIds(state, campaign) : EMPTY_DECK_IDS;
  }, [campaign]);
  return useSelector(latestDeckIdsSelector);
}

export function useCampaignDetails(campaign?: Campaign, investigators?: CardsMap): [number[], Card[]] {
  const allInvestigators = useCampaignInvestigators(campaign, investigators);
  const latestDeckIds = useCampaignLatestDeckIds(campaign);
  return [latestDeckIds, allInvestigators];
}

export function useCampaignScenarios(campaign?: Campaign): [Scenario[], { [code: string]: Scenario }] {
  const cycleScenarios = useMemo(() => campaign ? campaignScenarios(campaign.cycleCode) : [], [campaign]);
  const scenarioByCode = useMemo(() => {
    const result: { [code: string]: Scenario } = {};
    forEach(cycleScenarios, scenario => {
      result[scenario.code] = scenario;
    });
    return result;
  }, [cycleScenarios]);
  return [cycleScenarios, scenarioByCode];
}

export function useChaosBagResults(campaignId: number): ChaosBagResults {
  const chaosBagResultsSelector = useCallback((state: AppState) => getChaosBagResults(state, campaignId), [campaignId]);
  return useSelector(chaosBagResultsSelector);
}

export function useDeck(id: number | undefined, { fetchIfMissing }: { fetchIfMissing?: boolean }) {
  const dispatch = useDispatch();
  const effectiveDeckIdSelector = useCallback((state: AppState) => id !== undefined ? getEffectiveDeckId(state, id) : undefined, [id]);
  const effectiveDeckId = useSelector(effectiveDeckIdSelector);
  const deckSelector = useCallback((state: AppState) => effectiveDeckId !== undefined ? getDeck(effectiveDeckId)(state) : undefined, [effectiveDeckId]);
  const theDeck = useSelector(deckSelector) || undefined;
  const previousDeckSelector = useCallback((state: AppState) => {
    return theDeck && theDeck.previous_deck && getDeck(theDeck.previous_deck)(state);
  }, [theDeck]);
  const thePreviousDeck = useSelector(previousDeckSelector) || undefined;
  useEffect(() => {
    if (!theDeck && fetchIfMissing && id !== undefined && id > 0) {
      dispatch(fetchPrivateDeck(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!thePreviousDeck && theDeck?.previous_deck && fetchIfMissing && !theDeck.local) {
      dispatch(fetchPrivateDeck(theDeck.previous_deck));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theDeck]);
  return [theDeck, thePreviousDeck];
}

export function useParsedDeck(
  deck: Deck,
  {
    previousDeck,
    meta,
    slots,
    ignoreDeckLimitSlots,
    xpAdjustment,
  }: {
    previousDeck?: Deck;
    meta?: DeckMeta;
    slots?: Slots;
    ignoreDeckLimitSlots?: Slots;
    xpAdjustment?: number;
  }
): ParsedDeck | undefined {
  const cards = usePlayerCards(deck.taboo_id || 0);
  const parsedDeck = useMemo(() => cards && parseDeck(
    deck,
    meta || deck.meta || {},
    slots || deck.slots,
    ignoreDeckLimitSlots || deck.ignoreDeckLimitSlots,
    cards,
    previousDeck,
    xpAdjustment !== undefined ? xpAdjustment : deck.xp_adjustment,
  ), [cards, deck, meta, slots, ignoreDeckLimitSlots, previousDeck, xpAdjustment]);
  return parsedDeck;
}

export function useEffectUpdate(update: () => void, deps: any[]) {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useWhyDidYouUpdate<T>(name: string, props: T) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef<T>();

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}