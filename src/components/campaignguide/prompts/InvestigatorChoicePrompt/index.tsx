import React from 'react';
import { Button } from 'react-native';
import { forEach, map } from 'lodash';
import { t } from 'ttag';

import InvestigatorChoiceComponent from './InvestigatorChoiceComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { InvestigatorChoices } from 'actions/types';
import CardTextComponent from 'components/card/CardTextComponent';
import { Choice } from 'data/scenario/types';

interface Props {
  id: string;
  text?: string;
  choices: Choice[];
  optional: boolean;
}

interface State {
  selectedChoice: {
    [code: string]: number | undefined;
  };
}

export default class InvestigatorChoicePrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedChoice: {},
    };
  }

  _onChoiceChange = (code: string, choice: number) => {
    this.setState({
      selectedChoice: {
        ...this.state.selectedChoice,
        [code]: choice,
      },
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedChoice } = this.state;
    const choices: InvestigatorChoices = {};
    forEach(selectedChoice, (idx, code) => {
      if (idx !== undefined && idx !== -1) {
        choices[code] = [idx];
      }
    })
    this.context.scenarioState.setInvestigatorChoice(id, choices);
  };

  render() {
    const { id, choices, text, optional } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasInvestigatorChoice(id);
          return (
            <>
              <SetupStepWrapper>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(investigatorDecks, (investigator, idx) => {
                return (
                  <InvestigatorChoiceComponent
                    key={idx}
                    choices={choices}
                    choice={selectedChoice[investigator.investigator.code] || (optional ? -1 : 0)}
                    investigator={investigator.investigator}
                    onChoiceChange={this._onChoiceChange}
                    optional={optional}
                    editable={!hasDecision}
                  />
                );
              }) }
              { !hasDecision && <Button title={t`Save`} onPress={this._save} /> }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
