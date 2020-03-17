import React from 'react';

import InvestigatorNameRow from '../InvestigatorNameRow';
import Card from 'data/Card';
import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';
import ChoiceListComponent from '../ChooseOnePrompt/ChoiceListComponent';
import PickerComponent from '../PickerComponent';
import { EffectsChoice } from 'data/scenario/types';

interface Props {
  investigator: Card;
  choices: EffectsChoice[];
  choice?: number;
  optional: boolean;
  onChoiceChange: (code: string, index: number) => void;
  editable: boolean;
  detailed?: boolean;
}

export default class InvestigatorChoiceComponent extends React.Component<Props> {
  _onChoiceChange = (idx: number) => {
    const {
      onChoiceChange,
      investigator,
    } = this.props;
    onChoiceChange(
      investigator.code,
      idx
    );
  };

  render() {
    const {
      investigator,
      detailed,
      choices,
      choice,
      editable,
      optional
    } = this.props;
    if (detailed) {
      return (
        <>
          <InvestigatorNameRow
            investigator={investigator}
          />
          <ChoiceListComponent
            choices={choices}
            selectedIndex={choice}
            editable={editable}
            onSelect={this._onChoiceChange}
            tintColor={FACTION_LIGHT_GRADIENTS[investigator.factionCode()][0]}
            buttonColor={FACTION_COLORS[investigator.factionCode()]}
            noBullet
          />
        </>
      )
    }
    return (
      <PickerComponent
        choices={choices}
        choice={choice || -1}
        editable={editable}
        optional={optional}
        title={investigator.name}
        onChoiceChange={this._onChoiceChange}
        colors={{
          backgroundColor: FACTION_COLORS[investigator.factionCode()],
          textColor: '#FFF'
        }}
      />
    );
  }
}
