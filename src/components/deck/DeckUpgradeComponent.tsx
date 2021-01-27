import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo, useState } from 'react';
import { forEach, find, keys, throttle } from 'lodash';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { t } from 'ttag';

import { Deck, getDeckId, Slots } from '@actions/types';
import BasicListRow from '@components/core/BasicListRow';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { NavigationProps } from '@components/nav/types';
import ExileCardSelectorComponent from '@components/campaign/ExileCardSelectorComponent';
import Card from '@data/Card';
import { SaveDeckChanges } from '@components/deck/actions';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useSlots } from '@components/core/hooks';
import DeckButton from './controls/DeckButton';

interface DeckUpgradeProps extends NavigationProps{
  investigator: Card;
  deck: Deck;
  startingXp?: number;
  campaignSection?: React.ReactNode;
  storyCounts: Slots;
  ignoreStoryCounts: Slots;
  upgradeCompleted: (deck: Deck, xp: number) => void;
  saveDeckChanges: (deck: Deck, changes: SaveDeckChanges) => Promise<Deck>;
  saveDeckUpgrade: (deck: Deck, xp: number, exileCounts: Slots) => Promise<Deck>;
  saveButtonText?: string;
}

export interface DeckUpgradeHandles {
  save: () => void;
}

function DeckUpgradeComponent({
  componentId,
  investigator,
  deck,
  startingXp,
  campaignSection,
  storyCounts,
  ignoreStoryCounts,
  upgradeCompleted,
  saveDeckChanges,
  saveDeckUpgrade,
  saveButtonText,
}: DeckUpgradeProps, ref: any) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const [xp, incXp, decXp] = useCounter(startingXp || 0, { min: 0 });
  const [exileCounts, updateExileCounts] = useSlots({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const deckUpgradeComplete = useCallback((deck: Deck, xp: number) => {
    setSaving(false);
    upgradeCompleted(deck, xp);
  }, [setSaving, upgradeCompleted]);

  const handleStoryCardChanges = useCallback((upgradedDeck: Deck) => {
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
      saveDeckChanges(upgradedDeck, {
        slots: newSlots,
        ignoreDeckLimitSlots: newIgnoreSlots,
      }).then(
        (deck: Deck) => deckUpgradeComplete(deck, xp),
        (e: Error) => {
          console.log(e);
          setError(e.message);
          setSaving(false);
        }
      );
    } else {
      deckUpgradeComplete(upgradedDeck, xp);
    }
  }, [
    saveDeckChanges,
    storyCounts,
    ignoreStoryCounts,
    xp,
    deckUpgradeComplete,
  ]);
  const saveUpgrade = useCallback((isRetry?: boolean) => {
    if (!deck) {
      return;
    }
    if (!saving || isRetry) {
      setSaving(true);
      saveDeckUpgrade(deck, xp, exileCounts).then(
        handleStoryCardChanges,
        (e: Error) => {
          setError(e.message);
          setSaving(false);
        }
      );
    }
  }, [deck, saveDeckUpgrade, saving, xp, exileCounts, handleStoryCardChanges, setError, setSaving]);

  const throttledSaveUpgrade = useMemo(() => {
    return throttle(() => saveUpgrade(), 200);
  }, [saveUpgrade]);
  useImperativeHandle(ref, () => ({
    save: () => {
      throttledSaveUpgrade();
    },
  }), [throttledSaveUpgrade]);
  const onExileCountChange = useCallback((card: Card, count: number) => {
    updateExileCounts({ type: 'set-slot', code: card.code, value: count });
  }, [updateExileCounts]);
  const deckId = useMemo(() => getDeckId(deck), [deck]);
  if (!deck) {
    return null;
  }
  if (saving) {
    return (
      <View style={[styles.container, styles.saving, backgroundStyle]}>
        <Text style={typography.text}>
          { t`Saving...` }
        </Text>
        <ActivityIndicator
          style={space.marginTopM}
          color={colors.lightText}
          size="large"
          animating
        />
      </View>
    );
  }
  const xpString = xp >= 0 ? `+${xp}` : `${xp}`;
  return (
    <View style={styles.container}>
      { !!error && <Text style={[typography.text, typography.error]}>{ error }</Text> }
      <CardSectionHeader
        investigator={investigator}
        section={{ superTitle: t`Experience points` }}
      />
      <BasicListRow>
        <Text style={typography.text}>
          { xpString }
        </Text>
        <PlusMinusButtons
          count={xp}
          onIncrement={incXp}
          onDecrement={decXp}
        />
      </BasicListRow>
      <ExileCardSelectorComponent
        componentId={componentId}
        id={deckId}
        label={(
          <CardSectionHeader
            section={{ superTitle: t`Exiled cards` }}
            investigator={investigator}
          />
        )}
        exileCounts={exileCounts}
        updateExileCount={onExileCountChange}
      />
      { !!campaignSection && campaignSection }
      { !!saveButtonText && (
        <View style={space.paddingM}>
          <DeckButton icon="upgrade" color="gold" onPress={throttledSaveUpgrade} title={saveButtonText} />
        </View>
      ) }
    </View>
  );
}

export default forwardRef(DeckUpgradeComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  saving: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: m,
    paddingBottom: m,
  },
});
