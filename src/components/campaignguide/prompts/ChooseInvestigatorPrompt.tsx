import React from 'react';
import { View, StyleSheet } from 'react-native';
import { findIndex, flatMap, keys } from 'lodash';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import { StringChoices } from 'actions/types';
import SinglePickerComponent from './SinglePickerComponent';
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
  investigators?: string[];
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
      <BasicButton
        title={t`Proceed`}
        onPress={this._save}
        disabled={required && selectedInvestigator === undefined}
      />
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
      investigators,
    } = this.props;
    const choice = scenarioState.stringChoices(id);
    const selectedIndex = this.getSelectedIndex(scenarioInvestigators, choice);
    const investigatorSet = investigators && new Set(investigators);
    return (
      <>
        <View style={[
          styles.wrapper,
          id !== '$lead_investigator' ? styles.topBorder : {},
        ]}>
          <SinglePickerComponent
            title={title}
            description={description}
            defaultLabel={defaultLabel}
            choices={
              flatMap(scenarioInvestigators, investigator => {
                if (investigatorSet && !investigatorSet.has(investigator.code)) {
                  return [];
                }
                return {
                  text: investigatorToValue ? investigatorToValue(investigator) : investigator.name,
                  effects: [],
                };
              })}
            optional={!required}
            selectedIndex={selectedIndex === -1 ? undefined : selectedIndex}
            editable={choice === undefined}
            onChoiceChange={this._onChoiceChange}
            topBorder
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
