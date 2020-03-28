import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { findIndex, keys, map } from 'lodash';
import { t } from 'ttag';

import { ListChoices } from 'actions/types';
import PickerComponent from './PickerComponent';
import { InvestigatorDeck } from 'data/scenario';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';

interface Props {
  id: string;
  title: string;
  description?: string;
  defaultLabel?: string;
  required?: boolean;
  renderResults?: (investigator?: InvestigatorDeck) => React.ReactNode;
}

interface State {
  selectedInvestigator?: string;
}

export default class ChooseInvestigatorPrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;
  state: State = {};

  _onChoiceChange = (
    index: number
  ) => {
    const selectedInvestigator = index === -1 ?
      undefined :
      this.context.investigatorDecks[index].investigator.code;
    this.setState({
      selectedInvestigator,
    });
  };

  _save = () => {
    const { id } = this.props;
    const { selectedInvestigator } = this.state;
    this.context.scenarioState.setChoiceList(
      id,
      selectedInvestigator === undefined ? {} : {
        [selectedInvestigator]: [0],
      }
    );
  };

  renderSaveButton() {
    const { required } = this.props;
    const { selectedInvestigator } = this.state;
    return (
      <Button
        title={t`Save`}
        onPress={this._save}
        disabled={required && selectedInvestigator === undefined}
      />
    );
  }

  getSelectedIndex(
    investigatorDecks: InvestigatorDeck[],
    choice?: ListChoices
  ): number {
    if (choice !== undefined) {
      const investigators = keys(choice);
      if (!investigators.length) {
        return -1;
      }
      const code = investigators[0];
      return findIndex(
        investigatorDecks,
        ({ investigator }) => investigator.code === code
      );
    }
    return findIndex(
      investigatorDecks,
      ({ investigator }) => investigator.code === this.state.selectedInvestigator
    );
  }

  render() {
    const { id, description, title, renderResults, required, defaultLabel } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ investigatorDecks, scenarioState }: ScenarioGuideContextType) => {
          const choice = scenarioState.choiceList(id);
          const selectedIndex = this.getSelectedIndex(investigatorDecks, choice);
          return (
            <>
              <View style={styles.wrapper}>
                <PickerComponent
                  title={title}
                  description={description}
                  defaultLabel={defaultLabel}
                  choices={
                    map(investigatorDecks, ({ investigator }) => {
                      return {
                        text: investigator.name,
                        effects: [],
                      };
                    })}
                  optional={!required}
                  selectedIndex={selectedIndex === -1 ? undefined : selectedIndex}
                  editable={choice === undefined}
                  onChoiceChange={this._onChoiceChange}
                />
              </View>
              { choice !== undefined ?
                // TODO: need to handle no-choice here?
                (!!renderResults && renderResults(
                  selectedIndex === -1 ? undefined : investigatorDecks[selectedIndex]
                )) :
                this.renderSaveButton()
              }
            </>
          );
        } }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
});
