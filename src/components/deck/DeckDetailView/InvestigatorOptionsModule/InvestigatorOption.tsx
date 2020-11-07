import React, { useCallback } from 'react';
import { indexOf } from 'lodash';
import { t } from 'ttag';

import DeckSizeSelectPicker from './DeckSizeSelectPicker';
import FactionSelectPicker from './FactionSelectPicker';
import { DeckMeta } from '@actions/types';
import Card from '@data/Card';
import DeckOption from '@data/DeckOption';

interface Props {
  investigator: Card;
  option: DeckOption;
  meta: DeckMeta;
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  editWarning: boolean;
  disabled?: boolean;
}

export default function InvestigatorOption({
  investigator,
  option,
  meta,
  setMeta,
  editWarning,
  disabled,
}: Props) {
  const onChange = useCallback((selection: string) => {
    if (option.faction_select && option.faction_select.length) {
      setMeta('faction_selected', selection);
    } else if (option.deck_size_select && option.deck_size_select.length) {
      setMeta('deck_size_selected', selection);
    }
  }, [option, setMeta]);

  if (option.faction_select && option.faction_select.length) {
    const selection = (
      meta.faction_selected &&
      indexOf(option.faction_select, meta.faction_selected) !== -1
    ) ? meta.faction_selected : undefined;
    return (
      <FactionSelectPicker
        name={DeckOption.optionName(option) || t`Select Faction`}
        factions={option.faction_select}
        onChange={onChange}
        selection={selection}
        investigatorFaction={investigator.faction_code}
        disabled={disabled}
        editWarning={editWarning}
      />
    );
  }
  if (option.deck_size_select && option.deck_size_select.length) {
    const selection = (
      meta.deck_size_selected &&
      indexOf(option.deck_size_select, meta.deck_size_selected) !== -1
    ) ? meta.deck_size_selected : undefined;
    return (
      <DeckSizeSelectPicker
        name={DeckOption.optionName(option) || t`Select Deck Size`}
        sizes={option.deck_size_select}
        onChange={onChange}
        selection={selection}
        investigatorFaction={investigator.faction_code}
        disabled={disabled}
        editWarning={editWarning}
      />
    );
  }
  // Don't know how to render this 'choice'.
  return null;
}
