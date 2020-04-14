import React from 'react';
import { filter, keys, flatMap, map, range, uniq, sortBy } from 'lodash';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import MultiPickerComponent from 'components/campaignguide/prompts/MultiPickerComponent';
import { WeaknessCardProps } from 'components/weakness/withWeaknessCards';
import CampaignGuideContext, { CampaignGuideContextType } from 'components/campaignguide/CampaignGuideContext';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';

interface Props extends WeaknessCardProps {
  scenarioState: ScenarioStateHelper;
  choices?: string[];
  save: (traits: string[]) => void;
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
    const { cardsMap } = this.props;
    return sortBy(
      uniq(
        flatMap(keys(cardsMap), code => {
          const card = cardsMap[code];
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
          defaultLabel={t`All`}
        />
        { this.renderButton() }
      </>
    );
  }
}
