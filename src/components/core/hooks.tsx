import { Reducer, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { BackHandler, InteractionManager, Keyboard } from 'react-native';
import { Navigation, NavigationButtonPressedEvent, ComponentDidAppearEvent, ComponentDidDisappearEvent, NavigationConstants } from 'react-native-navigation';
import { forEach, debounce, find } from 'lodash';

import { CampaignCycleCode, DeckId, Slots } from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppState,
  makeTabooSetSelector,
} from '@reducers';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { fetchPrivateDeck } from '@components/deck/actions';
import { campaignScenarios, Scenario } from '@components/campaign/constants';
import TabooSet from '@data/types/TabooSet';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { DeckActions } from '@data/remote/decks';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { useDeck } from '@data/hooks';
import LatestDeckT from '@data/interfaces/LatestDeckT';

export function useBackButton(handler: () => boolean) {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => {
      sub.remove();
    };
  }, [handler]);
}

export function useNavigationConstants(): Partial<NavigationConstants> {
  const [constants, setConstants] = useState<NavigationConstants>();
  useEffect(() => {
    let canceled = false;
    Navigation.constants().then(r => {
      if (!canceled) {
        setConstants(r);
      }
    });
    return () => {
      canceled = true;
    };
  }, []);
  return constants || {};
}
export function useNavigationButtonPressed(
  handler: (event: NavigationButtonPressedEvent) => void,
  componentId: string,
  deps: any[],
  debounceDelay: number = 300
) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  const debouncedHandler = useMemo(() => debounce((event: NavigationButtonPressedEvent) => handlerRef.current && handlerRef.current(event), debounceDelay, { leading: true, trailing: false }), [debounceDelay]);
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
  min?: number;
}

interface SetCountAction {
  type: 'set';
  key: string;
  value: number;
}
interface SyncCountAction {
  type: 'sync';
  values: Counters;
}
interface Counters {
  [code: string]: number | undefined;
}
export function useCounters(initialValue: Counters): [Counters, (code: string, max?: number) => void, (code: string, min?: number) => void, (code: string, value: number) => void, (values: Counters) => void] {
  const [value, updateValue] = useReducer((state: Counters, action: IncCountAction | DecCountAction | SetCountAction | SyncCountAction) => {
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
          [action.key]: Math.max(action.min || 0, (state[action.key] || 0) - 1),
        };
      }
      case 'sync':
        return {
          ...action.values,
        };
    }
  }, initialValue);
  const inc = useCallback((code: string, max?: number) => {
    updateValue({ type: 'inc', key: code, max });
  }, [updateValue]);
  const dec = useCallback((code: string, min?: number) => {
    updateValue({ type: 'dec', key: code, min });
  }, [updateValue]);
  const set = useCallback((code: string, value: number) => {
    updateValue({ type: 'set', key: code, value });
  }, [updateValue]);
  const sync = useCallback((values: Counters) => {
    updateValue({ type: 'sync', values });
  }, [updateValue]);
  return [value, inc, dec, set, sync];
}

export interface Toggles {
  [key: string]: boolean | undefined;
}

interface ClearAction {
  type: 'clear';
  state?: Toggles;
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


export function useToggles(initialState: Toggles, sync?: (toggles: Toggles) => void): [
  Toggles,
  (code: string) => void,
  (code: string | number, value: boolean) => void,
  (state?: Toggles) => void,
  (code: string) => void,
] {
  const [toggles, updateToggles] = useReducer((state: Toggles, action: SectionToggleAction) => {
    switch (action.type) {
      case 'clear':
        return action.state || initialState;
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
  useEffect(() => {
    sync?.(toggles);
  }, [sync, toggles]);
  const toggle = useCallback((code: string) => updateToggles({ type: 'toggle', key: code }), [updateToggles]);
  const set = useCallback((code: string | number, value: boolean) => updateToggles({ type: 'set', key: code, value }), [updateToggles]);
  const clear = useCallback((state?: Toggles) => updateToggles({ type: 'clear', state }), [updateToggles]);
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

export const useKeyboardHeight = (): [number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function onKeyboardDidShow(e: any): void {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide(): void {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const sub1 = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const sub2 = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  return [keyboardHeight];
};

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

export function useSlots(initialState: Slots, updateSlots?: (slots: Slots) => void, keepZero?: boolean) {
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
        if (!newState[action.code] && !keepZero) {
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
        if (newState[action.code] <= 0 && !keepZero) {
          delete newState[action.code];
        }
        updateSlots && updateSlots(newState);
        return newState;
      }
    }
  }, initialState);
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
  const selector = useMemo(makeTabooSetSelector, []);
  return useSelector((state: AppState) => selector(state, tabooSetOverride)) || 0;
}

export function usePlayerCards(tabooSetOverride?: number): CardsMap | undefined {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const { playerCardsByTaboo } = useContext(DatabaseContext);
  const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
  return playerCards?.cards;
}

export function useInvestigatorCards(tabooSetOverride?: number): CardsMap | undefined {
  const tabooSetSelctor = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelctor(state, tabooSetOverride));
  const { investigatorCardsByTaboo } = useContext(DatabaseContext);
  return investigatorCardsByTaboo?.[`${tabooSetId || 0}`];
}

export function useTabooSet(tabooSetId: number): TabooSet | undefined {
  const { tabooSets } = useContext(DatabaseContext);
  return find(tabooSets, tabooSet => tabooSet.id === tabooSetId);
}

export function useWeaknessCards(tabooSetOverride?: number): Card[] | undefined {
  const tabooSetSelector = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, tabooSetOverride));
  const { playerCardsByTaboo } = useContext(DatabaseContext);
  const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
  return playerCards?.weaknessCards;
}

export function useCycleScenarios(cycleCode: CampaignCycleCode | undefined): Scenario[] {
  return useMemo(() => cycleCode ? campaignScenarios(cycleCode) : [], [cycleCode]);
}

export function useCampaignScenarios(campaign: SingleCampaignT | undefined): [Scenario[], { [code: string]: Scenario }] {
  const cycleScenarios = useCycleScenarios(campaign?.cycleCode);
  const scenarioByCode = useMemo(() => {
    const result: { [code: string]: Scenario } = {};
    forEach(cycleScenarios, scenario => {
      result[scenario.code] = scenario;
    });
    return result;
  }, [cycleScenarios]);
  return [cycleScenarios, scenarioByCode];
}

export function useDeckWithFetch(id: DeckId | undefined, actions: DeckActions): LatestDeckT | undefined {
  const deck = useDeck(id, true);
  const dispatch = useDispatch();
  const { userId } = useContext(ArkhamCardsAuthContext);
  useEffect(() => {
    if (!deck && id !== undefined && !id.local) {
      dispatch(fetchPrivateDeck(userId, actions, id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!deck?.previousDeck && deck?.deck.previousDeckId && !deck.deck.local && !deck.deck.previousDeckId.local) {
      dispatch(fetchPrivateDeck(userId, actions, deck.deck.previousDeckId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);
  return deck;
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

export function usePressCallback(callback: undefined | (() => void), bufferTime: number = 1000): undefined | (() => void) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  const onPress = useMemo(() => {
    return debounce(() => callbackRef.current && callbackRef.current(), bufferTime, { leading: true, trailing: false });
  }, [callbackRef, bufferTime]);
  return callback ? onPress : undefined;
}

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) {
      return;
    }
    const id = setInterval(savedCallback.current, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/*
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
}*/
