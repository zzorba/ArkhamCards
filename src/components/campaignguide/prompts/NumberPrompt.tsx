import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import PlusMinusButtons from 'components/core/PlusMinusButtons';
import { BulletType, Effect, Option } from 'data/scenario/types';
import typography from 'styles/typography';

interface Props {
  id: string;
  bulletType?: BulletType;
  prompt: string;
  confirmText?: string;
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
      <View style={styles.promptRow}>
        <View style={styles.text}>
          <CampaignGuideTextComponent text={prompt} />
        </View>
        { count !== undefined ? (
          this.renderCount(count)
        ) : (
          <PlusMinusButtons
            count={this.state.value}
            min={this.props.min}
            max={this.props.max}
            onIncrement={this._inc}
            onDecrement={this._dec}
            countRender={this.renderCount(this.state.value)}
          />
        ) }
      </View>
    );
  }

  render() {
    const { id, bulletType, text, confirmText } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ scenarioState }: ScenarioGuideContextType) => {
          const count = scenarioState.count(id);
          return (
            <View style={styles.wrapper}>
              { !!text && (
                <SetupStepWrapper bulletType={bulletType}>
                  <CampaignGuideTextComponent text={text} />
                </SetupStepWrapper>
              ) }
              <SetupStepWrapper
                bulletType={count === undefined ? 'none' : 'small'}
                border={count === undefined}
              >
                <View style={styles.content}>
                  { this.renderPrompt(count) }
                </View>
              </SetupStepWrapper>
              { (count === undefined) && (
                <View style={styles.buttonWrapper}>
                  <Button title={t`Proceed`} onPress={this._submit} />
                </View>
              ) }
              { count !== undefined && !!confirmText && (
                <SetupStepWrapper bulletType="small">
                  <CampaignGuideTextComponent text={confirmText} />
                </SetupStepWrapper>
              ) }
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
  content: {
    flexDirection: 'column',
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  buttonWrapper: {
    padding: 8,
  },
});
