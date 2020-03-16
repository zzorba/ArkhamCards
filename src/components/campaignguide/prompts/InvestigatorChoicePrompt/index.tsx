import React from 'react';
import { Button } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import InvestigatorChoiceComponent from './InvestigatorChoiceComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
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

  };

  render() {
    const { choices, text, optional } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks }: ScenarioGuideContextType) => (
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
                />
              );
            }) }
            <Button title={t`Save`} onPress={this._save} />
          </>
        ) }
      </ScenarioGuideContext.Consumer>
    );
  }
}
