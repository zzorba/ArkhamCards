import React, { useCallback, useMemo } from 'react';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { usePickerDialog } from '@components/deck/dialogs';
import DeckPickerStyleButton from '../DeckPickerStyleButton';

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
  const items = useMemo(() => [
    { title: t`Original front · Original back`, value: 0 },
    { title: t`Parallel front · Original back`, value: 1 },
    { title: t`Original front · Parallel back`, value: 2 },
    { title: t`Parallel front · Parallel back`, value: 3 },
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

  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Parallel Investigator`,
    description: editWarning ? t`Parallel investigator options should only be selected at deck creation time, not between scenarios.` : undefined,
    items,
    selectedValue,
    onValueChange: onChoiceChange,
  });
  return (
    <>
      <DeckPickerStyleButton
        title={t`Parallel`}
        icon="parallel"
        editable={!disabled}
        onPress={showDialog}
        valueLabel={items[selectedValue].title}
        first={first}
        last={last}
      />
      { dialog }
    </>
  );
}
