import { useCallback, useContext, useState } from 'react';
import { filter } from 'lodash';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { usePickerDialog, Item } from '@components/deck/dialogs';
import StyleContext from '@styles/StyleContext';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { cardToPrintingItem } from '@components/deck/controls/investigatorPrintingItems';

interface Props {
  onSelectPrinting: (card: Card) => void;
}

export default function useInvestigatorPrintingSelector({
  onSelectPrinting,
}: Props) {
  const { colors } = useContext(StyleContext);
  const { db } = useContext(DatabaseContext);
  const [printingItems, setPrintingItems] = useState<Item<Card>[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card>();

  const onChoicePicked = useCallback((card: Card) => {
    onSelectPrinting(card);
  }, [onSelectPrinting]);

  const [dialog, showPickerDialog] = usePickerDialog({
    title: t`Select Printing`,
    items: printingItems,
    selectedValue: selectedCard,
    onValueChange: onChoicePicked,
  });

  const showDialog = useCallback(async(card: Card): Promise<boolean> => {
    if (card.type_code !== 'investigator') {
      return false;
    }

    try {
      // Fetch alternate printings imperatively
      const investigatorSetRepo = await db.investigatorSets();
      const investigatorSet = await investigatorSetRepo.findOne({
        where: { code: card.code },
      });

      if (!investigatorSet || investigatorSet.alternate_codes.length <= 1) {
        return false;
      }

      // Fetch all the alternate cards
      const cardsRepo = await db.cards();
      const alternates = await cardsRepo
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.linked_card', 'linked_card')
        .where('c.code IN (:...codes)', { codes: investigatorSet.alternate_codes })
        .andWhere('c.taboo_set_id IS NULL')
        .getMany();

      // Filter out parallel investigators
      const nonParallelPrintings = filter(alternates, c => !c.alternate_of_code);

      if (nonParallelPrintings.length <= 1) {
        return false;
      }

      // Sort by pack position
      const sortedPrintings = [...nonParallelPrintings].sort((a, b) => {
        return (a.position || 0) - (b.position || 0);
      });

      // Create items
      const items: Item<Card>[] = sortedPrintings.map(c => cardToPrintingItem(c, colors));

      setPrintingItems(items);
      setSelectedCard(card);
      showPickerDialog();
      return true;
    } catch (e) {
      console.log('Error fetching alternate printings:', e);
      return false;
    }
  }, [db, colors, showPickerDialog]);

  return [dialog, showDialog] as const;
}
