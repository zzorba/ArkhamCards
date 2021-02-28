import React, { forwardRef, useCallback, useContext, useImperativeHandle, useMemo } from 'react';
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
import Card from '@data/types/Card';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCounter, useSlots } from '@components/core/hooks';
import DeckButton from './controls/DeckButton';
import { SaveDeckUpgrade } from './useDeckUpgrade';

interface DeckUpgradeProps extends NavigationProps{
  investigator: Card;
  deck: Deck;
  startingXp?: number;
  campaignSection?: React.ReactNode;
  storyCounts: Slots;
  ignoreStoryCounts: Slots;
  saveDeckUpgrade: SaveDeckUpgrade;
  saving: boolean;
  error?: string | undefined;
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
  saveDeckUpgrade,
  saveButtonText,
  saving,
  error,
}: DeckUpgradeProps, ref: any) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const [xp, incXp, decXp] = useCounter(startingXp || 0, { min: 0 });
  const [exileCounts, updateExileCounts] = useSlots({});

  const doSave = useCallback(() => {
    saveDeckUpgrade(xp, storyCounts, ignoreStoryCounts, exileCounts);
  }, [saveDeckUpgrade, xp, storyCounts, ignoreStoryCounts, exileCounts]);

  useImperativeHandle(ref, () => ({
    save: async() => {
      doSave();
    },
  }), [doSave]);
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
          <DeckButton icon="upgrade" color="gold" onPress={doSave} title={saveButtonText} />
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
