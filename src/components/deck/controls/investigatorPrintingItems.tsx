import React from 'react';

import Card from '@data/types/Card';
import { Item } from '@components/deck/dialogs';
import InvestigatorImage from '@components/core/InvestigatorImage';
import EncounterIcon from '@icons/EncounterIcon';

export function cardToPrintingItem(card: Card, colors: { D20: string }): Item<Card> {
  return {
    title: card.pack_name ?? '',
    value: card,
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
  };
}
