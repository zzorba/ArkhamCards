import React from 'react';
import { Button, Text } from 'react-native';
import { t } from 'ttag';

import ChoiceListComponent from './ChoiceListComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import StepsComponent from '../../StepsComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import { Choice } from 'data/scenario/types';

interface Props {
  id: string;
  text?: string;
  choices: Choice[];
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

  renderResults(selectedChoice: number) {
    const { choices } = this.props;
    const choice = choices[selectedChoice];
    if (choice.steps) {
      return (
        <StepsComponent
          steps={choice.steps}
        />
      );
    }
    return <Text>Unknown results for choice</Text>;
  }

  render() {
    const { id, choices, text } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasChoice(id);
          const selectedChoice = hasDecision ?
            scenarioState.choice(id) :
            this.state.selectedChoice;
          return (
            <>
              <SetupStepWrapper>
                <CardTextComponent
                  text={text || t`The investigators must decide (choose one)`}
                />
              </SetupStepWrapper>
              <ChoiceListComponent
                choices={choices}
                selectedIndex={selectedChoice}
                onSelect={this._onChoiceChange}
                editable={!hasDecision}
              />
              { hasDecision ? (
                this.renderResults(scenarioState.choice(id))
              ) : (
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
