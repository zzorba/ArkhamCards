import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { find } from 'lodash';
import { t } from 'ttag';

import EffectsComponent from '../EffectsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioStateHelper from '../../ScenarioStateHelper';
import StepsComponent from '../../StepsComponent';
import CardTextComponent from 'components/card/CardTextComponent';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import CampaignGuide from 'data/scenario/CampaignGuide';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
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
  guide: CampaignGuide,
  scenario: ScenarioGuide;
  scenarioState: ScenarioStateHelper;
}

interface State {
  value: number;
}

export default class NumberPrompt extends React.Component<Props, State> {
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
      scenarioState,
    } = this.props;
    scenarioState.setCount(id, this.state.value);
  };

  renderCount() {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center]}>
          {this.state.value}
        </Text>
      </View>
    );
  }

  renderPrompt() {
    const { id, prompt, scenarioState } = this.props;
    return (
      <>
        <CardTextComponent text={prompt} />
        { scenarioState.hasCount(id) ? (
          <Text>
            { scenarioState.count(id) }
          </Text>
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


  renderCorrectResults(stepsOnly: boolean) {
    const {
      id,
      scenarioState,
      options,
      effects,
      text,
      guide,
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
      return (
        <>
          <EffectsComponent
            effects={effects}
            guide={guide}
          />
        </>
      );
    }
    return null;
  }

  renderResult(stepsOnly: boolean, choice: Option) {
    const { scenario, scenarioState, guide } = this.props;
    if (choice.steps) {
      return stepsOnly ? (
        <StepsComponent
          steps={choice.steps}
          guide={guide}
          scenario={scenario}
          scenarioState={scenarioState}
        />
      ) : null;
    }
    if (choice.effects) {
      return stepsOnly ? null : (
        <EffectsComponent
          effects={choice.effects}
          guide={guide}
        />
      );
    }
    if (choice.resolution) {
      return stepsOnly ? null : (
        <Text>Resolution {choice.resolution}</Text>
      )
    }
    return <Text>Unknown!</Text>;
  }

  render() {
    const { text } = this.props;
    return (
      <>
        <SetupStepWrapper>
          { !!text && <CardTextComponent text={text} /> }
          { this.renderPrompt() }
          { this.renderCorrectResults(false) }
        </SetupStepWrapper>
        { this.renderCorrectResults(true) }
      </>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    marginLeft: 32,
    marginRight :32,
  },
  count: {
    paddingLeft: 4,
    paddingRight: 4,
    minWidth: 40,
  },
});
