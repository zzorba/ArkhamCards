import React from 'react';
import { indexOf } from 'lodash';
import { t } from 'ttag';

import DeckSizeSelectPicker from './DeckSizeSelectPicker';
import FactionSelectPicker from './FactionSelectPicker';
import { DeckMeta } from 'actions/types';
import Card from 'data/Card';
import DeckOption from 'data/DeckOption';

interface Props {
  investigator: Card;
  option: DeckOption;
  meta: DeckMeta;
  setMeta: (key: string, value: string) => void;
  editWarning: boolean;
  disabled?: boolean;
}

export default class InvestigatorOption extends React.Component<Props> {
  _onChange = (selection: string) => {
    const {
      option,
      setMeta,
    } = this.props;
    if (option.faction_select && option.faction_select.length) {
      setMeta('faction_selected', selection);
    } else if (option.deck_size_select && option.deck_size_select.length) {
      setMeta('deck_size_selected', selection);
    }
  };

  render() {
    const {
      investigator,
      option,
      meta,
      disabled,
      editWarning,
    } = this.props;
    if (option.faction_select && option.faction_select.length) {
      const selection = (
        meta.faction_selected &&
        indexOf(option.faction_select, meta.faction_selected) !== -1
      ) ? meta.faction_selected : undefined;
      return (
        <FactionSelectPicker
          name={option.name() || t`Select Faction`}
          factions={option.faction_select}
          onChange={this._onChange}
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
          name={option.name() || t`Select Deck Size`}
          sizes={option.deck_size_select}
          onChange={this._onChange}
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
}
