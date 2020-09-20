import React from 'react';
import { msgid, ngettext } from 'ttag';
import SettingsSwitch from '@components/core/SettingsSwitch';
import { Deck } from '@actions/types';
import { CardsMap } from '@data/Card';

interface Props {
  deck: Deck;
  value: boolean;
  inverted: boolean;
  onValueChange: (deck: Deck, value: boolean) => void;
  investigators: CardsMap;
  scenarioCount: number;
}

export default class DeckMergeItem extends React.Component<Props> {
  _onValueChange = (value: boolean) => {
    const { deck, inverted, onValueChange } = this.props;
    onValueChange(deck, inverted ? !value : value);
  };

  description() {
    const { deck, investigators, scenarioCount } = this.props;
    const investigator = investigators[deck.investigator_code];
    if (!investigator) {
      return undefined;
    }
    if (scenarioCount <= 1) {
      return investigator.name;
    }
    return ngettext(
      msgid`(${investigator.name} - ${scenarioCount} scenario`,
      `${investigator.name} - ${scenarioCount} scenarios`,
      scenarioCount
    );
  }

  render() {
    const { deck, inverted, value } = this.props;
    return (
      <SettingsSwitch
        title={deck.name}
        description={this.description()}
        value={inverted ? !value : value}
        onValueChange={this._onValueChange}
      />
    );
  }
}