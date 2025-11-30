import React, { useCallback, useContext, useMemo } from 'react';
import { filter, find } from 'lodash';
import { t } from 'ttag';

import { useAlternatePrintings } from '@components/card/CardDetailView/useAlternatePrintings';
import Card from '@data/types/Card';
import { usePickerDialog } from '../dialogs';
import DeckPickerStyleButton from './DeckPickerStyleButton';
import StyleContext from '@styles/StyleContext';
import { cardToPrintingItem } from './investigatorPrintingItems';

interface Props {
  investigator: Card;
  selectedCode: string;
  onSelectPrinting: (code: string) => void;
  disabled?: boolean;
  first?: boolean;
  last?: boolean;
}

export default function InvestigatorPrintingControl({
  investigator,
  selectedCode,
  onSelectPrinting,
  disabled,
  first,
  last,
}: Props) {
  const { colors } = useContext(StyleContext);
  const [allPrintings] = useAlternatePrintings(investigator);

  // Filter out parallel investigators (those are handled by the parallel/alternate options)
  const nonParallelPrintings = useMemo(() => {
    return filter(allPrintings, card => {
      // Exclude cards with alternate_of_code since those are parallel investigators
      return !card.alternate_of_code;
    });
  }, [allPrintings]);

  // Sort by pack position (chronological order)
  const sortedPrintings = useMemo(() => {
    return [...nonParallelPrintings].sort((a, b) => {
      return (a.position || 0) - (b.position || 0);
    });
  }, [nonParallelPrintings]);

  const printingItems = useMemo(() => {
    return sortedPrintings.map(card => cardToPrintingItem(card, colors));
  }, [sortedPrintings, colors]);

  const selectedPrinting = useMemo(() => {
    return find(sortedPrintings, card => card.code === selectedCode);
  }, [sortedPrintings, selectedCode]);

  const onChoicePicked = useCallback((card: Card) => {
    onSelectPrinting(card.code);
  }, [onSelectPrinting]);

  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Printing`,
    items: printingItems,
    selectedValue: selectedPrinting,
    onValueChange: onChoicePicked,
  });

  // Don't show if only one printing
  if (sortedPrintings.length <= 1) {
    return null;
  }

  return (
    <>
      <DeckPickerStyleButton
        icon="card-outline"
        editable={!disabled}
        title={t`Alternate printing`}
        valueLabel={selectedPrinting?.pack_name}
        onPress={showDialog}
        first={first}
        last={last}
      />
      {dialog}
    </>
  );
}
