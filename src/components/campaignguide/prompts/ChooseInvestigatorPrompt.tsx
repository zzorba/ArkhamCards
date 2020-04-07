import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { findIndex, keys, map } from 'lodash';
import { t } from 'ttag';

import { StringChoices } from 'actions/types';
import PickerComponent from './PickerComponent';
import Card from 'data/Card';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import ScenarioStepContext, { ScenarioStepContextType } from '../ScenarioStepContext';

interface Props {
  id: string;
  title: string;
  choiceId: string;
  description?: string;
  defaultLabel?: string;
  required?: boolean;
  investigatorToValue?: (card: Card) => string;
  renderResults?: (investigator?: Card) => React.ReactNode;
}

interface State {
  selectedInvestigator?: string;
}

export default class ChooseInvestigatorPrompt extends React.Component<Props, State> {
  static contextType = ScenarioStepContext;
  context!: ScenarioStepContextType;

  constructor(props: Props, context: ScenarioStepContextType) {
    super(props);

    const selectedInvestigator = props.required && context.scenarioInvestigators.length > 0 ?
      context.scenarioInvestigators[0].code :
      undefined;
    this.state = {
      selectedInvestigator,
    };
  }

  _onChoiceChange = (
    index: number
  ) => {
    const selectedInvestigator = index === -1 ?
      undefined :
      this.context.scenarioInvestigators[index].code;
    this.setState({
      selectedInvestigator,
    });
  };

  _save = () => {
    const { id, choiceId } = this.props;
    const { selectedInvestigator } = this.state;
    this.context.scenarioState.setStringChoices(
      id,
      selectedInvestigator === undefined ? {} : {
        [selectedInvestigator]: [choiceId],
      }
    );
  };

  renderSaveButton() {
    const { required } = this.props;
    const { selectedInvestigator } = this.state;
    return (
      <View style={styles.buttonWrapper}>
        <Button
          title={t`Proceed`}
          onPress={this._save}
          disabled={required && selectedInvestigator === undefined}
        />
      </View>
    );
  }

  getSelectedIndex(
    scenarioInvestigators: Card[],
    choice?: StringChoices
  ): number {
    if (choice !== undefined) {
      const investigators = keys(choice);
      if (!investigators.length) {
        return -1;
      }
      const code = investigators[0];
      return findIndex(
        scenarioInvestigators,
        investigator => investigator.code === code
      );
    }
    return findIndex(
      scenarioInvestigators,
      investigator => investigator.code === this.state.selectedInvestigator
    );
  }

  renderContent(
    scenarioState: ScenarioStateHelper,
    scenarioInvestigators: Card[]
  ) {
    const {
      id,
      description,
      title,
      renderResults,
      required,
      defaultLabel,
      investigatorToValue,
    } = this.props;
    const choice = scenarioState.stringChoices(id);
    const selectedIndex = this.getSelectedIndex(scenarioInvestigators, choice);
    return (
      <>
        <View style={styles.wrapper}>
          <PickerComponent
            title={title}
            description={description}
            defaultLabel={defaultLabel}
            choices={
              map(scenarioInvestigators, investigator => {
                return {
                  text: investigatorToValue ? investigatorToValue(investigator) : investigator.name,
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
            selectedIndex === -1 ? undefined : scenarioInvestigators[selectedIndex]
          )) :
          this.renderSaveButton()
        }
      </>
    );
  }

  render() {
    return (
      <ScenarioStepContext.Consumer>
        { ({ scenarioState, scenarioInvestigators }: ScenarioStepContextType) => {
          return this.renderContent(scenarioState, scenarioInvestigators);
        } }
      </ScenarioStepContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  buttonWrapper: {
    padding: 8,
  },
});
