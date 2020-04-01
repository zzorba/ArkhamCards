import React from 'react';
import { Button } from 'react-native';
import { t } from 'ttag';

import PickerComponent from '../PickerComponent';
import ChooseOneListComponent from '../ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, ChooseOneInput } from 'data/scenario/types';
import { chooseOneInputChoices } from 'data/scenario/inputHelper';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

interface Props {
  id: string;
  campaignLog: GuidedCampaignLog;
  bulletType?: BulletType;
  text?: string;
  input: ChooseOneInput;
  optional?: boolean;
}

interface State {
  selectedChoice?: number;
}

export default class ChooseOnePrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;
  state: State = {};

  _onChoiceChange = (choice: number) => {
    this.setState({
      selectedChoice: choice,
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedChoice } = this.state;
    if (selectedChoice !== undefined) {
      this.context.scenarioState.setChoice(id, selectedChoice);
    }
  };

  render() {
    const { id, input, text, bulletType, campaignLog } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const decision = scenarioState.choice(id);
          const selectedChoice = decision !== undefined ? decision : this.state.selectedChoice;
          const choices = chooseOneInputChoices(input, campaignLog);
          return (
            <>
              { input.style === 'picker' ? (
                <PickerComponent
                  title={selectedChoice === undefined ? (text || '') : ''}
                  choices={choices}
                  selectedIndex={selectedChoice}
                  onChoiceChange={this._onChoiceChange}
                  editable={decision === undefined}
                />
              ) : (
                <>
                  <SetupStepWrapper bulletType={bulletType}>
                    <CardTextComponent
                      text={text || t`The investigators must decide (choose one)`}
                    />
                  </SetupStepWrapper>
                  <ChooseOneListComponent
                    choices={choices}
                    selectedIndex={selectedChoice}
                    onSelect={this._onChoiceChange}
                    editable={decision === undefined}
                  />
                </>
              ) }
              { decision === undefined && (
                <Button
                  title={t`Save`}
                  onPress={this._save}
                  disabled={selectedChoice === undefined}
                />
              ) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
