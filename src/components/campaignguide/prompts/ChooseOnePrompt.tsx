import React from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SinglePickerComponent from '@components/core/SinglePickerComponent';
import ChooseOneListComponent from './ChooseOneListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import SetupStepWrapper from '../SetupStepWrapper';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import { BulletType } from '@data/scenario/types';
import { DisplayChoice } from '@data/scenario';
import space from '@styles/space';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  choices: DisplayChoice[];
  picker?: boolean;
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
    const { id, choices, picker, text, bulletType } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const decision = scenarioState.choice(id);
          const selectedChoice = decision !== undefined ? decision : this.state.selectedChoice;
          return (
            <>
              { picker ? (
                <SinglePickerComponent
                  title={selectedChoice === undefined ? (text || '') : ''}
                  choices={choices}
                  selectedIndex={selectedChoice}
                  onChoiceChange={this._onChoiceChange}
                  editable={decision === undefined}
                  topBorder
                />
              ) : (
                <>
                  <SetupStepWrapper bulletType={bulletType}>
                    <CampaignGuideTextComponent
                      text={text || t`The investigators must decide (choose one):`}
                    />
                  </SetupStepWrapper>
                  <View style={[space.paddingTopS, space.paddingBottomS]}>
                    <ChooseOneListComponent
                      choices={choices}
                      selectedIndex={selectedChoice}
                      onSelect={this._onChoiceChange}
                      editable={decision === undefined}
                    />
                  </View>
                </>
              ) }
              { decision === undefined && (
                <BasicButton
                  title={t`Proceed`}
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
