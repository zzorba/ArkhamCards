import { useCallback, useContext, useMemo, useState } from 'react';
import { find, forEach, keys, debounce } from 'lodash';

import { Deck, Slots } from '@actions/types';
import { saveDeckChanges, SaveDeckChanges, saveDeckUpgrade } from './actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { DeckActions } from '@data/remote/decks';
import LatestDeckT from '@data/interfaces/LatestDeckT';

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export type SaveDeckUpgrade<T> = (
  deck: LatestDeckT | undefined,
  xp: number,
  storyCounts: Slots,
  ignoreStoryCounts: Slots,
  exileCounts: Slots,
  d: T
) => Promise<void> | undefined;

export default function useDeckUpgradeAction<T = undefined>(
  actions: DeckActions,
  upgradeCompleted: (deck: Deck, xp: number, id: T) => Promise<void>,
): [boolean, string | undefined, SaveDeckUpgrade<T>] {
  const { userId } = useContext(ArkhamCardsAuthContext);
  const deckDispatch: DeckDispatch = useDispatch();
  const doSaveDeckChanges = useCallback((deck: Deck, changes: SaveDeckChanges): Promise<Deck> => {
    return deckDispatch(saveDeckChanges(userId, actions, deck, changes) as any);
  }, [deckDispatch, actions, userId]);

  const doSaveDeckUpgrade = useCallback((deck: Deck, xp: number, exileCounts: Slots): Promise<Deck> => {
    return deckDispatch(saveDeckUpgrade(userId, actions, deck, xp, exileCounts) as any);
  }, [deckDispatch, actions, userId]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const deckUpgradeComplete = useCallback(async(deck: Deck, xp: number, id: T) => {
    setSaving(false);
    await upgradeCompleted(deck, xp, id);
  }, [setSaving, upgradeCompleted]);

  const handleStoryCardChanges = useCallback(async(
    upgradedDeck: Deck,
    xp: number,
    storyCounts: Slots,
    ignoreStoryCounts: Slots,
    id: T,
  ) => {
    const hasStoryChange = !!find(keys(storyCounts), (code) => {
      return (upgradedDeck.slots?.[code] || 0) !== storyCounts[code];
    }) || !!find(keys(ignoreStoryCounts), (code) => {
      return (upgradedDeck.ignoreDeckLimitSlots[code] || 0) !== ignoreStoryCounts[code];
    });
    if (hasStoryChange) {
      const newSlots: Slots = { ...upgradedDeck.slots };
      forEach(storyCounts, (count, code) => {
        if (code.startsWith('z')) {
          return;
        }
        if (count > 0) {
          newSlots[code] = count;
        } else {
          delete newSlots[code];
        }
      });
      const newIgnoreSlots: Slots = { ...upgradedDeck.ignoreDeckLimitSlots };
      forEach(ignoreStoryCounts, (count, code) => {
        if (code.startsWith('z')) {
          return;
        }
        if (count > 0){
          newIgnoreSlots[code] = count;
        } else {
          delete newIgnoreSlots[code];
        }
      });
      return doSaveDeckChanges(upgradedDeck, {
        slots: newSlots,
        ignoreDeckLimitSlots: newIgnoreSlots,
      }).then(
        (deck: Deck) => {
          setSaving(false);
          deckUpgradeComplete(deck, xp, id);
        },
        (e: Error) => {
          console.log(e);
          setError(e.message);
          setSaving(false);
        }
      );
    }

    setSaving(false);
    deckUpgradeComplete(upgradedDeck, xp, id);
  }, [doSaveDeckChanges, deckUpgradeComplete]);
  const saveUpgrade = useCallback(async(
    deck: LatestDeckT | undefined,
    xp: number,
    storyCounts: Slots,
    ignoreStoryCounts: Slots,
    exileCounts: Slots,
    id: T,
    isRetry?: boolean
  ): Promise<void> => {
    if (!deck) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => doSaveDeckUpgrade(deck.deck, xp, exileCounts).then(
          (deck: Deck) => {
            handleStoryCardChanges(deck, xp, storyCounts, ignoreStoryCounts, id).then(resolve, reject);
          },
          (e: Error) => {
            setError(e.message);
            setSaving(false);
            reject(e.message);
          }
        ), 0);
      });
    }
  }, [doSaveDeckUpgrade, saving, handleStoryCardChanges, setError, setSaving]);
  const throttledSaveUpgrade: SaveDeckUpgrade<T> = useMemo(() => {
    return debounce((
      deck: LatestDeckT | undefined,
      xp: number,
      storyCounts: Slots,
      ignoreStoryCounts: Slots,
      exileCounts: Slots,
      id: T
    ): Promise<void> => saveUpgrade(deck, xp, storyCounts, ignoreStoryCounts, exileCounts, id), 1000, { leading: true, trailing: false });
  }, [saveUpgrade]);

  return [saving, error, throttledSaveUpgrade];
}