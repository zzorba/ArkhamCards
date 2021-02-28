import { useCallback, useContext, useMemo, useState } from 'react';
import { find, forEach, keys, throttle } from 'lodash';

import { Deck, Slots } from '@actions/types';
import { saveDeckChanges, SaveDeckChanges, saveDeckUpgrade } from './actions';
import ArkhamCardsAuthContext from '@lib/ArkhamCardsAuthContext';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '@reducers';
import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { CreateDeckActions } from '@data/remote/decks';

type DeckDispatch = ThunkDispatch<AppState, unknown, Action<string>>;

export type SaveDeckUpgrade = (xp: number, storyCounts: Slots, ignoreStoryCounts: Slots, exileCounts: Slots) => void;

export default function useDeckUpgrade(
  deck: Deck | undefined,
  actions: CreateDeckActions,
  upgradeCompleted: (deck: Deck, xp: number) => void,
): [boolean, string | undefined, SaveDeckUpgrade] {
  const { user } = useContext(ArkhamCardsAuthContext);
  const deckDispatch: DeckDispatch = useDispatch();
  const doSaveDeckChanges = useCallback((deck: Deck, changes: SaveDeckChanges): Promise<Deck> => {
    return deckDispatch(saveDeckChanges(user, actions, deck, changes) as any);
  }, [deckDispatch, actions, user]);

  const doSaveDeckUpgrade = useCallback((deck: Deck, xp: number, exileCounts: Slots): Promise<Deck> => {
    return deckDispatch(saveDeckUpgrade(user, actions, deck, xp, exileCounts) as any);
  }, [deckDispatch, actions, user]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const deckUpgradeComplete = useCallback((deck: Deck, xp: number) => {
    setSaving(false);
    upgradeCompleted(deck, xp);
  }, [setSaving, upgradeCompleted]);

  const handleStoryCardChanges = useCallback((
    upgradedDeck: Deck,
    xp: number,
    storyCounts: Slots,
    ignoreStoryCounts: Slots,
  ) => {
    const hasStoryChange = !!find(keys(storyCounts), (code) => {
      return (upgradedDeck.slots?.[code] || 0) !== storyCounts[code];
    }) || !!find(keys(ignoreStoryCounts), (code) => {
      return (upgradedDeck.ignoreDeckLimitSlots[code] || 0) !== ignoreStoryCounts[code];
    });
    if (hasStoryChange) {
      const newSlots: Slots = { ...upgradedDeck.slots };
      forEach(storyCounts, (count, code) => {
        if (count > 0) {
          newSlots[code] = count;
        } else {
          delete newSlots[code];
        }
      });
      const newIgnoreSlots: Slots = { ...upgradedDeck.ignoreDeckLimitSlots };
      forEach(ignoreStoryCounts, (count, code) => {
        if (count > 0){
          newIgnoreSlots[code] = count;
        } else {
          delete newIgnoreSlots[code];
        }
      });
      doSaveDeckChanges(upgradedDeck, {
        slots: newSlots,
        ignoreDeckLimitSlots: newIgnoreSlots,
      }).then(
        (deck: Deck) => {
          setSaving(false);
          deckUpgradeComplete(deck, xp);
        },
        (e: Error) => {
          console.log(e);
          setError(e.message);
          setSaving(false);
        }
      );
    } else {
      setSaving(false);
      deckUpgradeComplete(upgradedDeck, xp);
    }
  }, [doSaveDeckChanges, deckUpgradeComplete]);
  const saveUpgrade = useCallback((
    xp: number,
    storyCounts: Slots,
    ignoreStoryCounts: Slots,
    exileCounts: Slots,
    isRetry?: boolean
  ) => {
    if (!deck) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      doSaveDeckUpgrade(deck, xp, exileCounts).then(
        (deck: Deck) => handleStoryCardChanges(deck, xp, storyCounts, ignoreStoryCounts),
        (e: Error) => {
          setError(e.message);
          setSaving(false);
        }
      );
    }
  }, [deck, doSaveDeckUpgrade, saving, handleStoryCardChanges, setError, setSaving]);
  const throttledSaveUpgrade = useMemo(() => {
    return throttle((
      xp: number,
      storyCounts: Slots,
      ignoreStoryCounts: Slots,
      exileCounts: Slots
    ) => saveUpgrade(xp, storyCounts, ignoreStoryCounts, exileCounts), 200);
  }, [saveUpgrade]);

  return [saving, error, throttledSaveUpgrade];
}