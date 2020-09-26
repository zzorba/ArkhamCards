import React from 'react';
import { filter, flatMap, map, range, uniq, sortBy } from 'lodash';
import { c, t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import MultiPickerComponent from '@components/core/MultiPickerComponent';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import Card from '@data/Card';

interface Props {
  scenarioState: ScenarioStateHelper;
  choices?: string[];
  save: (traits: string[]) => void;
  weaknessCards: Card[];
}

interface State {
  selectedIndex: number[];
}

export default class SelectWeaknessTraitsComponent extends React.Component<Props, State> {
  static contextType = CampaignGuideContext;
  context!: CampaignGuideContextType;

  state: State = {
    selectedIndex: [],
  };

  _onChoiceChange = (selectedIndex: number[]) => {
    this.setState({
      selectedIndex,
    });
  };

  allTraits(): string[] {
    const { weaknessCards } = this.props;
    return sortBy(
      uniq(
        flatMap(weaknessCards, card => {
          if (!card || !card.traits) {
            return [];
          }
          return filter(
            map(
              card.traits.split('.'),
              trait => trait.trim()
            )
          );
        })
      )
    );
  }

  _save = () => {
    const { save } = this.props;
    const { selectedIndex } = this.state;
    const traits = this.allTraits();
    save(
      map(selectedIndex, index => traits[index])
    );
  };

  renderButton() {
    const { choices } = this.props;
    if (choices !== undefined) {
      return null;
    }
    return (
      <BasicButton
        title={t`Proceed`}
        onPress={this._save}
      />
    );
  }

  render() {
    const { choices } = this.props;
    return (
      <>
        <MultiPickerComponent
          title={t`Traits`}
          editable={choices === undefined}
          topBorder
          selectedIndex={
            choices ? range(0, choices.length) : this.state.selectedIndex}
          onChoiceChange={this._onChoiceChange}
          choices={map(choices || this.allTraits(),
            trait => {
              return {
                text: trait,
              };
            }
          )}
          defaultLabel={c('Weakness Card').t`All`}
        />
        { this.renderButton() }
      </>
    );
  }
}
