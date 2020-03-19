import React from 'react';
import { Button } from 'react-native';
import { every, forEach, map } from 'lodash';
import { t } from 'ttag';

import InvestigatorChoiceComponent from './InvestigatorChoiceComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import SetupStepWrapper from '../../SetupStepWrapper';
import { InvestigatorChoices } from 'actions/types';
import { InvestigatorDeck } from 'components/campaignguide/types';
import CardTextComponent from 'components/card/CardTextComponent';
import { BulletType, EffectsChoice } from 'data/scenario/types';

interface Props {
  id: string;
  bulletType?: BulletType;
  text?: string;
  choices: EffectsChoice[];
  optional?: boolean;
  detailed?: boolean
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

  _onChoiceChange = (
    code: string,
    choice: number
  ) => {
    this.setState({
      selectedChoice: {
        ...this.state.selectedChoice,
        [code]: choice === -1 ? undefined : choice,
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

  renderSaveButton(hasDecision: boolean, investigatorDecks: InvestigatorDeck[]) {
    const { detailed } = this.props;
    const { selectedChoice } = this.state;
    if (hasDecision) {
      return null;
    }
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
        disabled={detailed && !every(
          investigatorDecks,
          ({ investigator }) => selectedChoice[investigator.code] !== undefined)
        }
      />
    );

  }

  render() {
    const { id, bulletType, detailed, choices, text, optional } = this.props;
    const { selectedChoice } = this.state;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasInvestigatorChoice(id);
          const defaultChoice = detailed ? undefined : (optional ? -1 : 0);
          return (
            <>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              { map(investigatorDecks, (investigator, idx) => {
                const choice = selectedChoice[investigator.investigator.code];
                return (
                  <InvestigatorChoiceComponent
                    key={idx}
                    choices={choices}
                    choice={choice === undefined ? defaultChoice : choice}
                    investigator={investigator.investigator}
                    onChoiceChange={this._onChoiceChange}
                    optional={!!optional}
                    editable={!hasDecision}
                    detailed={detailed}
                  />
                );
              }) }
              { this.renderSaveButton(hasDecision, investigatorDecks) }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
