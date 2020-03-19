import React from 'react';
import { Button } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import PickerComponent from '../PickerComponent';
import SetupStepWrapper from '../../SetupStepWrapper';
import { InvestigatorDeck } from '../../types';
import { FACTION_COLORS, FACTION_LIGHT_GRADIENTS } from 'constants';
import CardTextComponent from 'components/card/CardTextComponent';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import { Effect } from 'data/scenario/types';

interface Props {
  id: string;
  title: string;
  required?: boolean;
  renderResults?: (investigator: InvestigatorDeck) => React.ReactNode;
}

interface State {
  selectedIndex?: number;
}

export default class ChooseInvestigatorPrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;
  state: State = {};

  id() {
    return `${this.props.id}_investigator`;
  }

  _onChoiceChange = (
    index: number
  ) => {
    this.setState({
      selectedIndex: index,
    });
  };

  _save = () => {
    const { selectedIndex } = this.state;
    this.context.scenarioState.setChoice(this.id(), selectedIndex === undefined ? -1 : selectedIndex);
  };

  renderSaveButton() {
    const { required } = this.props;
    const { selectedIndex } = this.state;
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
        disabled={required && selectedIndex === undefined}
      />
    );
  }

  render() {
    const { title, renderResults } = this.props;
    const id = this.id();
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          const hasDecision = scenarioState.hasChoice(id);
          const selectedIndex = hasDecision ?
            scenarioState.choice(id) :
            this.state.selectedIndex;
          return (
            <>
              <PickerComponent
                title={title}
                choices={
                  map(investigatorDecks, ({ investigator }) => {
                    return {
                      text: investigator.name,
                      effects: [],
                    };
                  })}
                selectedIndex={selectedIndex === -1 ? undefined : selectedIndex}
                editable={!hasDecision}
                onChoiceChange={this._onChoiceChange}
              />
              { hasDecision ?
                  (!!renderResults && renderResults(investigatorDecks[scenarioState.choice(id)])) :
                  this.renderSaveButton()
              }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}
