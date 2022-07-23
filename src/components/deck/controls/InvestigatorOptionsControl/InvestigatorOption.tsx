import React, { useCallback } from 'react';
import { findIndex, indexOf } from 'lodash';
import { t } from 'ttag';

import DeckSizeSelectPicker from './DeckSizeSelectPicker';
import FactionSelectPicker from './FactionSelectPicker';
import { DeckMeta } from '@actions/types';
import DeckOption from '@data/types/DeckOption';
import OptionSelectPicker from './OptionSelectPicker';
import { FactionCodeType } from '@app_constants';

interface Props {
  option: DeckOption;
  meta: DeckMeta;
  setMeta: (key: string, value?: string) => void;
  editWarning: boolean;
  disabled?: boolean;
  first: boolean;
  last?: boolean;
}

export default function InvestigatorOption({
  option,
  meta,
  setMeta,
  editWarning,
  disabled,
  first,
  last,
}: Props) {
  const onChange = useCallback((selection: string) => {
    if (option.id) {
      setMeta(option.id, selection);
    } else {
      if (option.faction_select && option.faction_select.length) {
        setMeta('faction_selected', selection);
      } else if (option.deck_size_select && option.deck_size_select.length) {
        setMeta('deck_size_selected', selection);
      } else if (option.option_select) {
        setMeta('option_selected', selection);
      }
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
        last={last}
      />
    );
  }
  if (option.faction_select && option.faction_select.length) {
    const choice = option.id ? (meta[option.id] as FactionCodeType) : meta.faction_selected;
    const selection = (
      choice &&
      indexOf(option.faction_select, choice) !== -1
    ) ? choice : undefined;
    return (
      <FactionSelectPicker
        name={DeckOption.optionName(option) || t`Select Faction`}
        factions={option.faction_select}
        onChange={onChange}
        selection={selection || option.faction_select[0]}
        disabled={disabled}
        editWarning={editWarning}
        first={first}
        last={last}
      />
    );
  }
  if (option.option_select && option.option_select.length) {
    const selection = (
      meta.option_selected &&
      findIndex(option.option_select, o => o.id === meta.option_selected) !== -1
    ) ? meta.option_selected : undefined;
    return (
      <OptionSelectPicker
        name={DeckOption.optionName(option) || t`Select Option`}
        options={option.option_select}
        onChange={onChange}
        selection={selection || option.option_select[0].id}
        disabled={disabled}
        editWarning={editWarning}
        first={first}
        last={last}
      />
    )
  }
  // Don't know how to render this 'choice'.
  return null;
}
