import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find } from 'lodash';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import ScenarioStateHelper from '../ScenarioStateHelper';
import StepsComponent from '../StepsComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { Effect, Option } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  id: string;
  prompt: string;
  min?: number;
  max?: number;
  options?: Option[];
  effects?: Effect[];
  text?: string;
}

interface State {
  value: number;
}

export default class NumberPrompt extends React.Component<Props, State> {
  static contextType = ScenarioGuideContext;
  context!: ScenarioGuideContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.min || 0,
    };
  }

  _inc = () => {
    this.setState(state => {
      const newValue = state.value + 1;
      return {
        value: this.props.max ? Math.min(newValue, this.props.max) : newValue,
      };
    });
  };

  _dec = () => {
    this.setState(state => {
      return {
        value: Math.max(state.value - 1, this.props.min || 0),
      };
    });
  };

  _submit = () => {
    const {
      id,
    } = this.props;
    this.context.scenarioState.setCount(id, this.state.value);
  };

  renderCount() {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center]}>
          { this.state.value }
        </Text>
      </View>
    );
  }

  renderPrompt(scenarioState: ScenarioStateHelper) {
    const { id, prompt, text } = this.props;
    return (
      <>
        <CardTextComponent text={prompt} />
        { scenarioState.hasCount(id) ? (
          <>
            <Text>
              { scenarioState.count(id) }
            </Text>
            { !!text && <CardTextComponent text={text} /> }
          </>
        ) : (
          <>
            <PlusMinusButtons
              count={this.state.value}
              limit={this.props.max}
              min={this.props.min}
              onIncrement={this._inc}
              onDecrement={this._dec}
              countRender={this.renderCount()}
            />
            <Button title="Done" onPress={this._submit} />
          </>
        ) }
      </>
    );
  }


  renderCorrectResults(scenarioState: ScenarioStateHelper, stepsOnly: boolean) {
    const {
      id,
      options,
      effects,
    } = this.props;
    if (options) {
      if (!scenarioState.hasCount(id)) {
        return null;
      }
      const count = scenarioState.count(id);
      const theOption = find(options, option => option.numCondition === count);
      if (!theOption) {
        return null;
      }
      return this.renderResult(stepsOnly, theOption);
    }
    if (effects && !stepsOnly) {
      // We summarize the text of the effects in the guide text for number
      // inputs.
      return (
        <EffectsComponent effects={effects} skipCampaignLog />
      );
    }
    return null;
  }

  renderResult(stepsOnly: boolean, choice: Option) {
    if (choice.steps) {
      return stepsOnly ? (
        <StepsComponent
          steps={choice.steps}
        />
      ) : null;
    }
    if (choice.effects) {
      return stepsOnly ? null : (
        <EffectsComponent effects={choice.effects} />
      );
    }
    if (choice.resolution) {
      return stepsOnly ? null : (
        <Text>Resolution { choice.resolution }</Text>
      );
    }
    return <Text>Unknown!</Text>;
  }

  render() {
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => (
          <>
            <SetupStepWrapper>
              { this.renderPrompt(scenarioState) }
              { this.renderCorrectResults(scenarioState, false) }
            </SetupStepWrapper>
            { this.renderCorrectResults(scenarioState, true) }
          </>
        ) }
      </ScenarioGuideContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: 4,
    paddingRight: 4,
    minWidth: 40,
  },
});
