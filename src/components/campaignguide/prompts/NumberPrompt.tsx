import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CardTextComponent from 'components/card/CardTextComponent';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { BulletType, Effect, Option } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  id: string;
  bulletType?: BulletType;
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

  renderCount(count: number) {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center]}>
          { count }
        </Text>
      </View>
    );
  }

  renderPrompt(count?: number) {
    const { prompt } = this.props;
    return (
      <>
        <View style={styles.promptRow}>
          <CardTextComponent text={prompt} />
          { count !== undefined ? (
            this.renderCount(count)
          ) : (
            <PlusMinusButtons
              count={this.state.value}
              limit={this.props.max}
              min={this.props.min}
              onIncrement={this._inc}
              onDecrement={this._dec}
              countRender={this.renderCount(this.state.value)}
            />
          ) }
        </View>
      </>
    );
  }

  render() {
    const { id, bulletType, text } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const count = scenarioState.count(id);
          return (
            <View style={styles.wrapper}>
              <SetupStepWrapper bulletType={bulletType}>
                { !!text && <CardTextComponent text={text} /> }
              </SetupStepWrapper>
              <SetupStepWrapper
                bulletType={count === undefined ? 'none' : 'small'}
                border={count === undefined}
              >
                { this.renderPrompt(count) }
                { (count === undefined) && <Button title="Done" onPress={this._submit} /> }
              </SetupStepWrapper>
            </View>
          );
        } }
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
  wrapper: {
    paddingTop: 8,
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
