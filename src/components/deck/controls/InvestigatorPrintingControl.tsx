import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { filter, find } from 'lodash';
import { t } from 'ttag';

import { useAlternatePrintings } from '@components/card/CardDetailView/useAlternatePrintings';
import Card from '@data/types/Card';
import { usePickerDialog, Item } from '../dialogs';
import DeckPickerStyleButton from './DeckPickerStyleButton';
import InvestigatorImage from '@components/core/InvestigatorImage';
import EncounterIcon from '@icons/EncounterIcon';
import StyleContext from '@styles/StyleContext';
import { s } from '@styles/space';

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

  const printingItems: Item[] = useMemo(() => {
    return sortedPrintings.map(card => ({
      title: card.pack_name,
      value: card.code,
      description: card.position !== undefined ? `#${card.position}` : undefined,
      iconNode: (
        <InvestigatorImage size="tiny" card={card} />
      ),
      descriptionNode: (
        <EncounterIcon
          encounter_code={card.cycle_code === 'parallel' ? 'parallel' : card.pack_code}
          size={18}
          color={colors.D20}
        />
      ),
    }));
  }, [sortedPrintings, colors]);

  const selectedPrinting = useMemo(() => {
    return find(sortedPrintings, card => card.code === selectedCode);
  }, [sortedPrintings, selectedCode]);

  const onChoicePicked = useCallback((value: string) => {
    onSelectPrinting(value);
  }, [onSelectPrinting]);

  const [dialog, showDialog] = usePickerDialog({
    title: t`Select Printing`,
    items: printingItems,
    selectedValue: selectedCode,
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
        title={t`Printing`}
        valueLabel={selectedPrinting?.pack_name}
        onPress={showDialog}
        first={first}
        last={last}
      />
      {dialog}
    </>
  );
}
