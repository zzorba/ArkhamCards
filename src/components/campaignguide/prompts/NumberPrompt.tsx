import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import SetupStepWrapper from '../SetupStepWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../ScenarioGuideContext';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { BulletType, Effect, Option } from '@data/scenario/types';
import typography from '@styles/typography';
import space from '@styles/space';

interface Props {
  id: string;
  bulletType?: BulletType;
  prompt: string;
  longLived?: boolean;
  delta?: boolean;
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

  currentValue(): number {
    const { id, longLived } = this.props;

    if (longLived) {
      return this.context.scenarioState.count(`${id}#live`) || 0;
    }
    return this.state.value;
  }

  _inc = () => {
    const { id, longLived, max } = this.props;
    if (longLived) {
      const value = this.context.scenarioState.count(`${id}#live`) || 0;
      const newValue = value + 1;
      this.context.scenarioState.setCount(`${id}#live`,
        max ? Math.min(newValue, max) : newValue
      );
    } else {
      this.setState(state => {
        const newValue = state.value + 1;
        return {
          value: max ? Math.min(newValue, max) : newValue,
        };
      });
    }
  };

  _dec = () => {
    const { id, longLived, min } = this.props;
    if (longLived) {
      const value = this.context.scenarioState.count(`${id}#live`) || 0;
      const newValue = value - 1;
      this.context.scenarioState.setCount(`${id}#live`,
        Math.max(newValue, min || 0)
      );
    } else {
      this.setState(state => {
        return {
          value: Math.max(state.value - 1, min || 0),
        };
      });
    }
  };

  _submit = () => {
    const {
      id,
    } = this.props;
    this.context.scenarioState.setCount(
      id,
      this.currentValue()
    );
  };

  renderCount(count: number) {
    const { delta } = this.props;
    return (
      <View style={[styles.count, space.paddingSideXs, delta ? styles.countDelta : {}]}>
        <Text style={[typography.bigGameFont, typography.center]}>
          { delta && count >= 0 ? '+ ' : '' }{ count }
        </Text>
      </View>
    );
  }

  renderPrompt(count?: number) {
    const { prompt } = this.props;
    const value = this.currentValue();
    return (
      <View style={styles.promptRow}>
        <View style={styles.text}>
          <CampaignGuideTextComponent text={prompt} />
          { count !== undefined && (
            <View style={space.paddingLeftS}>
              <Text style={[typography.gameFont, typography.bold]}>
                { count }
              </Text>
            </View>
          ) }
        </View>
        { count === undefined && (
          <PlusMinusButtons
            count={value}
            min={this.props.min}
            max={this.props.max}
            onIncrement={this._inc}
            onDecrement={this._dec}
            countRender={this.renderCount(value)}
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
            <View style={space.paddingTopS}>
              { !!text && (
                <SetupStepWrapper bulletType={bulletType}>
                  <CampaignGuideTextComponent text={text} />
                </SetupStepWrapper>
              ) }
              { !!confirmText && (
                <SetupStepWrapper bulletType="small">
                  <CampaignGuideTextComponent 
                    text={count === undefined ? t`${confirmText} <i>(included automatically)</i>` : confirmText} 
                  />
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
                <BasicButton title={t`Proceed`} onPress={this._submit} />
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
    minWidth: 40,
  },
  countDelta: {
    minWidth: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});
