import React, { useCallback } from 'react';
import { indexOf } from 'lodash';
import { t } from 'ttag';

import DeckSizeSelectPicker from './DeckSizeSelectPicker';
import FactionSelectPicker from './FactionSelectPicker';
import { DeckMeta } from '@actions/types';
import DeckOption from '@data/types/DeckOption';

interface Props {
  option: DeckOption;
  meta: DeckMeta;
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  editWarning: boolean;
  disabled?: boolean;
  first: boolean;
}

export default function InvestigatorOption({
  option,
  meta,
  setMeta,
  editWarning,
  disabled,
  first,
}: Props) {
  const onChange = useCallback((selection: string) => {
    if (option.faction_select && option.faction_select.length) {
      setMeta('faction_selected', selection);
    } else if (option.deck_size_select && option.deck_size_select.length) {
      setMeta('deck_size_selected', selection);
    }
  }, [option, setMeta]);
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
        selection={selection || option.deck_size_select[0]}
        disabled={disabled}
        editWarning={editWarning}
        first={first}
      />
    );
  }
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
        selection={selection || option.faction_select[0]}
        disabled={disabled}
        editWarning={editWarning}
        first={first}
      />
    );
  }
  // Don't know how to render this 'choice'.
  return null;
}
