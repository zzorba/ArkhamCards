import React from 'react';
import { t } from 'ttag';

import FactionSelectPicker from './FactionSelectPicker';
import { Deck } from '../../actions/types';
import Card from '../../data/Card';
import DeckOption from '../../data/DeckOption';

interface Props {
  investigator: Card;
  option: DeckOption;
  deck: Deck;
}

export default class InvestigatorOptionsModule extends React.Component<Props> {
  _onChange = (selection: string) => {

  };

  render() {
    const {
      investigator,
      option,
    } = this.props;
    if (option.faction_select && option.faction_select.length) {
      return (
        <FactionSelectPicker
          name={option.name() || t`Select Faction`}
          factions={option.faction_select}
          onChange={this._onChange}
          investigatorFaction={investigator.faction_code}
        />
      );
    }
    // Don't know how to render this 'choice'.
    return null;
  }
}
