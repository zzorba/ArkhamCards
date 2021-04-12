import React, { useCallback, useMemo, useState } from 'react';
import { filter, flatMap, map, range, uniq, sortBy } from 'lodash';
import { c, t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import MultiPickerComponent from '@components/core/MultiPickerComponent';
import Card from '@data/types/Card';

interface Props {
  choices?: string[];
  save: (traits: string[]) => void;
  weaknessCards: Card[];
}

export default function SelectWeaknessTraitsComponent({ choices, save, weaknessCards }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
  const allTraits = useMemo(() => {
    return sortBy(
      uniq(
        flatMap(weaknessCards, card => {
          if (!card || !card.traits) {
            return [];
          }
          return filter(
            map(
              card.traits.split('.'),
              trait => trait.trim()
            )
          );
        })
      )
    );
  }, [weaknessCards]);

  const savePress = useCallback(() => {
    save(
      map(selectedIndex, index => allTraits[index])
    );
  }, [save, selectedIndex, allTraits]);

  const saveButton = useMemo(() => {
    if (choices !== undefined) {
      return null;
    }
    return (
      <BasicButton
        title={t`Proceed`}
        onPress={savePress}
      />
    );
  }, [choices, savePress]);

  return (
    <>
      <MultiPickerComponent
        title={t`Traits`}
        editable={choices === undefined}
        topBorder
        selectedIndex={
          choices ? range(0, choices.length) : selectedIndex}
        onChoiceChange={setSelectedIndex}
        choices={map(choices || allTraits,
          trait => {
            return {
              text: trait,
            };
          }
        )}
        defaultLabel={c('Weakness Card').t`All`}
      />
      { saveButton }
    </>
  );
}
