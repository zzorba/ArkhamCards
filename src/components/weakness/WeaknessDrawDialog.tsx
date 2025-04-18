import React, { useCallback, useContext, useMemo, useState } from 'react';
import { forEach, keys } from 'lodash';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import WeaknessDrawComponent from './WeaknessDrawComponent';
import { t } from 'ttag';
import { Slots } from '@actions/types';
import { NavigationProps } from '@components/nav/types';
import { getPacksInCollection } from '@reducers';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import { xs } from '@styles/space';
import { useFlag, useSettingValue, useSlots, useWeaknessCards } from '@components/core/hooks';
import ToggleFilter from '@components/core/ToggleFilter';
import StyleContext from '@styles/StyleContext';
import BasicButton from '@components/core/BasicButton';
import Card, { cardInCollection } from '@data/types/Card';

export interface DrawWeaknessProps {
  investigator: Card | undefined;
  saveWeakness: (code: string, replaceRandomBasicWeakness: boolean) => void;
  slots: Slots;
  alwaysReplaceRandomBasicWeakness?: boolean;
}

type Props = NavigationProps & DrawWeaknessProps;

export default function WeaknessDrawDialog({ componentId, investigator, saveWeakness, slots: originalSlots, alwaysReplaceRandomBasicWeakness }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const [replaceRandomBasicWeakness, toggleReplaceRandomBasicWeakness] = useFlag(true);
  const [slots, updateSlots] = useSlots(originalSlots);
  const [saving, setSaving] = useState(false);
  const [pendingNextCard, setPendingNextCard] = useState<string | undefined>();
  const weaknessCards = useWeaknessCards();
  const in_collection = useSelector(getPacksInCollection);
  const ignore_collection = useSettingValue('ignore_collection');

  const saveDrawnCard = useCallback(() => {
    if (pendingNextCard) {
      setSaving(true);
      // We are in 'pending' mode to don't save it immediately.
      saveWeakness(pendingNextCard, replaceRandomBasicWeakness || !!alwaysReplaceRandomBasicWeakness);
      const newSlots = { ...slots };
      newSlots[pendingNextCard] = (newSlots[pendingNextCard] || 0) + 1;
      if ((replaceRandomBasicWeakness || alwaysReplaceRandomBasicWeakness) && newSlots[RANDOM_BASIC_WEAKNESS] > 0) {
        newSlots[RANDOM_BASIC_WEAKNESS] = newSlots[RANDOM_BASIC_WEAKNESS] - 1;
        if (newSlots[RANDOM_BASIC_WEAKNESS] === 0) {
          delete newSlots[RANDOM_BASIC_WEAKNESS];
        }
      }
      setPendingNextCard(undefined);
      updateSlots({ type: 'sync', slots: newSlots });
      setSaving(false);
    }
  }, [pendingNextCard, saveWeakness, replaceRandomBasicWeakness, alwaysReplaceRandomBasicWeakness, setPendingNextCard, updateSlots, slots, setSaving]);
  const customHeader = useMemo(() => {
    const hasRandomBasicWeakness = slots[RANDOM_BASIC_WEAKNESS] > 0;
    if (hasRandomBasicWeakness && !alwaysReplaceRandomBasicWeakness) {
      return (
        <ToggleFilter
          style={{ ...styles.toggleRow, ...borderStyle }}
          label={t`Replace Random Weakness`}
          setting="replaceRandomBasicWeakness"
          value={replaceRandomBasicWeakness}
          onChange={toggleReplaceRandomBasicWeakness}
        />
      );
    }
    return null;
  }, [borderStyle, slots, replaceRandomBasicWeakness, alwaysReplaceRandomBasicWeakness, toggleReplaceRandomBasicWeakness]);

  const flippedHeader = useMemo(() => {
    if (!pendingNextCard) {
      return null;
    }

    return (
      <BasicButton
        onPress={saveDrawnCard}
        title={t`Save to Deck`}
      />
    );
  }, [pendingNextCard, saveDrawnCard]);

  const weaknessSetFromCollection = useMemo(() => {
    const packCodes: { [pack_cod: string]: number } = {};
    forEach(weaknessCards, weaknessCard => {
      if (!weaknessCard) {
        return;
      }
      if (ignore_collection || cardInCollection(weaknessCard, in_collection) || weaknessCard.pack_code === 'core') {
        packCodes[weaknessCard.pack_code] = 1;
      }
    });
    const assignedCards: Slots = {};
    forEach(slots, (count, code) => {
      const card = weaknessCards && weaknessCards[code];
      if (card && card.isBasicWeakness()) {
        assignedCards[code] = count;
      }
    });
    return {
      packCodes: keys(packCodes),
      assignedCards,
    };
  }, [in_collection, ignore_collection, weaknessCards, slots]);

  return (
    <WeaknessDrawComponent
      componentId={componentId}
      investigator={investigator}
      customFlippedHeader={flippedHeader}
      customHeader={customHeader}
      weaknessSet={weaknessSetFromCollection}
      updateDrawnCard={setPendingNextCard}
      saving={saving}
    />
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    paddingTop: xs,
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
});
