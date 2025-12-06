import { useCallback, useContext, useState } from 'react';
import { filter } from 'lodash';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { usePickerDialog, Item } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { cardToPrintingItem } from '@components/deck/controls/investigatorPrintingItems';
import { PlayerCardContext } from '@data/sqlite/PlayerCardContext';

interface Props {
  onSelectPrinting: (card: Card) => void;
  includeParallel?: boolean;
}

export default function useInvestigatorPrintingSelector({
  onSelectPrinting,
  includeParallel,
}: Props) {
  const { colors } = useContext(StyleContext);
  const { db } = useContext(DatabaseContext);
  const [printingItems, setPrintingItems] = useState<Item<Card>[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card>();

  const onChoicePicked = useCallback((card: Card) => {
    onSelectPrinting(card);
  }, [onSelectPrinting]);

  const [dialog, showPickerDialog] = usePickerDialog({
    title: t`Select version`,
    items: printingItems,
    selectedValue: selectedCard,
    onValueChange: onChoicePicked,
  });
  const { investigatorSets } = useContext(PlayerCardContext);

  const showDialog = useCallback(async(card: Card): Promise<boolean> => {
    if (card.type_code !== 'investigator') {
      return false;
    }

    try {
      // Fetch alternate printings imperatively
      const investigatorSet = investigatorSets?.find(set => set.code === card.code);

      if (!investigatorSet || investigatorSet.alternate_codes.length <= 1) {
        return false;
      }

      // Fetch all the alternate cards
      const alternates = await db.getCardsByCodes(investigatorSet.getAllCodes());

      // Filter out parallel investigators
      const elgibilePrintings = includeParallel ? alternates : filter(alternates, c => !c.alternate_of_code);

      if (elgibilePrintings.length <= 1) {
        return false;
      }

      // Sort by pack position
      const sortedPrintings = [...elgibilePrintings].sort((a, b) => {
        return (a.position || 0) - (b.position || 0);
      });

      // Create items
      const items: Item<Card>[] = sortedPrintings.map(c => cardToPrintingItem(c, colors));

      setPrintingItems(items);
      setSelectedCard(card);
      showPickerDialog();
      return true;
    } catch (e) {
      console.error('Error fetching alternate printings:', e);
      return false;
    }
  }, [db, colors, showPickerDialog, includeParallel, investigatorSets]);

  return [dialog, showDialog] as const;
}
