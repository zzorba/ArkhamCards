import React, { Reducer, useCallback, useEffect, useReducer } from 'react';
import { Navigation, NavigationButtonPressedEvent, ComponentDidAppearEvent } from 'react-native-navigation';
import { forEach, debounce } from 'lodash';

import { Slots } from '@actions/types';
import Card, { CardsMap } from '@data/Card';

export function useNavigationButtonPressed(
  handler: (event: NavigationButtonPressedEvent) => void,
  componentId: string,
  deps: any[],
) {
  const debouncedHandler = useCallback(debounce(handler, 1000, { leading: true }), [handler]);
  useEffect(() => {
    const sub = Navigation.events().registerNavigationButtonPressedListener((event: NavigationButtonPressedEvent) => {
      if (event.componentId === componentId) {
        debouncedHandler(event);
      }
    })
    return () => {
      sub.remove();
    }
  }, [componentId, ...deps]);
}

export function useComponentDidAppear(
  handler: (event: ComponentDidAppearEvent) => void,
  componentId: string,
) {
  useEffect(() => {
    const sub = Navigation.events().registerComponentDidAppearListener((event: ComponentDidAppearEvent) => {
      if (event.componentId === componentId) {
        handler(event)
      }
    })
    return () => {
      sub.remove()
    }
  }, [componentId])
}

interface ClearAction {
  type: 'clear';
}

interface SetToggleAction {
  type: 'set';
  key: string;
  value: boolean;
}

interface ToggleAction {
  type: 'toggle';
  key: string;
}

type SectionToggleAction = SetToggleAction | ToggleAction | ClearAction;

export interface Toggles {
  [key: string]: boolean | undefined;
}

export function useToggles(initialState: Toggles) {
  return useReducer((state: Toggles, action: SectionToggleAction) => {
    switch (action.type) {
      case 'clear':
        return initialState;
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
}


interface ClearAction {
  type: 'clear';
}

interface SlotAction {
  type: 'set-slot';
  code: string;
  value: number;
}

interface IncSlotAction {
  type: 'inc-slot';
  code: string;
  max?: number;
}

interface DecSlotAction {
  type: 'dec-slot';
  code: string;
  value: number;
}

type SlotsAction = SlotAction | IncSlotAction | DecSlotAction | ClearAction;

export function useSlots(initialState: Slots) {
  return useReducer((state: Slots, action: SlotsAction) => {
    switch (action.type) {
      case 'clear':
        return initialState;
      case 'set-slot': {
        const newState = {
          ...state,
          [action.code]: action.value,
        };
        if (!newState[action.code]) {
          delete newState[action.code];
        }
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
        return newState;
      }
    }
  }, initialState);
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
