import React, { useCallback, useMemo } from 'react';
import { t } from 'ttag';

import Card from '@data/Card';
import DeckPickerButton from '@components/deck/controls/DeckPickerButton';

interface Props {
  investigator: Card;
  alternateInvestigator: Card;
  front: string;
  back: string;
  onChange: (front: string, back: string) => void;
  disabled?: boolean;
  editWarning: boolean;
  first: boolean;
  last: boolean;
}

export default function ParallelInvestigatorPicker({
  investigator,
  alternateInvestigator,
  front,
  back,
  disabled,
  editWarning,
  onChange,
  first,
  last,
}: Props) {
  const options = useMemo(() => [
    { label: t`Original front · Original back`, value: 0 },
    { label: t`Parallel front · Original back`, value: 1 },
    { label: t`Original front · Parallel back`, value: 2 },
    { label: t`Parallel front · Parallel back`, value: 3 },
  ], []);
  const selectedValue = (front === investigator.code ? 0 : 1) + (back === investigator.code ? 0 : 2);
  const onChoiceChange = useCallback((index: number | null) => {
    if (index !== null) {
      onChange(
        index % 2 ? alternateInvestigator.code : investigator.code,
        index >= 2 ? alternateInvestigator.code : investigator.code
      );
    }
  }, [onChange, alternateInvestigator.code, investigator.code]);

  return (
    <DeckPickerButton
      icon="parallel"
      faction={investigator.factionCode()}
      title={t`Parallel`}
      editable={!disabled}
      modalDescription={editWarning ? t`Parallel investigator options should only be selected at deck creation time, not between scenarios.` : undefined}
      options={options}
      selectedValue={selectedValue}
      onChoiceChange={onChoiceChange}
      valueLabel={options[selectedValue].label}
      first={first}
      last={last}
    />
  );
}
