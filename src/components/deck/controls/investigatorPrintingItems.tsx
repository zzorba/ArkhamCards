import React from 'react';
import { t } from 'ttag';

import Card from '@data/types/Card';
import { Item } from '@components/deck/dialogs';
import InvestigatorImage from '@components/core/InvestigatorImage';
import EncounterIcon from '@icons/EncounterIcon';
import { AGATHA_MYSTIC_CODE, AGATHA_SEEKER_CODE } from '@data/deck/specialCards';

/**
 * Get the display name for an investigator printing.
 * Handles special cases and removes "Investigator Expansion" suffix.
 */
export function getPrintingDisplayName(card: Card): string {
  // Special cases for specific investigator printings
  if (card.code === AGATHA_SEEKER_CODE) {
    return t`Seeker`;
  }
  if (card.code === AGATHA_MYSTIC_CODE) {
    return t`Mystic`;
  }

  // Remove "Investigator Expansion" from pack name
  return (card.pack_name ?? '').replace(t`Investigator Expansion`, '').trim();
}

export function cardToPrintingItem(card: Card, colors: { D20: string }): Item<Card> {
  return {
    title: getPrintingDisplayName(card),
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
